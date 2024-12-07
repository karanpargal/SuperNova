import { LIT_NETWORK_VALUES } from "@lit-protocol/constants";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { TokenResponse } from "../utils/functions/helper";

export type pkpSchema = {
  id: string;
  pkp_eth_address: string;
  created_at: string;
  token_id: string;
  key_id: string;
  pkp_public_key: string;
};

export type supraAccountSchema = {
  id: string;
  created_at: string;
  ciphertext: string;
  address: string;
  data_to_encrypt_hash: string;
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
    return data?.[0] as pkpSchema | undefined;
  };

  public savePkp = async ({
    id,
    key_id,
    pkp_eth_address,
    token_id,
    pkp_public_key,
  }: Omit<pkpSchema, "created_at">) => {
    const supabase = SupabaseService.getSupabase();
    const { data, error } = await supabase
      .from("pkps")
      .insert({
        id,
        key_id,
        pkp_eth_address,
        token_id,
        pkp_public_key,
      })
      .select();
    if (error) {
      console.error("[supabaseError]: %O", error);
    }
    return data?.[0];
  };

  public saveSupraAccount = async ({
    id,
    ciphertext,
    address,
    data_to_encrypt_hash,
  }: Omit<supraAccountSchema, "created_at">) => {
    const supabase = SupabaseService.getSupabase();
    const { data, error } = await supabase
      .from("supra_accounts")
      .insert({
        id,
        ciphertext,
        address,
        data_to_encrypt_hash,
      })
      .select();
    if (error) {
      console.error("[supabaseError]: %O", error);
    }
    return data?.[0];
  };

  public getSupraAccount = async (userId: string) => {
    const supabase = SupabaseService.getSupabase();
    const { data, error } = await supabase
      .from("supra_accounts")
      .select("*")
      .eq("id", userId);
    if (error) {
      console.error("[supabaseError]: %O", error);
    }
    return data?.[0];
  };

  public saveToken = async (token: TokenResponse) => {
    const {
      contractAddress,
      tokenIdentifier,
      tokenType,
      initialSupply,
      name,
      owner,
      symbol,
    } = token.tokenDetails;
    const supabase = SupabaseService.getSupabase();
    const { data, error } = await supabase
      .from("tokens")
      .insert({
        contract_address: contractAddress,
        token_identifier: tokenIdentifier,
        token_type: tokenType,
        initial_supply: initialSupply,
        name,
        owner,
        symbol,
      })
      .select();
    if (error) {
      console.error("[supabaseError]: %O", error);
    }
    return data?.[0];
  };
}
