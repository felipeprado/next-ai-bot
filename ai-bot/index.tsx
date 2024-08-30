"use client";

import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

//components
import dayjs from "dayjs";

//internal components
import Chat from "@next-ai-bot/components/chat";
import AiButton from "@next-ai-bot/components/chat/ai-button";

//config
import { Config } from "./config";

//context
const AIBotContext = createContext<useAIProps | null>({} as useAIProps);

type StatusType = "opened" | "closed";

type DataType = {
  question?: string;
  status?: StatusType;
};

type useAIProps = {
  setQuestion: (message: string) => void;
  setStatus: (status: StatusType) => void;
  updateLimit: () => void;
  currentLimit: number | null;
  data: DataType;
};

interface AIBotProviderProps {
  children: ReactNode;
}

export const AIBotProvider = ({ children }: AIBotProviderProps) => {
  const [data, setData] = useState<DataType>({ status: "closed" });
  const [hideButton, setHideButton] = useState<boolean>(true);
  const [questionLimit, setQuestionLimit] = useState<number | null>(null);

  useEffect(() => {
    if (!!Config.floatButton?.show && Config.floatButton?.showAfterScroll) {
      const handleScroll = () => {
        const position = window.scrollY;
        if (position < (Config.floatButton.showAfterScroll || 0)) {
          setHideButton(true);
        } else {
          setHideButton(false);
        }
      };

      window.addEventListener("scroll", handleScroll);

      return () => {
        window.removeEventListener("scroll", handleScroll);
      };
    } else {
      setHideButton(!!Config.floatButton?.show ? false : true);
    }
  }, []);

  //fetch and renew limit
  useEffect(() => {
    const fetchBotLocalStorage = localStorage.getItem("@next-ai-bot");

    if (fetchBotLocalStorage) {
      const res = JSON.parse(fetchBotLocalStorage);
      const limit = Number(res.limit);
      const date = res.date ? dayjs(res.date) : null;

      if (date?.format("DD/MM/YYYY") !== dayjs().format("DD/MM/YYYY")) {
        localStorage.setItem(
          "@next-ai-bot",
          JSON.stringify({ date: dayjs(), limit: Config.questionsLimit })
        );
      } else {
        setQuestionLimit(limit);
      }
    } else {
      setQuestionLimit(Config.questionsLimit);
    }
  }, []);

  //update limit when user send a new question
  const updateLimit = () => {
    if (questionLimit) {
      let count = questionLimit - 1;
      count = count > 0 ? count : 0;
      setQuestionLimit(count);

      const fetchBotLocalStorage = localStorage.getItem("@next-ai-bot");

      const res = fetchBotLocalStorage
        ? JSON.parse(fetchBotLocalStorage)
        : null;

      localStorage.setItem(
        "@next-ai-bot",
        JSON.stringify({ ...res, limit: count })
      );
    }
  };

  //send a question to chat bot
  const setQuestion = (message: string) => {
    if (message !== data?.question) {
      setData({ ...data, question: message, status: "opened" });
    } else {
      setData({ ...data, status: "opened" });
    }
  };

  //change modal status to opened or closed
  const setStatus = (status: StatusType) => {
    if (status !== data?.status) {
      setData({ ...data, status });
    }
  };

  //when open/close modal
  const onHandle = (status: StatusType) => {
    if (status !== data?.status) {
      setData({ ...data, status: status });
    }
  };

  return (
    <AIBotContext.Provider
      value={{
        data: data,
        currentLimit: questionLimit,
        setQuestion,
        setStatus,
        updateLimit,
      }}
    >
      {children}

      {(Config.floatButton.show || !!Config.floatButton.showAfterScroll) && (
        <>
          <AiButton
            status={hideButton ? "opened" : data.status}
            onClick={() => {
              setData({ ...data, status: "opened" });
              onHandle("opened");
            }}
          />

          <Chat
            ask={data?.question || ""}
            onHandle={(s) => onHandle(s)}
            setStatus={data?.status}
            variant="float"
          />
        </>
      )}
    </AIBotContext.Provider>
  );
};

export const useAI = (): useAIProps => {
  const context = useContext(AIBotContext);

  if (!context) {
    throw new Error("useAI must be used within an AIBotProvider");
  }

  return context;
};
