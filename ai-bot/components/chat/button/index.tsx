"use client";
import { ComponentProps, ReactNode } from "react";

//components
import { tv, VariantProps } from "tailwind-variants";

//variants
const button = tv({
  base: [
    "relative",
    "inline-flex",
    "flex-none",
    "z-30",
    "bg-transparent",
    "border",
    "border-solid",
    "border-next-ai-bot-color-04",
    "border-opacity-20",
    "text-next-ai-bot-color-04",
    "lg:hover:text-next-ai-bot-color-05",
    "lg:hover:border-next-ai-bot-color-05",
    "overflow-hidden",
    "rounded-full",
    "duration-200",
  ],
  variants: {
    size: {
      default: "p-4 text-[0.75rem]",
      large: "p-6 pt-4 pb-4 text-[0.95rem]",
      small: "p-3 text-[0.75rem]",
    },
  },
});

interface ButtonProps
  extends ComponentProps<"button">,
    VariantProps<typeof button> {
  label?: string;
  icon?: ReactNode;
}

const Button = ({
  label,
  icon,
  size,
  className,
  title,
  ...props
}: ButtonProps) => {
  return (
    <button className={button({ size, className })} {...props} title={label}>
      <span {...props}>
        <span className="relative z-20 flex gap-2 items-center">
          {icon || ""}
          {label}
        </span>
      </span>
    </button>
  );
};

export default Button;
