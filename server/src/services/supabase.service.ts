import { LIT_NETWORK_VALUES } from "@lit-protocol/constants";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

export type pkpSchema = {
  id: string;
  pkp_eth_address: string;
  created_at: string;
  token_id: string;
  key_id: string;
};

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

  public getPkp = async (userId: string) => {
    const supabase = SupabaseService.getSupabase();
    const { data, error } = await supabase
      .from("pkps")
      .select("*")
      .eq("id", userId);
    if (error) {
      console.error("[supabaseError]: %O", error);
    }
    return data?.[0];
  };

  public savePkp = async ({
    id,
    key_id,
    pkp_eth_address,
    token_id,
  }: Omit<pkpSchema, "created_at">) => {
    const supabase = SupabaseService.getSupabase();
    const { data, error } = await supabase
      .from("pkps")
      .insert({
        id,
        key_id,
        pkp_eth_address,
        token_id,
      })
      .select();
    if (error) {
      console.error("[supabaseError]: %O", error);
    }
    return data?.[0];
  };
}
