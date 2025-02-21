"use client";

import React, { useState } from "react";
import { AnimatePresence } from "framer-motion";
import { languageOptions } from "@/constants";
import { summarizeText, translateLanguage, getLanguageLabel } from "@/utils";
import { toast } from "@/hooks/use-toast";
import MessageBox from "@/components/MessageBox";
import PromptBox from "@/components/PromptBox";

interface Props {
  messages: PromptText[];
  setMessages: (message: (prev: PromptText[]) => PromptText[]) => void;
}

const PromptList = ({ messages, setMessages }: Props) => {
  const [summarizingMessageId, setSummarizingMessageId] = useState<
    string | null
  >(null);

  const handleTranslate = async (
    messageId: string,
    sourceLang: string = "en",
    originalText: string,
    targetLang: string,
  ) => {
    try {
      const translatedText = await translateLanguage(
        originalText,
        sourceLang,
        targetLang,
      );

      if (!translatedText?.success) {
        toast({
          title: "An Error Occurred",
          description: translatedText?.message,
          variant: "destructive",
        });
        return;
      }

      setMessages((prev) =>
        prev.map((item) =>
          item.id === messageId
            ? { ...item, translation: translatedText.result, translatedLang: targetLang }
            : item,
        ),
      );
    } catch (error: any) {
      console.log(error);
    }
  };

  const handleSummarization = async (messageId: string, text: string) => {
    setSummarizingMessageId(messageId);
    try {
      const summarizedText = await summarizeText(text);

      setMessages((prev) =>
        prev.map((item) =>
          item.id === messageId
            ? { ...item, summary: summarizedText?.summary }
            : item,
        ),
      );
    } catch (error: any) {
      console.log(error);
    } finally {
      setSummarizingMessageId(null);
    }
  };

  const handleLanguageChange = (messageId: string, newLang: string) => {
    setMessages((prev) =>
      prev.map((item) =>
        item.id === messageId ? { ...item, selectedLang: newLang } : item,
      ),
    );
  };

  return (
    <AnimatePresence>
      {messages.map((message) => (
        <React.Fragment key={message.id}>
          <PromptBox
            className={`mb-4 ${message.type === "user" ? "justify-end self-end" : "justify-start"}`}
          >
            <div
              className={`mb-1 flex min-w-[200px] max-w-xl w-full p-3 ${message.type === "user" ? "self-end" : "justify-start"} bg-stone-900 rounded`}
            >
              <p className="text-white max-sm:text-sm">{message.text}</p>
            </div>
            <div className="flex items-center justify-end gap-1 sm:gap-2">
              <div className="bg-white px-1 rounded-md text-[12px] text-black w-fit">
                {message.language?.label}
              </div>
              <div className="flex items-center gap-1">
                <p className="text-white text-[12px]">Translate to:</p>
                <select
                  className="select-input"
                  value={message.selectedLang || "fr"}
                  onChange={(e) =>
                    handleLanguageChange(message.id, e.target.value)
                  }
                  aria-label="Select language for translation"
                >
                  {languageOptions.map((opt) => (
                    <option key={opt.code} value={opt.code}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
              {message.language?.code === "en" && message.text.length > 150 && (
                <button
                  className="btn !text-blue-500 !bg-blue-50"
                  onClick={() => handleSummarization(message.id, message.text)}
                  aria-label={`Summarize message: ${message.text.substring(0, 30)}...`}
                >
                  {summarizingMessageId === message.id
                    ? "Summarizing..."
                    : "Summarize"}
                </button>
              )}
              <button
                onClick={() =>
                  handleTranslate(
                    message.id,
                    message.language?.code,
                    message.text,
                    message.selectedLang || "fr",
                  )
                }
                className="text-green-400 hover:bg-green-50 rounded-md transition-all text-xs p-1"
                aria-label={`Translate message: ${message.text.substring(0, 30)}...`}
              >
                Translate
              </button>
            </div>
          </PromptBox>
          {message.translation && (
            <MessageBox>
              <div className="bg-neutral-700 text-white p-3 rounded-lg max-w-lg">
                <p className="text-blue-300 text-sm">Translated to:  {getLanguageLabel(message.translatedLang || "fr")}</p>
                <p className="max-sm:text-sm">{message.translation}</p>
              </div>
            </MessageBox>
          )}
          {message.summary && (
            <MessageBox>
              <div className="bg-neutral-700 text-white p-3 rounded-lg max-w-lg">
                <p className="text-blue-300 text-sm">Summary</p>
                <p className="max-sm:text-sm">{message.summary}</p>
              </div>
            </MessageBox>
          )}
        </React.Fragment>
      ))}
    </AnimatePresence>
  );
};
export default PromptList;
