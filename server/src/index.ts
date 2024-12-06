import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import cors from "cors";
import { LitService } from "./services/lit.service";
import { BotAccountService } from "./services/bot.service";

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

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
