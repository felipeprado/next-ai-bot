"use client";
import { useRef, useState } from "react";

//internal components
import Button from "@next-ai-bot/components/chat/button";

//config
import { Messages } from "@next-ai-bot/config";

//icons
import ArrowLeftIcon from "@next-ai-bot/images/icons/arrow-left";
import ArrowRightIcon from "@next-ai-bot/images/icons/arrow-right";

interface SuggestionsProps {
  onAsk: (message: string) => void;
}

const Suggestions = ({ onAsk }: SuggestionsProps) => {
  const slideContainerRef = useRef<HTMLDivElement>(null);
  const trackingRef = useRef<HTMLDivElement>(null);

  const [trackingMarginLeft, setTrackingMarginLeft] = useState<number>(0);
  const [recordedPositions, setRecordedPositions] = useState<number[]>([0]);
  const [disableNextButton, setDisableNextButton] = useState<boolean>(false);

  const onHandle = (dto: { direction: "prev" | "next" }) => {
    const { direction } = dto;
    const buttons = trackingRef.current?.querySelectorAll("button");

    if (buttons?.length) {
      for (let index = 0; index < buttons.length; index++) {
        const button = buttons[index];
        const offset = button.offsetLeft;
        const width = button.clientWidth;
        const containerWidth = slideContainerRef.current?.clientWidth;
        const buttonOffset = button.offsetLeft;

        //next
        if (direction === "next") {
          if (offset + width > trackingMarginLeft + (containerWidth || 0)) {
            setTrackingMarginLeft(buttonOffset);
            setRecordedPositions([...recordedPositions, buttonOffset]);

            if (recordedPositions.filter((n) => n === buttonOffset).length) {
              setDisableNextButton(true);
            } else {
              break;
            }
          }
        }
        //prev
        else if (direction === "prev") {
          const previousPos =
            recordedPositions[recordedPositions.length - 2] || 0;

          setTrackingMarginLeft(previousPos);
          setDisableNextButton(false);

          if (previousPos) {
            setRecordedPositions(
              recordedPositions.filter((n) => n <= previousPos)
            );
          } else {
            setRecordedPositions([0]);
          }
        }
      }
    }
  };

  return Messages.chat?.suggestions?.questions?.length ? (
    <div className="flex-col gap-2 flex">
      {Messages?.chat?.suggestions?.title && (
        <span className="text-xs text-next-ai-bot-color-04">
          {Messages.chat.suggestions.title}
        </span>
      )}

      <div className="flex items-center">
        {/* prev button */}
        <button
          className={`h-10 flex items-center justify-center flex-none ${
            trackingMarginLeft === 0
              ? "opacity-30 cursor-not-allowed"
              : "cursor-pointer"
          }`}
          onClick={() =>
            trackingMarginLeft !== 0 && onHandle({ direction: "prev" })
          }
        >
          <ArrowLeftIcon className="size-6 fill-next-ai-bot-color-04" />
        </button>

        {/* slide container */}
        <div
          className="w-full flex items-center overflow-hidden relative"
          ref={slideContainerRef}
        >
          {/* left smooth */}
          <span
            className={`absolute top-0 left-0 w-8 h-full bg-gradient-to-r from-next-ai-bot-color-03 z-10 select-none pointer-events-none ${
              trackingMarginLeft === 0 ? "hidden" : ""
            }`}
          />

          {/* tracking */}
          <div
            className={`flex gap-2 w-[9999px] flex-none relative z-0 transition-all duration-200`}
            style={{ marginLeft: `-${trackingMarginLeft}px` }}
            ref={trackingRef}
          >
            {Messages.chat?.suggestions?.questions?.map((item) => (
              <Button
                size="small"
                label={item}
                key={item}
                onClick={() => onAsk(item)}
              />
            ))}
          </div>

          {/* right smooth */}
          <span className="absolute top-0 right-0 w-8 h-full bg-gradient-to-l from-next-ai-bot-color-03 z-10 select-none pointer-events-none" />
        </div>

        {/* next button */}
        <button
          className={`h-10 flex items-center justify-center flex-none cursor-pointer ${
            disableNextButton
              ? "opacity-30 cursor-not-allowed"
              : "cursor-pointer"
          }`}
          onClick={() => !disableNextButton && onHandle({ direction: "next" })}
        >
          <ArrowRightIcon className="size-6 fill-next-ai-bot-color-04" />
        </button>
      </div>
    </div>
  ) : (
    <></>
  );
};

export default Suggestions;
