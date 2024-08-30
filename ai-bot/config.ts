import { openai } from "@ai-sdk/openai";
import { ConfigType } from "./types/config.type";

export const Config: ConfigType = {
  yourName: "Next AI Bot",
  model: openai("gpt-3.5-turbo"),
  questionsLimit: 30,
  floatButton: {
    show: true,
  },
  colors: {
    dark: {
      "next-ai-bot-color-01": "#512487",
      "next-ai-bot-color-02": "#1f1f26",
      "next-ai-bot-color-03": "#000000",
      "next-ai-bot-color-04": "#FFF",
      "next-ai-bot-color-05": "#a47ff5",
      "next-ai-bot-color-06": "#29292f",
      "next-ai-bot-color-07": "#3fb9fb",
      "next-ai-bot-color-08": "#EC105F",
    },
  },
  width: {
    "next-ai-bot-init": "calc(100vw - 4rem)",
    "next-ai-bot-md": "440px",
  },
  height: {
    "next-ai-bot-init": "calc(100dvh - 3rem)",
    "next-ai-bot-md": "700px",
  },
  bottom: {
    "next-ai-bot-bottom-init": "24px",
    "next-ai-bot-bottom-2xl": "64px",
  },
  right: {
    "next-ai-bot-right-init": "2rem",
    "next-ai-bot-right-lg": "24px",
    "next-ai-bot-right-2xl": "64px",
  },
};

export const Messages = {
  chat: {
    welcomeMessage: `Hello, I'm ${Config.yourName}'s artificial intelligence, I'm here to answer your questions. Feel free to ask anything.`,
    askYourQuestion: "Ask anything",
    inputSupportLabel: (limit: number) => {
      return `You can still ask ${limit} questions today.`;
    },
    inputSupportLabelError: "You can't ask any more questions today.",
    message: {
      user: "User",
      ai: "Next AI Bot",
    },
    suggestions: {
      title: "Suggestions",
      questions: ["What is AI?", "What is Next.js?", "What is Tailwind CSS?"],
    },
  },
  aiButton: {
    label: "AI",
  },
};
