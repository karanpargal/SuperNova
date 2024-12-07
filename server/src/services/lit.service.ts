import {
  createSiweMessageWithRecaps,
  generateAuthSig,
} from "@lit-protocol/auth-helpers";
import { LIT_NETWORK, LIT_NETWORK_VALUES } from "@lit-protocol/constants";
import { LitNodeClient } from "@lit-protocol/lit-node-client";
import { AuthSig, LitResourceAbilityRequest } from "@lit-protocol/types";
import { debug, trace } from "console";
import { BigNumber, ethers, Signer } from "ethers";
import { SiweMessage } from "siwe";
import { generateIdSync } from "../utils/functions/helper";
import { LitContracts } from "@lit-protocol/contracts-sdk";

export class LitService {
  public readonly litNetwork: LIT_NETWORK_VALUES = LIT_NETWORK.DatilTest;
  public readonly litNodeClient: LitNodeClient;
  public readonly litContracts: LitContracts;

  constructor() {
    this.litNodeClient = new LitNodeClient({
      litNetwork: this.litNetwork,
      debug: true,
    });
    this.litContracts = new LitContracts({
      network: this.litNetwork,
      signer: this.getMinterWallet(),
    });
    this.litContracts.connect();
  }

  public init = async (): Promise<void> => {
    await this.litNodeClient.connect();
  };

  async getLitClient() {
    return this.litNodeClient;
  }

  /**
   * Generate session signatures
   * @param signer The signer wallet
   * @param resources The resource abilities
   * @param chainId
   * @param expirationTime
   * @param statement
   * @returns
   */
  async generateSessionSigs(
    signer: Signer,
    resources: LitResourceAbilityRequest[],
    chainId = 1,
    expirationTime?: string,
    statement = "Generate a session signature"
  ) {
    trace("[generateSessionSigs] generate request: %O", {
      resources,
      chainId,
      expirationTime,
      statement,
    });
    const sessionSigs = await this.litNodeClient.getSessionSigs({
      chain: "ethereum",
      expiration:
        expirationTime ?? new Date(Date.now() + 5 * 60 * 1000).toISOString(),
      resourceAbilityRequests: resources,
      capabilityAuthSigs: [await this.createCapacityDelegationAuthSig()],
      authNeededCallback: async (callbackParams) => {
        const { resourceAbilityRequests, uri, expiration } = callbackParams;
        debug("[generateSessionSigs] AuthCallbackParams: %O", callbackParams);
        const toSign = await createSiweMessageWithRecaps({
          uri: uri ?? "",
          resources: resourceAbilityRequests ?? [],
          expiration:
            expiration ?? new Date(Date.now() + 5 * 60 * 1000).toISOString(),
          chainId,
          walletAddress: await signer.getAddress(),
          nonce: generateIdSync(16, "0123456789"),
          domain: "supranova.wtf",
          statement,
          litNodeClient: this.litNodeClient,
          version: "1",
        });
        trace("[generateSessionSigs:authNeededCallback] toSign: %O", toSign);
        return generateAuthSig({
          signer,
          toSign,
          address: await signer.getAddress(),
        });
      },
    });
    debug("[generateSessionSigs] Session sigs: %O", sessionSigs);
    return sessionSigs;
  }

  /**
   * Generate an auth signature
   * @param signer - Signer
   * @param chainId - Chain id
   * @returns
   */
  async generateAuthSig(
    signer: Signer,
    chainId = 1,
    uri = "https://supranova.wtf",
    resources?: string[],
    expirationTime?: string,
    statement = "Generate a signature for the PKP"
  ) {
    trace("[generateAuthSig] generate request: %O", {
      chainId,
      uri,
      resources,
      expirationTime,
      statement,
    });
    const siweMsg = new SiweMessage({
      address: await signer.getAddress(),
      chainId,
      uri,
      domain: "supranova.wtf",
      resources: resources ?? [],
      expirationTime:
        expirationTime ?? new Date(Date.now() + 5 * 60 * 1000).toISOString(),
      issuedAt: new Date().toISOString(),
      version: "1",
      nonce: generateIdSync(16, "0123456789"),
      statement,
    });

    debug("[generateAuthSig] SIWE message: %O", siweMsg);
    const msg = siweMsg.prepareMessage();
    const sig = await signer.signMessage(msg);
    const authSig: AuthSig = {
      sig,
      derivedVia: "web3.eth.personal.sign",
      signedMessage: msg,
      address: siweMsg.address,
    };
    return authSig;
  }

  getMinterWallet(rpc_url = "https://yellowstone-rpc.litprotocol.com/") {
    const provider = rpc_url
      ? new ethers.providers.JsonRpcProvider(rpc_url)
      : ethers.getDefaultProvider();

    if (!process.env.MINTER_PRIVATE_KEY) {
      throw new Error("MINTER_PRIVATE_KEY is not set");
    }
    const pvtKey = process.env.MINTER_PRIVATE_KEY;
    const wallet = new ethers.Wallet(pvtKey, provider);

    return wallet;
  }

  async createCapacityDelegationAuthSig(
    pkpEthAddress?: string,
    signer?: Signer
  ) {
    console.log(
      "[createCapacityDelegationAuthSig] Creating capacity delegation auth sig"
    );
    signer = signer ?? this.getMinterWallet();
    let capacityTokenId = process.env.LIT_CAPACITY_CREDIT_TOKEN_ID ?? "";
    if (capacityTokenId === "" || capacityTokenId === undefined) {
      console.log("No Capacity Credit provided, minting a new one...");
      capacityTokenId = (
        await this.litContracts.mintCapacityCreditsNFT({
          requestsPerKilosecond: 10,
          daysUntilUTCMidnightExpiration: 7,
        })
      ).capacityTokenIdStr;
      console.log(`Minted new Capacity Credit with ID: ${capacityTokenId}`);
    } else {
      console.log(
        `Using provided Capacity Credit with ID: ${process.env.LIT_CAPACITY_CREDIT_TOKEN_ID}`
      );
    }
    const { capacityDelegationAuthSig } =
      await this.litNodeClient.createCapacityDelegationAuthSig({
        uses: "1",
        dAppOwnerWallet: signer,
        capacityTokenId,
        delegateeAddresses: [
          ...(pkpEthAddress != null ? [pkpEthAddress] : []),
          await signer.getAddress(),
        ],
      });
    console.log(
      "[createCapacityDelegationAuthSig] Capacity delegation auth sig created",
      capacityDelegationAuthSig
    );
    return capacityDelegationAuthSig;
  }
}
