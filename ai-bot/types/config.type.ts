import { LanguageModelV1 } from "@ai-sdk/provider";

export type BreakpointsType = {
  "next-ai-bot-init": string;
  "next-ai-bot-sm"?: string;
  "next-ai-bot-md"?: string;
  "next-ai-bot-lg"?: string;
  "next-ai-bot-xl"?: string;
  "next-ai-bot-2xl"?: string;
};

export type BreakpointsBottomType = {
  "next-ai-bot-bottom-init": string;
  "next-ai-bot-bottom-sm"?: string;
  "next-ai-bot-bottom-md"?: string;
  "next-ai-bot-bottom-lg"?: string;
  "next-ai-bot-bottom-xl"?: string;
  "next-ai-bot-bottom-2xl"?: string;
};

export type BreakpointsRightType = {
  "next-ai-bot-right-init": string;
  "next-ai-bot-right-sm"?: string;
  "next-ai-bot-right-md"?: string;
  "next-ai-bot-right-lg"?: string;
  "next-ai-bot-right-xl"?: string;
  "next-ai-bot-right-2xl"?: string;
};

export type BreakpointsTopType = {
  "next-ai-bot-top-init": string;
  "next-ai-bot-top-sm"?: string;
  "next-ai-bot-top-md"?: string;
  "next-ai-bot-top-lg"?: string;
  "next-ai-bot-top-xl"?: string;
  "next-ai-bot-top-2xl"?: string;
};

export type BreakpointsLeftType = {
  "next-ai-bot-left-init": string;
  "next-ai-bot-left-sm"?: string;
  "next-ai-bot-left-md"?: string;
  "next-ai-bot-left-lg"?: string;
  "next-ai-bot-left-xl"?: string;
  "next-ai-bot-left-2xl"?: string;
};

export type ConfigType = {
  yourName: string;
  colors: {
    dark: {
      [key: string]: string;
    };
  };
  model: LanguageModelV1;
  floatButton: {
    show: boolean;
    showAfterScroll?: number;
  };
  questionsLimit: number;
  width: BreakpointsType;
  height: BreakpointsType;
  top?: BreakpointsTopType;
  left?: BreakpointsLeftType;
  right?: BreakpointsRightType;
  bottom?: BreakpointsBottomType;
};
