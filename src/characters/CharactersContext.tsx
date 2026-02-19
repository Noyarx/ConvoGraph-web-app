import { createContext, useCallback, useContext, useState } from "react";
import { v4 as uuidv4 } from "uuid";

export const DEFAULT_MOODS = [
  "Neutral",
  "Happy",
  "Sad",
  "Angry",
  "Annoyed",
  "Laughing",
];

export interface Character {
  id: string;
  name: string;
  description: string;
  moods: string[];
}

export interface CharactersContextType {
  characters: Character[];
  addCharacter: (name: string, description: string) => void;
  updateCharacter: (
    id: string,
    updates: Partial<Omit<Character, "id">>,
  ) => void;
  deleteCharacter: (id: string) => void;
  addMoodToCharacter: (charId: string, mood: string) => void;
  removeMoodFromCharacter: (charId: string, moodIndex: number) => void;
}

const defaultCharacters: Character[] = [
  {
    id: "char-matthew",
    name: "Matthew",
    description: "",
    moods: ["Neutral"],
  },
  {
    id: "char-mae",
    name: "Mae",
    description: "",
    moods: ["Neutral"],
  },
  {
    id: "char-gregson",
    name: "Gregson",
    description: "",
    moods: ["Neutral"],
  },
];

const CharactersContext = createContext<CharactersContextType | null>(null);

export function CharactersProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [characters, setCharacters] = useState<Character[]>(defaultCharacters);

  const addCharacter = useCallback((name: string, description: string) => {
    setCharacters((prev) => [
      ...prev,
      { id: uuidv4(), name, description, moods: [...DEFAULT_MOODS] },
    ]);
  }, []);

  const updateCharacter = useCallback(
    (id: string, updates: Partial<Omit<Character, "id">>) => {
      setCharacters((prev) =>
        prev.map((c) => (c.id === id ? { ...c, ...updates } : c)),
      );
    },
    [],
  );

  const deleteCharacter = useCallback((id: string) => {
    setCharacters((prev) => prev.filter((c) => c.id !== id));
  }, []);

  const addMoodToCharacter = useCallback((charId: string, mood: string) => {
    setCharacters((prev) =>
      prev.map((c) =>
        c.id === charId && !c.moods.includes(mood)
          ? { ...c, moods: [...c.moods, mood] }
          : c,
      ),
    );
  }, []);

  const removeMoodFromCharacter = useCallback(
    (charId: string, moodIndex: number) => {
      setCharacters((prev) =>
        prev.map((c) =>
          c.id === charId
            ? { ...c, moods: c.moods.filter((_, i) => i !== moodIndex) }
            : c,
        ),
      );
    },
    [],
  );

  return (
    <CharactersContext.Provider
      value={{
        characters,
        addCharacter,
        updateCharacter,
        deleteCharacter,
        addMoodToCharacter,
        removeMoodFromCharacter,
      }}
    >
      {children}
    </CharactersContext.Provider>
  );
}

export function useCharacters() {
  const ctx = useContext(CharactersContext);
  if (!ctx)
    throw new Error("useCharacters must be used within CharactersProvider");
  return ctx;
}
