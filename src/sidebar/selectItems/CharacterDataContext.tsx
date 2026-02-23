import { createContext, useCallback, useContext, useMemo } from "react";
import { useCharacters } from "../../characters/CharactersContext";
import type { SelectItem } from "./SelectItems";

export interface CharacterDataContextType {
  speakers: SelectItem[];
  addSpeaker: (label: string | null) => void;
  getMoodsForSpeaker: (speakerName: string) => SelectItem[];
  getDefaultMoodForSpeaker: (speakerName: string) => string;
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
    () => [
      { label: "None", value: "" },
      ...characters.map((c) => ({ label: c.name, value: c.name })),
    ],
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
      const noneOption: SelectItem = { label: "None", value: "" };
      const char = characters.find((c) => c.name === speakerName);
      if (!char) return [noneOption];
      return [
        noneOption,
        ...char.moods.map((m) => ({
          label: m,
          value: m.toLowerCase().replace(/\s+/g, "_"),
        })),
      ];
    },
    [characters],
  );

  const getDefaultMoodForSpeaker = useCallback(
    (speakerName: string): string => {
      const char = characters.find((c) => c.name === speakerName);
      if (!char || char.favoriteMoodIndex < 0 || !char.moods[char.favoriteMoodIndex]) return "";
      return char.moods[char.favoriteMoodIndex].toLowerCase().replace(/\s+/g, "_");
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
      value={{ speakers, addSpeaker, getMoodsForSpeaker, getDefaultMoodForSpeaker, addMoodToSpeaker }}
    >
      {children}
    </CharacterDataContext.Provider>
  );
}
export const useCharacterData = () => useContext(CharacterDataContext);
