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

  public async start(): Promise<void> {
    try {
      // all command handlers can be registered here
      this.bot.command("start", (ctx) =>
        ctx.reply(
          "Hello, I'm Supranova, your gateway to meme coin economy on Supra, powered by Lit Network!"
        )
      );
      this.bot.on("message::mention", (ctx) => {
        ctx.reply("Sorry don't have funds", {
          reply_to_message_id: ctx.msg.message_id
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
