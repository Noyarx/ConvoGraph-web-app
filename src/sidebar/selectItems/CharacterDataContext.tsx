import { createContext, useContext, useState } from "react";
import { initialMoods, initialSpeakers, type SelectItem } from "./SelectItems";

export interface CharacterDataContextType {
  speakers: SelectItem[];
  moods: SelectItem[];
  addSpeaker: (label: string | null) => void;
  addMood: (label: string | null) => void;
}

const CharacterDataContext = createContext<CharacterDataContextType | null>(
  null
);

export function CharacterDataProvider({ children }: any) {
  const [speakers, setSpeakers] = useState<SelectItem[]>(initialSpeakers);
  const [moods, setMoods] = useState<SelectItem[]>(initialMoods);

  const addSpeaker = (label: string | null) => {
    if (!label) return;

    const value = label.toLowerCase().replace(/\s+/g, "_");
    setSpeakers((prev) => [...prev, { label, value }]);
  };

  const addMood = (label: string | null) => {
    if (!label) return;

    const value = label.toLowerCase().replace(/\s+/g, "_");
    setMoods((prev) => [...prev, { label, value }]);
  };

  return (
    <CharacterDataContext.Provider
      value={{ speakers, moods, addSpeaker, addMood }}
    >
      {children}
    </CharacterDataContext.Provider>
  );
}
export const useCharacterData = () => useContext(CharacterDataContext);
