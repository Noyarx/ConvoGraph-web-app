const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";

function getApiKey(): string {
  return import.meta.env.VITE_GROQ_API_KEY ?? "";
}

async function callLlama(messages: { role: string; content: string }[], maxTokens = 256): Promise<string> {
  const apiKey = getApiKey();
  if (!apiKey) throw new Error("API key missing. Set VITE_GROQ_API_KEY in .env");

  const res = await fetch(GROQ_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "llama-3.3-70b-versatile",
      messages,
      max_tokens: maxTokens,
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`API error ${res.status}: ${err}`);
  }

  const data = await res.json();
  return data.choices[0].message.content;
}

export interface HistoryMessage {
  speaker: string;
  mood: string;
  text: string;
}

export interface DialogueInput {
  speaker: string;
  mood: string;
  prompt: string;
  history?: HistoryMessage[];
  description?: string;
}

export async function generateDialogue(input: DialogueInput): Promise<string> {
  const { speaker, mood, prompt, history, description } = input;

  const name = speaker || "Unknown";
  const currentMood = mood || "neutral";

  let descriptionBlock = "";
  if (description?.trim()) {
    descriptionBlock = `\nAbout you: ${description.trim()}\n`;
  }

  let historyBlock = "";
  if (history && history.length > 0) {
    const lines = history.map(h => `${h.speaker}: ${h.text}`).join("\n");
    historyBlock = `\nHere is what has been said so far:\n${lines}\n`;
  }

  const system = `You are ${name}. You are not an AI. You are not an assistant. You are ${name}, a real person in a conversation.
${descriptionBlock}
Right now you are feeling ${currentMood}. This affects everything about how you speak — your word choice, your tone, your sentence length, your attitude.
${historyBlock}
The user will give you a rough idea of what you want to say next. Say it in your own words, the way YOU would say it while feeling ${currentMood}.

Rules you must follow:
- Stay in character. You are ${name}. Never break character. Never mention you are an AI.
- Your mood is ${currentMood}. Let it show in every word.
- Output ONLY what you say. No quotes. No "${name}:" prefix. No actions. No narration. No parentheses.
- Keep roughly the same length as the input. A short input means a short reply.`;

  return callLlama([
    { role: "system", content: system },
    { role: "user", content: `You should say something like: "${prompt}"` },
  ]);
}

export async function fixGrammar(text: string): Promise<string> {
  return callLlama([
    {
      role: "system",
      content: "Fix grammar, punctuation, capitalization and phrasing in the text the user provides. Also infer the appropriate punctuation based on the tone and intent of the sentence: add question marks for questions, exclamation marks for exclamations, ellipsis for trailing thoughts, commas for pauses, etc. Keep the same meaning, tone, and length. Output ONLY the corrected text, nothing else.",
    },
    { role: "user", content: text },
  ]);
}
