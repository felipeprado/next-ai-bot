import { ComponentProps } from "react";

//components
import Lottie from "lottie-react";
import { tv, VariantProps } from "tailwind-variants";

//images
import SparkLottie from "@next-ai-bot/images/lottie/spark.json";

//icons
import BrainIcon from "@next-ai-bot/images/icons/brain";

//config
import { Messages } from "@next-ai-bot/config";

//variants
const button = tv({
  base: [
    "group",
    "duration-200",
    "scale-1",
    "opacity-1",
    "select-none",
    "fixed",
    "z-50",
    //bottom
    "bottom-next-ai-bot-bottom-init",
    "sm:bottom-next-ai-bot-bottom-sm",
    "md:bottom-next-ai-bot-bottom-md",
    "lg:bottom-next-ai-bot-bottom-lg",
    "xl:bottom-next-ai-bot-bottom-xl",
    "2xl:bottom-next-ai-bot-bottom-2xl",
    //right
    "right-next-ai-bot-right-init",
    "sm:right-next-ai-bot-right-sm",
    "md:right-next-ai-bot-right-md",
    "lg:right-next-ai-bot-right-lg",
    "xl:right-next-ai-bot-right-xl",
    "2xl:right-next-ai-bot-right-2xl",
    //top
    "top-next-ai-bot-top-init",
    "sm:top-next-ai-bot-top-sm",
    "md:top-next-ai-bot-top-md",
    "lg:top-next-ai-bot-top-lg",
    "xl:top-next-ai-bot-top-xl",
    "2xl:top-next-ai-bot-top-2xl",
    //left
    "left-next-ai-bot-left-init",
    "sm:left-next-ai-bot-left-sm",
    "md:left-next-ai-bot-left-md",
    "lg:left-next-ai-bot-left-lg",
    "xl:left-next-ai-bot-left-xl",
    "2xl:left-next-ai-bot-left-2xl",
  ],
  variants: {
    status: {
      opened: "opacity-0 scale-0",
      closed: "opacity-1 scale-1",
    },
  },
});

const AiButton = ({
  status,
  className,
  ...props
}: ComponentProps<"button"> & VariantProps<typeof button>) => {
  return (
    <button className={button({ status, className })} {...props}>
      <div className="relative flex items-center justify-center rounded-2xl size-12 z-10 bg-gradient-to-br from-next-ai-bot-color-07 via-next-ai-bot-color-01 to-next-ai-bot-color-08">
        <BrainIcon className="size-6 fill-next-ai-bot-color-04 duration-200 lg:group-hover:scale-110" />
      </div>

      <Lottie
        animationData={SparkLottie}
        loop
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 scale-y-[-1] select-none pointer-events-none z-0 w-[110%]"
      />

      <span className="absolute top-full left-1/2 -translate-x-1/2 -translate-y-1/2 text-next-ai-bot-color-04 text-[9px] font-bold rounded-lg  pr-[8px] pl-[8px] bg-next-ai-bot-color-02 z-20">
        {Messages.aiButton.label}
      </span>
    </button>
  );
};

export default AiButton;
