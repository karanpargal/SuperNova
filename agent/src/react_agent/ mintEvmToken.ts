import { Tool } from "@langchain/core/tools";
import axios from "axios";

export class ExecuteEthMintTool extends Tool {
  name = "execute_eth_mint";
  description = `Execute an ETH token mint function through an API.
    Input should be a comma-separated string with: contract_address, recipient_address, token_id, amount
    The amount should be in the smallest unit of the token (e.g., for 1 token with 18 decimals, use 1000000000000000000).`;

  protected async _call(input: string): Promise<string> {
    try {
      const [contractAddress, recipientAddress, tokenId, amount] =
        input.split(",");

      const payload = {
        contract: contractAddress,
        recipient: recipientAddress,
        token_id: tokenId,
        value: amount,
      };

      const apiUrl = "https://test.com/api/v1/execute-eth-mint";

      const response = await axios.post(
        apiUrl,
        {
          network_name: "ETH_TESTNET",
          transaction_payload: payload,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      return `Mint transaction submitted: ${JSON.stringify(response.data)}`;
    } catch (error: any) {
      return `Error executing mint transaction: ${error.message}`;
    }
  }
}
