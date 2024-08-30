"use client";
import { ComponentProps, useEffect, useRef, useState } from "react";

//components
import { useChat } from "ai/react";
import Lottie from "lottie-react";
import { tv, VariantProps } from "tailwind-variants";

//internal components
import ChatMessage from "@next-ai-bot/components/chat/message";
import Suggestions from "@next-ai-bot/components/chat/suggestions";

//config
import { Config, Messages } from "@next-ai-bot/config";

//ctx
import { useAI } from "@next-ai-bot";

//images
import SmoothLottie from "@next-ai-bot/images/lottie/smooth.json";

//icons
import MinimizeIcon from "@next-ai-bot/images/icons/minimize";
import SendIcon from "@next-ai-bot/images/icons/send";

//variants
const chat = tv({
  base: [
    "backdrop-blur-md",
    "bg-next-ai-bot-color-03",
    "bg-opacity-60",
    "rounded-3xl",
    "flex flex-col",
    "justify-between",
    "px-6",
    "pt-6",
    "pb-0",
    "gap-6",
    //width
    "max-h-calc(100dvh-8rem)",
    "lg:max-h-calc(100dvh-3rem)",
    "w-next-ai-bot-init",
    "sm:w-next-ai-bot-sm",
    "md:w-next-ai-bot-md",
    "lg:w-next-ai-bot-lg",
    "xl:w-next-ai-bot-xl",
    "2xl:w-next-ai-bot-2xl",
    //height
    "h-next-ai-bot-init",
    "sm:h-next-ai-bot-sm",
    "md:h-next-ai-bot-md",
    "lg:h-next-ai-bot-lg",
    "xl:h-next-ai-bot-xl",
    "2xl:h-next-ai-bot-2xl",

    ,
  ],
  variants: {
    setStatus: {
      opened: "scale-1 opacity-1",
      closed: "scale-0 opacity-0",
    },
    variant: {
      float:
        "fixed z-50 pt-12 origin-bottom-right ease-in-out duration-500 bottom-next-ai-bot-bottom-init sm:bottom-next-ai-bot-bottom-sm md:bottom-next-ai-bot-bottom-md lg:bottom-next-ai-bot-bottom-lg xl:bottom-next-ai-bot-bottom-xl 2xl:bottom-next-ai-bot-bottom-2xl right-next-ai-bot-right-init sm:right-next-ai-bot-right-sm md:right-next-ai-bot-right-md lg:right-next-ai-bot-right-lg xl:right-next-ai-bot-right-xl 2xl:right-next-ai-bot-right-2xl top-next-ai-bot-top-init sm:top-next-ai-bot-top-sm md:top-next-ai-bot-top-md lg:top-next-ai-bot-top-lg xl:top-next-ai-bot-top-xl 2xl:top-next-ai-bot-top-2xl left-next-ai-bot-left-init sm:left-next-ai-bot-left-sm md:left-next-ai-bot-left-md lg:left-next-ai-bot-left-lg xl:left-next-ai-bot-left-xl 2xl:left-next-ai-bot-left-2x",
      static: "",
    },
  },
});
interface AIBotProps extends VariantProps<typeof chat>, ComponentProps<"div"> {
  onHandle?: (status: "opened" | "closed") => void;
  ask?: string;
}

