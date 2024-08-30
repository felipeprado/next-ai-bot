//types
import { Message } from "ai/react";

//components
import { tv, VariantProps } from "tailwind-variants";

//config
import { Messages } from "@next-ai-bot/config";

//icons
import BrainIcon from "@next-ai-bot/images/icons/brain";
import PersonIcon from "@next-ai-bot/images/icons/person";

//variants
const avatar = tv({
  base: "size-6 md:size-12 flex-none flex items-center justify-center rounded-md md:rounded-2xl",
  variants: {
    role: {
      function: "bg-next-ai-bot-color-03",
      user: "bg-next-ai-bot-color-01",
      system: "bg-next-ai-bot-color-03",
      assistant:
        "bg-gradient-to-br from-next-ai-bot-color-06 via-next-ai-bot-color-01 to-next-ai-bot-color-07",
      data: "bg-next-ai-bot-color-03",
      tool: "bg-next-ai-bot-color-03",
    },
  },
});
interface ChatMessageProps extends VariantProps<typeof avatar> {
  message: Message;
}

const ChatMessage = ({ message, role }: ChatMessageProps) => {
  return (
    <div
      className={`flex w-full gap-2 lg:gap-4 ${
        message?.role === "user"
          ? "justify-end flex-row-reverse"
          : "justify-start"
      }`}
      key={message?.id}
    >
      <figure className={avatar({ role })}>
        {message?.role === "user" ? (
          <PersonIcon className="size-4 md:size-6 fill-next-ai-bot-color-05" />
        ) : (
          <BrainIcon className="size-4 md:size-6 fill-next-ai-bot-color-04" />
        )}
      </figure>

      <div
        className={`flex-1 ${
          message?.role === "user" ? "text-right" : "text-left"
        }`}
      >
        <span className="font-bold text-xs text-next-ai-bot-color-04">
          {message?.role === "user"
            ? `${Messages.chat.message.user}:`
            : `${Messages.chat.message.ai}:`}
        </span>
        <p className="text-xs md:text-[13px] text-next-ai-bot-color-04">
          {message.content}
        </p>
      </div>
    </div>
  );
};

export default ChatMessage;
