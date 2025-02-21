type MessageType = "user" | "system";

interface PromptText {
  id: string;
  text: string;
  language: { code: string; label: string } | undefined;
  type: MessageType;
  translation?: string;
  selectedLang?: string;
  summary?: string;
  translatedLang?: string;
}
