import { convertToCoreMessages, streamText } from "ai";
import { Config } from "@next-ai-bot/config";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages } = await req.json();

  const result = await streamText({
    model: Config.model,
    messages: convertToCoreMessages(messages),
  });

  return result.toDataStreamResponse();
}
