import { LIT_NETWORK_VALUES } from "@lit-protocol/constants";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

export class SupabaseService {
  private static anonClient: SupabaseClient;

  public static init = (): void => {
    if (process.env.SUPABASE_URL! && process.env.SUPABASE_KEY!) {
      this.anonClient = createClient(
        process.env.SUPABASE_URL!,
        process.env.SUPABASE_KEY!
      );
      console.info("Supabase Service initiated successfully!");
    } else {
      console.error("Missing env variables.");
      process.exit(1);
    }
  };

  public static getSupabase = (access_token?: string): SupabaseClient => {
    if (access_token) {
      return createClient(
        process.env.SUPABASE_URL!,
        process.env.SUPABASE_KEY!,
        {
          global: {
            headers: {
              authorization: `Bearer ${access_token}`,
            },
          },
        }
      );
    }

    if (!this.anonClient) {
      this.init();
    }

    return this.anonClient;
  };

  public getPkp = async (botPK: string, litNetwork: LIT_NETWORK_VALUES) => {
    return null;
  };

  public savePkp = async (
    botPK: string,
    pkpEthAddress: string,
    keyId: string,
    litNetwork: LIT_NETWORK_VALUES
  ) => {
    return {
      address: "0x1234567890",
    };
  };
}
