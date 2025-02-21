import React from 'react'
import {AnimatePresence, motion} from "framer-motion";
import {languageOptions} from "@/constants";
import {getLanguageLabel, translateLanguage} from "@/utils";

interface Props {
    messages: PromptText[];
    setMessages: (message: (prev: PromptText[]) => PromptText[]) => void;
}

const PromptList = ({messages, setMessages}: Props) => {
    const handleTranslate = async (messageId: string, sourceLang: string, originalText: string, targetLang: string) => {
        try {
            const translatedText = await translateLanguage(originalText, sourceLang, targetLang);
            console.log(translatedText)

            if(!translatedText?.success) {
                return;
            }

            setMessages((prev) =>
                prev.map((item) =>
                    item.id === messageId ? { ...item, translation: translatedText.result } : item
                )
            );
            console.log(translatedText);
        } catch (error: any) {
            console.log(error)
        }
    }

    const handleLanguageChange = (messageId: string, newLang: string) => {
        setMessages((prev) =>
            prev.map((item) =>
                item.id === messageId ? { ...item, selectedLang: newLang } : item
            )
        );
    };

    return (
        <AnimatePresence>
            {messages.map((message) => (
                <React.Fragment key={message.id}>
                    <motion.div
                        initial={{opacity: 0, y: -20}}
                        animate={{opacity: 1, y: 0}}
                        exit={{opacity: 0, y: -20}}
                        transition={{duration: 0.4}}
                        className={`mb-2 ${message.type === "user" ? "justify-end self-end" : "justify-start"}`}
                    >
                        <div
                            className={`mb-1 flex min-w-[200px] w-full p-3 ${message.type === "user" ? "self-end" : "justify-start"} bg-stone-900 rounded`}>
                            <p className="text-white">{message.text}</p>
                        </div>
                        <div className="flex items-center gap-1">
                            <div
                                className="bg-white px-1 rounded-md text-[12px] text-black w-fit">{message.language?.label}</div>
                            <div className="flex items-center gap-1">
                                <p className="text-white text-[12px]">Translate to:</p>
                                <select
                                    className="appearance-none bg-transparent cursor-pointer *:text-black text-sm rounded
                     focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    value={message.selectedLang || "fr"}
                                    onChange={(e) => handleLanguageChange(message.id, e.target.value)}
                                >
                                    {languageOptions.map((opt) => (
                                        <option key={opt.code} value={opt.code}>
                                            {opt.label}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <button onClick={() => handleTranslate(message.id, message.language?.code, message.text, message.selectedLang || "fr")}
                                    className="text-green-400 hover:bg-green-50 rounded-md transition-all text-xs p-1">Translate
                            </button>
                        </div>
                    </motion.div>
                    {message.translation && (
                        <motion.div initial={{opacity: 0, x: -20}}
                                    animate={{opacity: 1, x: 0}}
                                    exit={{opacity: 0, x: -20}}
                                    transition={{duration: 0.4}}
                                    className="flex justify-start mb-2">
                            <div className="bg-neutral-700 text-white p-3 rounded-lg max-w-xs">
                                <p className="text-blue-300 text-sm">Translated to:</p>
                                <p>{message.translation}</p>
                            </div>
                        </motion.div>
                    )}
                </React.Fragment>
            ))}
        </AnimatePresence>
    )
}
export default PromptList
