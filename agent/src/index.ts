import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import cors from "cors";
import { graph } from "./react_agent/graph.js";
import { HumanMessage } from "@langchain/core/messages";

dotenv.config();

const app: Express = express();
app.use(express.json());
app.use(cors());
const port = process.env.PORT || 5173;

app.get("/", (_req: Request, res: Response) => {
  res.send("Agent Server is running");
});

app.post("/v1/invoke", async (req: Request, res: Response) => {
  const { message, threadId } = req.body;
  try {
    const agentRes = await graph.invoke(
      {
        messages: [new HumanMessage(message)],
      },
      {
        // @ts-expect-error - This is a valid config
        configurable: {
          thread_id: threadId,
        },
      }
    );

    console.log(agentRes.messages);
    res.status(200).send({
      message: agentRes.messages[agentRes.messages.length - 1].content,
    });
  } catch (error) {
    console.error("Error invoking agent:", error);
    res.status(500).send({ error: "Failed to invoke agent" });
  }
});

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
