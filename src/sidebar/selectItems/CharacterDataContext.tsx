import { createContext, useCallback, useContext, useMemo } from "react";
import { useCharacters } from "../../characters/CharactersContext";
import type { SelectItem } from "./SelectItems";

export interface CharacterDataContextType {
  speakers: SelectItem[];
  addSpeaker: (label: string | null) => void;
  getMoodsForSpeaker: (speakerName: string) => SelectItem[];
  addMoodToSpeaker: (speakerName: string, mood: string) => void;
}

const CharacterDataContext = createContext<CharacterDataContextType | null>(
  null,
);

export function CharacterDataProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { characters, addCharacter, addMoodToCharacter } = useCharacters();

  const speakers = useMemo<SelectItem[]>(
    () => characters.map((c) => ({ label: c.name, value: c.name })),
    [characters],
  );

  const addSpeaker = useCallback(
    (label: string | null) => {
      if (!label) return;
      const alreadyExists = characters.some(
        (c) => c.name.toLowerCase() === label.toLowerCase(),
      );
      if (!alreadyExists) addCharacter(label, "");
    },
    [characters, addCharacter],
  );

  const getMoodsForSpeaker = useCallback(
    (speakerName: string): SelectItem[] => {
      const char = characters.find((c) => c.name === speakerName);
      if (!char) return [];
      return char.moods.map((m) => ({
        label: m,
        value: m.toLowerCase().replace(/\s+/g, "_"),
      }));
    },
    [characters],
  );

  const addMoodToSpeaker = useCallback(
    (speakerName: string, mood: string) => {
      const char = characters.find((c) => c.name === speakerName);
      if (char) addMoodToCharacter(char.id, mood);
    },
    [characters, addMoodToCharacter],
  );

  return (
    <CharacterDataContext.Provider
      value={{ speakers, addSpeaker, getMoodsForSpeaker, addMoodToSpeaker }}
    >
      {children}
    </CharacterDataContext.Provider>
  );
}
export const useCharacterData = () => useContext(CharacterDataContext);
