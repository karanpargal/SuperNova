import { debug } from "console";
import { TwitterService } from "./twitter.service";
import { SupabaseService } from "./supabase.service";
import {
  AUTH_METHOD_SCOPE,
  AUTH_METHOD_TYPE,
  LIT_ABILITY,
  LIT_NETWORK_VALUES,
} from "@lit-protocol/constants";
import { BigNumber, ethers, providers, utils } from "ethers";
import { LitContracts } from "@lit-protocol/contracts-sdk";
import { JsonExecutionSdkParams } from "@lit-protocol/types";
import { LitActionResource, LitPKPResource } from "@lit-protocol/auth-helpers";
import { LitService } from "./lit.service";
import {
  bs58Decode,
  getPkpInfoFromMintReceipt,
  hashString,
} from "../utils/functions/helper";

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
    ipfsHash: string,
    _userId?: string
  ): Promise<{
    receipt?: providers.TransactionReceipt;
    tokenId?: string;
    pkpEthAddress: string;
    litNetwork: LIT_NETWORK_VALUES;
    keyId: string;
  }> {
    const userData = await this.twitterService.getUserData(
      accessToken,
      _userId
    );
    if (!userData) {
      throw new Error("Failed to get user data");
    }
    const userId = userData.id;
    debug("[mintPKP] userId: %s", userId);

    const pkpExists = await this.supabaseService.getPkp(userId);
    if (pkpExists) {
      debug("[mintPKP] PKP already exists IN DB: %O", pkpExists);
      return {
        pkpEthAddress: pkpExists.pkp_eth_address,
        litNetwork: this.litService.litNetwork,
        keyId: pkpExists.key_id,
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
        isDev: true,
        overrideUserID: userId,
      },
    };
    debug("[mintPKP] Lit action params: %O", params);
    const response = await nodeClient.executeJs(params);

    debug("[mintPKP] claimKey response: %O", response);
    const claim = response.claims![userId];
    debug("[mintPKP] claim: %O", claim);
    const derivedKeyId = `0x${claim.derivedKeyId}`;
    debug("[mintPKP] derivedKeyId: %s", derivedKeyId);
    const publicKey =
      await contractClient.pubkeyRouterContract.read.getDerivedPubkey(
        contractClient.stakingContract.read.address,
        derivedKeyId
      );
    debug("[mintPKP] Derived public key: %s", publicKey);
    debug(
      "[mintPKP] Derived ETH address: %s",
      ethers.utils.computeAddress(publicKey)
    );
    const keyId = `${ipfsHash}_${userId}`;
    debug("[mintPKP] keyId: %s", keyId);
    const mintCost = await contractClient.pkpNftContract.read.mintCost();
    debug("[mintPKP] mintCost:", mintCost);

    console.log(
      "data:",
      {
        derivedKeyId,
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
        permittedAuthMethodIds: [
          hashString(keyId),
          utils.arrayify(bs58Decode(ipfsHash)),
        ],
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
    );
    const claimTx =
      await contractClient.pkpHelperContract.write.claimAndMintNextAndAddAuthMethodsWithTypes(
        {
          derivedKeyId,
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
          permittedAuthMethodIds: [
            hashString(keyId),
            utils.arrayify(bs58Decode(ipfsHash)),
          ],
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
        },
        {
          value: mintCost,
          gasLimit: "100000000",
        }
      );

    debug("[mintPKP] PKP claim transaction: %O", claimTx);
    const claimTxReceipt = await claimTx.wait(1);
    debug("[mintPKP] claimTxReceipt: %O", claimTxReceipt);
    const pkpInfo = await getPkpInfoFromMintReceipt(
      claimTxReceipt,
      this.litContracts
    );
    debug("[mintPKP] pkpInfo: %O", pkpInfo);
    const permittedAuthMethods =
      await this.litContracts.pkpPermissionsContract.read.getPermittedAuthMethods(
        pkpInfo.tokenId
      );
    debug("[mintPKP] retrieved permittedAuthMethods: %O", permittedAuthMethods);
    const pkpEthAddress =
      await contractClient.pkpNftContract.read.getEthAddress(
        BigNumber.from(pkpInfo.tokenId)
      );
    debug("[mintPKP] pkpEthAddress: %s", pkpEthAddress);
    const res = await this.supabaseService.savePkp({
      id: userId,
      key_id: keyId,
      pkp_eth_address: pkpEthAddress,
      token_id: pkpInfo.tokenId!,
    });
    debug("[mintPKP] saved pkp in Supabase: %O", res);
    return {
      tokenId: pkpInfo.tokenId!,
      pkpEthAddress,
      keyId,
      receipt: claimTxReceipt,
      litNetwork: this.litService.litNetwork,
    };
  }
}
