import {languageOptions} from "@/constants";

export const autoGrow = (textAreaRef: any) => {
    const { current } = textAreaRef
    current.style.height = "auto"
    current.style.height = current.scrollHeight + "px"
}

export const detectLanguage = async (text: string) => {
    if ('ai' in self && 'languageDetector' in (self as any).ai){
        try {
            const capabilities = await (self as any).ai.languageDetector.capabilities();
            const canDetect = capabilities.capabilities;
            let detector;
            if (canDetect === 'no') {
                console.log("No")
                return;
            }
            if (canDetect === 'readily') {
                // The language detector can immediately be used.
                detector = await (self as any).ai.languageDetector.create();
            } else {
                // The language detector can be used after model download.
                detector = await (self as any).ai.languageDetector.create({
                    monitor(m: any) {
                        m.addEventListener('downloadprogress', (e: any) => {
                            console.log(`Downloaded ${e.loaded} of ${e.total} bytes.`);
                        });
                    },
                });
                await detector.ready;
            }
            const results = await detector.detect(text);
            // Pick the top result (assuming the first one is the most confident)
            if (results.length > 0) {
                return {detectedLanguage: results[0].detectedLanguage, success: true}
            } else {
                return {success: false, detectedLanguage: "Unknown"}
            }
        } catch (error: any) {
            console.log(error.message)
        }
    } else {
        console.log("Not working...")
    }
}

export const translateLanguage = async (inputText: string, sourceLang: string, targetLang: string) => {
    if ('ai' in self && 'translator' in self.ai) {
        try {
            const translatorCapabilities = await self.ai.translator.capabilities();
            const pairStatus = translatorCapabilities.languagePairAvailable(sourceLang, targetLang);
            if (pairStatus === "no") {
                console.log("This language pair is not supported.");
                return {success: false, message: "This language pair is not supported."};
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
                            console.log(`Downloaded ${e.loaded} of ${e.total} bytes.`)
                        );
                    },
                });
                await translator.ready;
            }
            const result = await translator.translate(inputText)
            return {success: true, result}
        } catch (error: any) {
            console.log(error)
        }
    } else {
        console.log("not working")
    }
}

export const summarizeText = async (inputText: string) => {
    if ('ai' in self && 'summarizer' in self.ai) {
        try {
            const options = {
                sharedContext: 'Summarize input text',
                type: 'tl;dr',
                format: 'plain-text',
                length: 'medium',
            };

            const available = (await self.ai.summarizer.capabilities()).available;
            let summarizer;
            if (available === 'no') {
                // The Summarizer API isn't usable.
                return;
            }
            if (available === 'readily') {
                // The Summarizer API can be used immediately .
                summarizer = await self.ai.summarizer.create(options);
            } else {
                // The Summarizer API can be used after the model is downloaded.
                summarizer = await self.ai.summarizer.create(options);
                summarizer.addEventListener('downloadprogress', (e) => {
                    console.log(e.loaded, e.total);
                });
                await summarizer.ready;
            }

            const summary = await summarizer.summarize(inputText);
            console.log(summary)
        } catch (error: any) {
            console.log(error)
        }
    }
}

export const getLanguageLabel = (code: string) => {
    return languageOptions.filter((lang) => lang.code === code)
}