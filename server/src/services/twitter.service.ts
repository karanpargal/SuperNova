import { auth } from "twitter-api-sdk";
import dotenv from "dotenv";
import { debug } from "console";
dotenv.config();

export class TwitterService {
  private client: auth.OAuth2User;
  private STATE: string = process.env.STATE!;

  constructor() {
    this.client = new auth.OAuth2User({
      client_id: process.env.TWITTER_CLIENT_ID!,
      client_secret: process.env.TWITTER_CLIENT_SECRET!,
      callback: process.env.TWITTER_CALLBACK_URL!,
      scopes: ["tweet.read", "users.read", "offline.access"],
    });
  }

  async login(): Promise<string> {
    const authUrl = `https://twitter.com/i/oauth2/authorize?response_type=code&client_id=${process.env.TWITTER_CLIENT_ID}&redirect_uri=${process.env.TWITTER_CALLBACK_URL}&scope=tweet.read+users.read+offline.access&state=${process.env.STATE}&code_challenge=challenge&code_challenge_method=plain`;
    return authUrl;
  }

  async getCallback(code: string, state: string): Promise<string | void> {
    try {
      if (state !== this.STATE) {
        throw new Error("Invalid state");
      }

      const params = new URLSearchParams();
      params.append("grant_type", "authorization_code");
      params.append("code", code);
      params.append("redirect_uri", process.env.TWITTER_CALLBACK_URL!);
      params.append("client_id", process.env.TWITTER_CLIENT_ID!);
      params.append("code_verifier", "challenge");

      const res = await fetch(`https://api.twitter.com/2/oauth2/token`, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: `Basic ${Buffer.from(
            `${process.env.TWITTER_CLIENT_ID}:${process.env.TWITTER_CLIENT_SECRET}`
          ).toString("base64")}`,
        },
        body: params.toString(),
      });

      const twitterResponse = await res.json();
      const accessToken = twitterResponse.access_token;

      console.log("Access token:", twitterResponse);

      return `
        <html>
        <body>
          <p>You have been authenticated with this platform. You can close the window now.</p>
          <script>
            // Pass the access token and status to the parent window
            window.opener.postMessage({ token: ${JSON.stringify(
              accessToken
            )}, status: "Login successful" }, "*");
    
            // Close the window after a delay
            setTimeout(() => {
              window.close();
            }, 3000); // 3 seconds delay
          </script>
        </body>
        </html>
      `;
    } catch (error) {
      console.log(error);
    }
  }

  async getUserData(
    accessToken: string,
    _userId?: string
  ): Promise<
    | {
        id: string;
        name: string;
        username: string;
      }
    | undefined
  > {
    if (_userId != null) {
      return {
        id: _userId,
        name: `Dev Mode User ${_userId}`,
        username: `devuser-${_userId}`,
      };
    }
    debug("[getUserData] _userId not mentioned, invoking twitter API...");
    try {
      const res = await fetch("https://api.twitter.com/2/users/me", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (res.ok) {
        const userResponse = await res.json();
        return userResponse.data;
      }
      return undefined;
    } catch (err) {
      console.error("Twitter API error:", err);
    }
  }

  async logout(): Promise<
    | {
        revoked: boolean;
      }
    | undefined
  > {
    try {
      const response = await this.client.revokeAccessToken();
      return response;
    } catch (error) {
      console.log(error);
    }
  }
}
