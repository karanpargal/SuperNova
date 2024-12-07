import { LitContracts } from "@lit-protocol/contracts-sdk";
import bs58 from "bs58";
import { ethers, utils } from "ethers";

export function hashString(keyId: string): string {
  try {
    return utils.keccak256(Buffer.from(keyId, "utf-8"));
  } catch (error: any) {
    throw new Error(`Failed to hash string: ${error.message}`);
  }
}

export function generateIdSync(length: number, charset: string): string {
  let result = "";
  const charsetLength = charset.length;

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charsetLength);
    result += charset[randomIndex];
  }

  return result;
}

export function bs58Decode(ipfsHash: string): Uint8Array {
  try {
    return bs58.decode(ipfsHash);
  } catch (error: any) {
    throw new Error(`Failed to decode IPFS hash: ${error.message}`);
  }
}

export const getPkpInfoFromMintReceipt = async (
  txReceipt: ethers.ContractReceipt,
  litContractsClient: LitContracts
) => {
  const pkpMintedEvent = txReceipt!.events!.find(
    (event) =>
      event.topics[0] ===
      "0x3b2cc0657d0387a736293d66389f78e4c8025e413c7a1ee67b7707d4418c46b8"
  );

  const publicKey = "0x" + pkpMintedEvent!.data.slice(130, 260);
  const tokenId = ethers.utils.keccak256(publicKey);
  const ethAddress = await litContractsClient.pkpNftContract.read.getEthAddress(
    tokenId
  );

  return {
    tokenId: ethers.BigNumber.from(tokenId).toString(),
    publicKey,
    ethAddress,
  };
};

export type TokenResponse = {
    txHash: string;
    result: string;
    tokenDetails: {
        tokenType: string;
        name: string;
        symbol: string;
        initialSupply: number;
        owner: string;
        contractAddress: string;
        tokenIdentifier: string;
    }
}