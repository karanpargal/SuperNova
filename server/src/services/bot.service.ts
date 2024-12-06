import { debug } from "console";
import { TwitterService } from "./twitter.service";
import { SupabaseService } from "./supabase.service";
import {
  AUTH_METHOD_SCOPE,
  AUTH_METHOD_TYPE,
  LIT_ABILITY,
  LIT_NETWORK_VALUES,
} from "@lit-protocol/constants";
import { BigNumber, ethers, providers } from "ethers";
import { LitContracts } from "@lit-protocol/contracts-sdk";
import { JsonExecutionSdkParams } from "@lit-protocol/types";
import { LitActionResource, LitPKPResource } from "@lit-protocol/auth-helpers";
import { LitService } from "./lit.service";
import { bs58Decode, hashString } from "../utils/functions/helper";

export class BotAccountService {
  private readonly twitterService: TwitterService;
  private readonly supabaseService: SupabaseService;
  private readonly CUSTOM_AUTH_TYPE: string = process.env.BOT_CUSTOM_AUTH_TYPE!;
  public litContracts: LitContracts;

  constructor(private readonly litService: LitService) {
    this.twitterService = new TwitterService();
    this.supabaseService = new SupabaseService();
    this.litContracts = new LitContracts({
      signer: this.litService.getMinterWallet(),
      network: this.litService.litNetwork,
    });
    this.litContracts.connect();
  }

  async mintPKP(
    accessToken: string,
    ipfsHash: string
  ): Promise<{
    receipt?: providers.TransactionReceipt;
    tokenId?: BigNumber;
    pkpEthAddress: string;
    litNetwork: LIT_NETWORK_VALUES;
    keyId: string;
  }> {
    const userData = await this.twitterService.getUserData(accessToken);
    if (!userData) {
      throw new Error("Failed to get user data");
    }
    const userId = userData.id;
    debug("[mintPKP] userId: %s", userId);
    const botPK = `TWT#USER#BOT:${userId}`;

    const pkpExists = await this.supabaseService.getPkp(
      botPK,
      this.litService.litNetwork
    );
    if (pkpExists) {
      debug("[mintPKP] PKP already exists IN DB: %O", pkpExists);
      return {
        pkpEthAddress: pkpExists.address,
        litNetwork: this.litService.litNetwork,
        keyId: `${ipfsHash}_${userId}`,
      };
    }
    debug(
      "[getPKPAddress] PKP does not exist in DB, trying to counterfactually calculate..."
    );
    await this.litService.init();
    const nodeClient = await this.litService.getLitClient();
    const contractClient = await this.litContracts;
    const minter = await this.litService.getMinterWallet();
    const sessionSigs = await this.litService.generateSessionSigs(minter, [
      {
        resource: new LitPKPResource("*"),
        ability: LIT_ABILITY.PKPSigning,
      },
      {
        resource: new LitActionResource("*"),
        ability: LIT_ABILITY.LitActionExecution,
      },
    ]);
    debug("[mintPKP] sessionSigs: %O", sessionSigs);
    const params: JsonExecutionSdkParams = {
      sessionSigs,
      ipfsId: ipfsHash,
      jsParams: {
        accessToken,
        method: "claimKey",
      },
    };
    debug("[mintPKP] Lit action params: %O", params);
    const response = await nodeClient.executeJs(params);

    debug("[mintPKP] claimKey response: %O", response);
    const claim = response.claims![accessToken];
    const publicKey =
      await contractClient.pubkeyRouterContract.read.getDerivedPubkey(
        contractClient.stakingContract.read.address,
        `0x${claim.derivedKeyId}`
      );
    debug("[mintPKP] Derived public key: %s", publicKey);
    debug(
      "[mintPKP] Derived ETH address: %s",
      ethers.utils.computeAddress(publicKey)
    );
    const keyId = `${ipfsHash}_${userId}`;
    debug("[mintPKP] keyId: %s", keyId);
    const claimTx =
      await contractClient.pkpHelperContract.write.claimAndMintNextAndAddAuthMethods(
        {
          derivedKeyId: claim.derivedKeyId,
          signatures: claim.signatures,
          keyType: 2,
        },
        {
          keyType: 2,
          permittedIpfsCIDs: [],
          permittedIpfsCIDScopes: [],
          permittedAddresses: [],
          permittedAddressScopes: [],
          permittedAuthMethodTypes: [
            BigNumber.from(hashString(this.CUSTOM_AUTH_TYPE)),
            BigNumber.from(AUTH_METHOD_TYPE.LitAction),
          ],
          permittedAuthMethodIds: [hashString(keyId), bs58Decode(ipfsHash)],
          permittedAuthMethodPubkeys: [`0x`, `0x`],
          permittedAuthMethodScopes: [
            [
              BigNumber.from(AUTH_METHOD_SCOPE.SignAnything),
              BigNumber.from(AUTH_METHOD_SCOPE.PersonalSign),
            ],
            [
              BigNumber.from(AUTH_METHOD_SCOPE.SignAnything),
              BigNumber.from(AUTH_METHOD_SCOPE.PersonalSign),
            ],
          ],
          addPkpEthAddressAsPermittedAddress: true,
          sendPkpToItself: true,
        }
        // [
        //   {
        //     id: hashString(keyId),
        //     type: BigNumber.from(
        //       ethers.utils.keccak256(
        //         Buffer.from(this.CUSTOM_AUTH_TYPE, "utf-8")
        //       )
        //     ),
        //     scopes: [
        //       BigNumber.from(AUTH_METHOD_SCOPE.SignAnything),
        //       BigNumber.from(AUTH_METHOD_SCOPE.PersonalSign),
        //     ],
        //   },
        //   {
        //     id: bs58Decode(ipfsHash),
        //     type: BigNumber.from(AUTH_METHOD_TYPE.LitAction),
        //     scopes: [
        //       BigNumber.from(AUTH_METHOD_SCOPE.SignAnything),
        //       BigNumber.from(AUTH_METHOD_SCOPE.PersonalSign),
        //     ],
        //   },
        // ]
      );
    const claimTxReceipt = await claimTx.wait(1);
    debug("[mintPKP] PKP claim receipt: %O", claimTxReceipt);
    // Find the event that contains the token ID
    const mintEvent = claimTxReceipt.events!.find(
      (event) => event.event === "Transfer"
    );

    // Extract the token ID from the event arguments
    const tokenId = mintEvent!.args!.tokenId;
    const pkpEthAddress =
      await contractClient.pkpNftContract.read.getEthAddress(
        BigNumber.from(tokenId)
      );
    await this.supabaseService.savePkp(
      botPK,
      pkpEthAddress,
      keyId,
      this.litService.litNetwork
    );
    return {
      receipt: claimTxReceipt,
      tokenId: tokenId!,
      pkpEthAddress,
      litNetwork: this.litService.litNetwork,
      keyId,
    };
  }
}
