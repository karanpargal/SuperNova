import { auth } from "twitter-api-sdk";
import dotenv from "dotenv";
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
    const authUrl = this.client.generateAuthURL({
      state: this.STATE,
      code_challenge_method: "s256",
    });
    return authUrl;
  }

  async getCallback(code: string, state: string): Promise<string | void> {
    try {
      if (state !== this.STATE) {
        throw new Error("Invalid state");
      }

      const accessToken = (await this.client.requestAccessToken(code as string))
        .token.access_token;

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

  async getUserData(accessToken: string): Promise<
    | {
        id: string;
        name: string;
        username: string;
      }
    | undefined
  > {
    try {
      const res = await fetch("https://api.x.com/2/users/me", {
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
      console.error("twt err:", err);
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