const Chat = ({
  onHandle,
  ask,
  setStatus,
  variant,
  className,
  ...props
}: AIBotProps) => {
  const useAIBot = useAI();
  const currentLimit = useAIBot.currentLimit;
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [hasScroll, sethasScroll] = useState<boolean>(false);

  const { messages, input, handleInputChange, handleSubmit, append } = useChat({
    api: "api/next-ai-bot",
    initialMessages: [
      {
        content: Messages.chat.welcomeMessage,
        role: "assistant",
        id: "id0001",
      },
    ],
    onResponse() {
      useAIBot.updateLimit();
    },
  });

  //open modal when arrive some external question
  useEffect(() => {
    if (ask) {
      if (onHandle) {
        onHandle("opened");
      }
      onSubmit(ask);
    }
  }, [ask]);

  //verifies if there is scrollbar on chat messages
  useEffect(() => {
    const containerHeight = containerRef?.current?.clientHeight;
    const scrollHeight = scrollRef?.current?.clientHeight;

    if ((scrollHeight || 0) > (containerHeight || 0)) {
      sethasScroll(true);
    } else {
      sethasScroll(false);
    }

    if (scrollRef.current && containerRef.current) {
      containerRef.current.scrollTop = scrollRef.current?.scrollHeight;
    }
  }, [messages]);

  //submit user message
  const onSubmit = (message: string) => {
    append({
      role: "user",
      content: message,
    });
  };

  return (
    <div
      className={chat({ setStatus, variant, className })}
      key={!!Config ? "c1" : "c2"}
      {...props}
    >
      {/* minimize button */}
      {variant === "float" && (
        <MinimizeIcon
          className="size-6 absolute top-4 right-6 z-50 cursor-pointer duration-200 fill-next-ai-bot-color-04 lg:hover:fill-next-ai-bot-color-06"
          onClick={() => !!onHandle && onHandle("closed")}
        />
      )}

      {/* smooth animation on top */}
      <div className="hidden lg:block absolute h-[90px] w-full bottom-full left-0 right-0 opacity-40 overflow-hidden select-none pointer-events-none">
        <Lottie
          animationData={SmoothLottie}
          loop
          className="absolute top-0 left-0 right-0"
        />
      </div>

      {/* messages */}
      <div
        className="flex-1 overflow-auto [&::-webkit-scrollbar]:w-[7px] [&::-webkit-scrollbar]:bg-none [&::-webkit-scrollbar-thumb]:rounded-sm [&::-webkit-scrollbar-thumb]:bg-[rgba(255,255,255,.1)] [&::-webkit-scrollbar-thumb]:hover:bg-[rgba(255,255,255,.1)]"
        ref={containerRef}
      >
        <div
          ref={scrollRef}
          className={`${hasScroll ? "pr-4" : ""} flex flex-col gap-4`}
        >
          {messages?.map((message) => (
            <ChatMessage
              key={message?.id}
              message={message}
              role={message.role}
            />
          ))}
        </div>
      </div>

      {/* footer */}
      <div
        className={`bg-next-ai-bot-color-03 p-6 -ml-6 -mr-6 flex flex-col gap-6 rounded-b-3xl`}
      >
        {/* suggestions */}
        {Messages?.chat?.suggestions?.questions?.length &&
          currentLimit !== null &&
          currentLimit > 0 && (
            <Suggestions onAsk={(message) => onSubmit(message)} />
          )}

        {/* form */}
        <div className="flex-none flex gap-1 flex-col">
          <form
            className={`relative w-full ${
              currentLimit !== null && currentLimit < 1
                ? "opacity-40 select-none pointer-events-none"
                : ""
            }`}
            onSubmit={handleSubmit}
          >
            <input
              type="text"
              className={`bg-next-ai-bot-color-02 w-full h-12 md:h-16 py-4 pl-4 md:pl-6 pr-12 md:pr-20 appearance-none outline-none text-next-ai-bot-color-04 rounded-full border border-next-ai-bot-color-04 border-opacity-15 text-sm`}
              value={input}
              placeholder={Messages.chat.askYourQuestion}
              onChange={handleInputChange}
              disabled={!useAIBot.currentLimit}
            />
            <button
              className="absolute right-2 top-1/2 -translate-y-1/2 size-8 md:size-12 bg-next-ai-bot-color-01 rounded-full flex items-center justify-center duration-200 lg:hover:bg-next-ai-bot-color-05 group"
              disabled={!useAIBot.currentLimit}
            >
              <SendIcon className="size-4 md:size-6 fill-next-ai-bot-color-05 duration-200 lg:group-hover:fill-next-ai-bot-color-01" />
            </button>
          </form>

          {/* limit/error message */}
          {currentLimit !== null && (
            <span
              className={`text-xs px-4 md:px-6 ${
                currentLimit > 0
                  ? "text-next-ai-bot-color-04"
                  : "text-next-ai-bot-color-07"
              }`}
            >
              {currentLimit > 0
                ? Messages.chat.inputSupportLabel(currentLimit)
                : Messages.chat.inputSupportLabelError}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default Chat;
