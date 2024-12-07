import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import cors from "cors";
import { LitService } from "./services/lit.service";
import { BotAccountService } from "./services/bot.service";
import { TwitterService } from "./services/twitter.service";
import fs from "fs";
import FormData = require("form-data");
import { akaveWrapper } from "./utils/functions/akave-wrapper";
import path = require("path");

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
      req.body.ipfsHash,
      req.body.userId
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
    const callbackResult = await twitterService.getCallback(
      req.query.code as string,
      req.query.state as string
    );
    res.status(200).send(callbackResult);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// @ts-expect-error - req is not used
app.post("/akave/upload-lit-bundle", async (req: Request, res: Response) => {
  try {
    const form = new FormData();
    const filePath = req.body.filePath;

    if (!filePath || !fs.existsSync(filePath)) {
      return res
        .status(400)
        .json({ error: "File path is invalid or does not exist" });
    }

    form.append("file", fs.createReadStream(filePath));

    const response = await akaveWrapper(
      "buckets/LitTranslations/files",
      "POST",
      form,
      form.getHeaders()
    );

    res.status(200).json(response.data);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/akave/upload-lit-bundle", async (req: Request, res: Response) => {
  try {
    const { outputDir, fileName } = req.body;
    const response = await akaveWrapper(
      `buckets/LitTranslations/files/${fileName}/download`,
      "GET",
      null
    );

    fs.writeFileSync(`./${outputDir}/${fileName}`, response.data);

    res.status(200).json({ message: "Download successful" });
  } catch (error: any) {
    console.error(`Download failed: ${error.response?.data || error.message}`);
  }
});

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
