import { Tool } from "@langchain/core/tools";
import axios from "axios";

export class ExecuteEthTransferTool extends Tool {
  name = "execute_eth_transfer";
  description = `Execute an ETH transfer through an API.
  Input should be a comma-separated string with: sender_address, recipient_address, amount
  The amount should be in wei (e.g., for 1 ETH, use 1000000000000000000).`;

  protected async _call(input: string): Promise<string> {
    try {
      const [senderAddress, recipientAddress, amount] = input.split(",");

      const payload = {
        sender: senderAddress,
        recipient: recipientAddress,
        value: amount,
      };

      const apiUrl = "https://test.com/api/v1/execute-eth-transfer";

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

      return `Transaction submitted: ${JSON.stringify(response.data)}`;
    } catch (error: any) {
      return `Error executing ETH transfer: ${error.message}`;
    }
  }
}
