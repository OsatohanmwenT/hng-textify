"use client";

import Input from "@/components/Input";
import { useState } from "react";
import PromptList from "@/components/PromptList";

export default function Home() {
  const [text, setText] = useState("");
  const [messages, setMessages] = useState<PromptText[]>([]);

  return (
    <div className="grid grid-rows-[1fr_auto] overflow-hidden gap-3 p-4 h-screen w-full font-[family-name:var(--font-geist-sans)]">
      <div className="h-full w-full absolute z-[-1] inset-0 bg-doodle opacity-5"></div>
      <div className="h-full z-10 w-full scroll overflow-y-scroll max-h-[720px]">
        <div className="h-full flex flex-col max-w-4xl w-full mx-auto">
          {messages.length > 0 ? (
            <PromptList messages={messages} setMessages={setMessages} />
          ) : (
            <div className="h-full flex items-center justify-center">
              <p className="font-semibold text-3xl text-center text-white">
                WELCOME TO TEXTIFY
              </p>
            </div>
          )}
        </div>
      </div>
      <Input text={text} setMessages={setMessages} setText={setText} />
    </div>
  );
}
