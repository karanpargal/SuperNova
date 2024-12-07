import { Tool } from "@langchain/core/tools";
import axios from "axios";

export class ExecuteMintTransactionTool extends Tool {
  name = "execute_mint_transaction";
  description = `Execute a Move mint function through an API.
  Input should be a comma-separated string with: module_address, module_name, function_name, recipient_address, token_id, amount
  The recipient_address must be fetched from the latest data, and amount should be in atomic units (e.g., for 1 token, use 1000000).`;

  protected async _call(input: string): Promise<string> {
    try {
      const [
        moduleAddress,
        moduleName,
        functionName,
        recipientAddress,
        tokenId,
        amount,
      ] = input.split(",");

      const payload = {
        function: `${moduleAddress}::${moduleName}::${functionName}`,
        type_arguments: [],
        arguments: [recipientAddress, tokenId, amount],
      };

      const encodedPayload = {
        type: "entry_function_payload",
        payload,
      };

      const apiUrl = "https://test.com/api/v1/execute-mint-transaction";

      const response = await axios.post(
        apiUrl,
        {
          network_name: "SUPRA_TESTNET",
          transaction_payload: encodedPayload,
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
