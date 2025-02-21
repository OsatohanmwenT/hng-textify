"use client"

import React, {useRef} from 'react'
import {autoGrow, detectLanguage} from "@/utils";
import SendIcon from "@/components/SendIcon";
import {languageOptions} from "@/constants";

interface Props {
    text: string;
    setText: (text: string) => void;
    setMessages: (message: (prev: PromptText[]) => PromptText[]) => void;
}

const Input = ({text, setText, setMessages}: Props) => {
    const textAreaRef = useRef<null | HTMLTextAreaElement>(null);

    const handleSend = async () => {
        if (!text.trim()) return;
        const trimmedText = text.trim();
        try {
            const language = await detectLanguage(text)
            const detectedLangCode = language?.detectedLanguage; // e.g. "en"
            const languageObj = languageOptions.find((option) => option.code === detectedLangCode);

            const newMessage: PromptText = {
                id: `${Date.now()}-id`,
                text: trimmedText,
                type: "user",
                language:  languageObj
            };
            // Add the new message to the top of the list
            setMessages((prev: PromptText[]) => [...prev,newMessage]);
            setText("");
        } catch (error: any) {
            console.log(error)
        }
    };

    return (
        <div
            className="flex w-full gap-3 p-2 max-w-4xl mx-auto bg-dark-gray overflow-hidden rounded-2xl items-center">
            <textarea value={text} onChange={(e) => setText(e.target.value)} onInput={() => autoGrow(textAreaRef)} ref={textAreaRef} id="message" rows={2}
                      className="resize-none scroll h-fit max-h-[200px] p-2.5 w-full text-foreground focus:outline-none rounded-lg bg-transparent dark:placeholder-gray-400"
                      placeholder="Write your thoughts here..."/>
            <button onClick={handleSend} disabled={!text}
                className="w-fit dark:hover:bg-white/50 transition-all p-2 h-fit disabled:bg-white/20 rounded-full self-end flex items-center justify-center dark:bg-white bg-black">
                <SendIcon/>
            </button>
        </div>
    )
}
export default Input
