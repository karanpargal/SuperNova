import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import cors from "cors";
import { LitService } from "./services/lit.service";
import { BotAccountService } from "./services/bot.service";
import { TwitterService } from "./services/twitter.service";

dotenv.config();

const app: Express = express();
app.use(express.json());
app.use(cors());
const port = process.env.PORT || 3000;

app.get("/", (req: Request, res: Response) => {
  res.send("Express + TypeScript Server");
});

app.post("/mint", async (req: Request, res: Response) => {
  try {
    const litService = new LitService();
    console.log("init litService");
    await litService.init();
    console.log("init botService");
    const botService = new BotAccountService(litService);
    console.log("minting PKP");
    const mintResult = await botService.mintPKP(
      req.body.accessToken,
      req.body.ipfsHash
    );
    res.status(200).json(mintResult);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/twitter/login", async (req: Request, res: Response) => {
  try {
    const twitterService = new TwitterService();
    const authUrl = await twitterService.login();
    res.status(302).redirect(authUrl);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/twitter/callback", async (req: Request, res: Response) => {
  try {
    const twitterService = new TwitterService();
    console.log(req.query);
    const callbackResult = await twitterService.getCallback(
      req.query.code as string,
      req.query.state as string
    );
    res.status(200).send(callbackResult);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
