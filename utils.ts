import { languageOptions } from "@/constants";
import React from "react";

export const autoGrow = (
  textAreaRef: React.RefObject<HTMLTextAreaElement | null>,
) => {
  if (!textAreaRef.current) return;
  const { current } = textAreaRef;
  current.style.height = "auto";
  current.style.height = current.scrollHeight + "px";
};

export const detectLanguage = async (text: string) => {
  if ("ai" in self && "languageDetector" in (self as any).ai) {
    try {
      const capabilities = await (
        self as any
      ).ai.languageDetector.capabilities();
      const canDetect = capabilities.capabilities;
      let detector;
      if (canDetect === "no") {
        console.log("not available");
        return;
      }
      if (canDetect === "readily") {
        detector = await self.ai.languageDetector.create();
      } else {
        detector = await self.ai.languageDetector.create({
          monitor(m: any) {
            m.addEventListener("downloadprogress", (e: any) => {
              console.log(`Downloaded ${e.loaded} of ${e.total} bytes.`);
            });
          },
        });
        await detector.ready;
      }
      const results = await detector.detect(text);
      if (results.length > 0) {
        return { detectedLanguage: results[0].detectedLanguage, success: true };
      } else {
        return { success: false, detectedLanguage: "Unknown" };
      }
    } catch (error: any) {
      console.log(error.message);
      return { success: false, message: "Browser does not support" };
    }
  } else {
    return { success: false, message: "Browser does not support" };
  }
};

export const translateLanguage = async (
  inputText: string,
  sourceLang: string,
  targetLang: string,
) => {
  if ("ai" in self && "translator" in (self as any).ai) {
    try {
      const translatorCapabilities = await self.ai.translator.capabilities();
      const pairStatus = translatorCapabilities.languagePairAvailable(
        sourceLang,
        targetLang,
      );
      if (pairStatus === "no") {
        console.log("This language pair is not supported.");
        return {
          success: false,
          message: "This language pair is not supported.",
        };
      }

      let translator;
      if (pairStatus === "readily") {
        translator = await self.ai.translator.create({
          sourceLanguage: sourceLang,
          targetLanguage: targetLang,
        });
      } else if (pairStatus === "after-download") {
        translator = await self.ai.translator.create({
          sourceLanguage: sourceLang,
          targetLanguage: targetLang,
          monitor(m) {
            m.addEventListener("downloadprogress", (e: any) =>
              console.log(`Downloaded ${e.loaded} of ${e.total} bytes.`),
            );
          },
        });
        await translator.ready;
      }
      const result = await translator.translate(inputText);
      return { success: true, result };
    } catch (error: any) {
      console.log(error);
    }
  } else {
    console.log("not working");
  }
};

export const summarizeText = async (inputText: string) => {
  if ("ai" in self && "summarizer" in (self as any).ai) {
    try {
      const options = {
        sharedContext: "Summarize input text",
        type: "tl;dr",
        format: "plain-text",
        length: "short",
      };

      const available = (await self.ai.summarizer.capabilities()).available;
      let summarizer;
      if (available === "no") {
        return { success: false, message: "Not supported on your browser" };
      }
      if (available === "readily") {
        summarizer = await self.ai.summarizer.create(options);
      } else {
        summarizer = await self.ai.summarizer.create(options);
        summarizer.addEventListener("downloadprogress", (e) => {
          console.log(e.loaded, e.total);
        });
        await summarizer.ready;
      }
      const summary = await summarizer.summarize(inputText);
      return { success: true, summary };
    } catch (error: any) {
      console.log(error);
      return { success: false, message: error.message };
    }
  }
};

export const getLanguageLabel = (code: string) => {
  return languageOptions.find((lang) => lang.code === code)?.label || "French";
};
