import axios from "axios";
import { Bot, webhookCallback } from "grammy";

export class TelegramService {
  private static instance: TelegramService;
  private bot: Bot;

  private constructor() {
    if (!process.env.TELEGRAM_BOT_TOKEN) {
      throw new Error("TELEGRAM_BOT_TOKEN is required");
    }
    this.bot = new Bot(process.env.TELEGRAM_BOT_TOKEN);
  }

  public static getInstance(): TelegramService {
    if (!TelegramService.instance) {
      TelegramService.instance = new TelegramService();
    }
    return TelegramService.instance;
  }

  public getWebhookCallback() {
    return webhookCallback(this.bot, "express", {
      timeoutMilliseconds: 60000,
    });
  }

  public async getAIRecommendation(text: string, chatId: number) {
    try {
      const { data } = await axios.post(`${process.env.AI_API_URL}/v1/invoke`, {
        message: text,
        threadId: chatId < 0 ? chatId * -1 : chatId,
      });
      return data.message;
    } catch (err) {
      return "Unable to reach the AI server, oops!";
    }
  }

  public async start(): Promise<void> {
    try {
      // all command handlers can be registered here
      this.bot.command("start", (ctx) =>
        ctx.reply(
          "Hello, I'm Supranova, your gateway to meme coin economy on Supra, powered by Lit Network!"
        )
      );
      this.bot.on("message::mention", async (ctx) => {
        const text = ctx.message.text?.replace("@supranovabot", "");
        console.log(text);
        const recommendation = await this.getAIRecommendation(
          text!,
          ctx.msg.chat.id
        );
        ctx.reply(recommendation, {
          reply_to_message_id: ctx.msg.message_id,
        });
      });
      this.bot.catch(async (error) => {
        console.error("Telegram bot error:", error);
      });
      await this.bot.start();
      this.bot.api.setMyCommands([
        {
          command: "start",
          description: "Start the bot",
        },
      ]);
    } catch (error) {
      console.error("Failed to start Telegram bot:", error);
      throw error;
    }
  }

  public getBotInfo() {
    return this.bot.api.getMe();
  }
}
