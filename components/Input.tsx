"use client";

import React, { useRef } from "react";
import { autoGrow, detectLanguage } from "@/utils";
import SendIcon from "@/components/SendIcon";
import { languageOptions } from "@/constants";
import { toast } from "@/hooks/use-toast";

interface Props {
  text: string;
  setText: (text: string) => void;
  setMessages: (message: (prev: PromptText[]) => PromptText[]) => void;
}

const Input = ({ text, setText, setMessages }: Props) => {
  const textAreaRef = useRef<HTMLTextAreaElement | null>(null);

  const handleSend = async () => {
    if (!text.trim()) return;
    const trimmedText = text.trim();
    try {
      const language = await detectLanguage(text);

      if (!language?.success) {
        toast({
          title: "Error",
          description: language?.message,
          variant: "destructive",
        });
      }

      const detectedLangCode = language?.detectedLanguage; // e.g. "en"
      const languageObj = languageOptions.find(
        (option) => option.code === detectedLangCode,
      );

      const newMessage: PromptText = {
        id: `${Date.now()}-id`,
        text: trimmedText,
        type: "user",
        language: languageObj,
      };

      if (textAreaRef.current) {
        textAreaRef.current.style.height = "auto";
      }

      setMessages((prev: PromptText[]) => [...prev, newMessage]);
      setText("");
    } catch (error: any) {
      console.log(error);
    }
  };

  return (
    <div className="message-container">
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        onInput={() => autoGrow(textAreaRef)}
        ref={textAreaRef}
        id="message"
        rows={2}
        className="message-input"
        aria-label="Input box"
        placeholder="Write your thoughts here..."
      />
      <button
        aria-label="Send message"
        onClick={handleSend}
        disabled={!text}
        className="btn"
      >
        <SendIcon />
      </button>
    </div>
  );
};
export default Input;
