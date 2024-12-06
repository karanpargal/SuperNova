import bs58 from "bs58";
import crypto from "crypto";

export function hashString(keyId: string): string {
  try {
    const hash = crypto.createHash("sha256");
    hash.update(keyId, "utf8");
    return hash.digest("hex");
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
