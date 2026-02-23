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
  favoriteMoodIndex: number;
}

export interface CharactersContextType {
  characters: Character[];
  favoriteId: string | null;
  addCharacter: (name: string, description: string) => void;
  updateCharacter: (
    id: string,
    updates: Partial<Omit<Character, "id">>,
  ) => void;
  deleteCharacter: (id: string) => void;
  addMoodToCharacter: (charId: string, mood: string) => void;
  removeMoodFromCharacter: (charId: string, moodIndex: number) => void;
  renameMoodInCharacter: (charId: string, moodIndex: number, newName: string) => void;
  setFavoriteMood: (charId: string, moodIndex: number) => void;
  toggleFavorite: (id: string) => void;
}

const defaultCharacters: Character[] = [
  {
    id: "char-matthew",
    name: "Matthew",
    description: "",
    moods: ["Neutral"],
    favoriteMoodIndex: 0,
  },
  {
    id: "char-mae",
    name: "Mae",
    description: "",
    moods: ["Neutral"],
    favoriteMoodIndex: 0,
  },
  {
    id: "char-gregson",
    name: "Gregson",
    description: "",
    moods: ["Neutral"],
    favoriteMoodIndex: 0,
  },
];

const CharactersContext = createContext<CharactersContextType | null>(null);

export function CharactersProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [characters, setCharacters] = useState<Character[]>(defaultCharacters);
  const [favoriteId, setFavoriteId] = useState<string | null>("char-matthew");

  const addCharacter = useCallback((name: string, description: string) => {
    setCharacters((prev) => [
      ...prev,
      { id: uuidv4(), name, description, moods: ["Neutral"], favoriteMoodIndex: 0 },
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

  const deleteCharacter = useCallback(
    (id: string) => {
      setCharacters((prev) => prev.filter((c) => c.id !== id));
      if (favoriteId === id) setFavoriteId(null);
    },
    [favoriteId],
  );

  const toggleFavorite = useCallback(
    (id: string) => {
      setFavoriteId((prev) => (prev === id ? null : id));
    },
    [],
  );

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
        prev.map((c) => {
          if (c.id !== charId) return c;
          const newMoods = c.moods.filter((_, i) => i !== moodIndex);
          let newFavIndex = c.favoriteMoodIndex;
          if (moodIndex === c.favoriteMoodIndex) {
            newFavIndex = newMoods.length > 0 ? 0 : -1;
          } else if (moodIndex < c.favoriteMoodIndex) {
            newFavIndex = c.favoriteMoodIndex - 1;
          }
          return { ...c, moods: newMoods, favoriteMoodIndex: newFavIndex };
        }),
      );
    },
    [],
  );

  const renameMoodInCharacter = useCallback(
    (charId: string, moodIndex: number, newName: string) => {
      setCharacters((prev) =>
        prev.map((c) => {
          if (c.id !== charId) return c;
          if (c.moods.some((m, i) => i !== moodIndex && m.toLowerCase() === newName.toLowerCase()))
            return c; // duplicate
          return { ...c, moods: c.moods.map((m, i) => (i === moodIndex ? newName : m)) };
        }),
      );
    },
    [],
  );

  const setFavoriteMood = useCallback(
    (charId: string, moodIndex: number) => {
      setCharacters((prev) =>
        prev.map((c) =>
          c.id === charId ? { ...c, favoriteMoodIndex: moodIndex } : c,
        ),
      );
    },
    [],
  );

  return (
    <CharactersContext.Provider
      value={{
        characters,
        favoriteId,
        addCharacter,
        updateCharacter,
        deleteCharacter,
        addMoodToCharacter,
        removeMoodFromCharacter,
        renameMoodInCharacter,
        setFavoriteMood,
        toggleFavorite,
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
