import {
  Dialog,
  IconButton,
  InputBase,
  TextField,
} from "@mui/material";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";
import PersonAddAlt1RoundedIcon from "@mui/icons-material/PersonAddAlt1Rounded";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import StarRoundedIcon from "@mui/icons-material/StarRounded";
import StarOutlineRoundedIcon from "@mui/icons-material/StarOutlineRounded";
import CloseIcon from "@mui/icons-material/Close";
import { useReactFlow } from "@xyflow/react";
import { useCharacters, type Character } from "../CharactersContext";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

const PANEL_BG = "#0f172a";
const SIDEBAR_BG = "#0b1120";
const CARD_BG = "#1e293b";
const CARD_BORDER = "#334155";
const ACCENT = "#6366f1";
const TEXT_PRIMARY = "#f1f5f9";
const TEXT_SECONDARY = "#94a3b8";
const TEXT_MUTED = "#475569";

interface CharactersPanelProps {
  open: boolean;
  onClose: () => void;
}

/* ── Editable mood row (left side) ── */
function MoodRow({
  mood,
  isFavorite,
  onToggleFavorite,
  onRename,
  onDelete,
}: {
  mood: string;
  isFavorite: boolean;
  onToggleFavorite: () => void;
  onRename: (newName: string) => void;
  onDelete: () => void;
}) {
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(mood);

  useEffect(() => setValue(mood), [mood]);

  const commit = () => {
    setEditing(false);
    const trimmed = value.trim();
    if (trimmed && trimmed !== mood) onRename(trimmed);
    else setValue(mood);
  };

  return (
    <div
      className="group flex items-center gap-1 px-2 rounded-md transition-colors"
      style={{
        height: 32,
        backgroundColor: "transparent",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLDivElement).style.backgroundColor =
          "rgba(99, 102, 241, 0.06)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLDivElement).style.backgroundColor =
          "transparent";
      }}
    >
      {/* Star */}
      <span
        onClick={(e) => {
          e.stopPropagation();
          onToggleFavorite();
        }}
        className={isFavorite ? "" : "opacity-0 group-hover:opacity-100"}
        style={{
          color: isFavorite ? "#facc15" : TEXT_MUTED,
          transition: "opacity 150ms, color 150ms",
          display: "flex",
          cursor: "pointer",
          flexShrink: 0,
        }}
      >
        {isFavorite ? (
          <StarRoundedIcon sx={{ fontSize: 16 }} />
        ) : (
          <StarOutlineRoundedIcon sx={{ fontSize: 16 }} />
        )}
      </span>

      {/* Name */}
      {editing ? (
        <InputBase
          autoFocus
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onBlur={commit}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              commit();
            }
            if (e.key === "Escape") {
              setValue(mood);
              setEditing(false);
            }
          }}
          sx={{
            flex: 1,
            color: TEXT_PRIMARY,
            fontSize: "0.8125rem",
            fontWeight: 500,
            height: 26,
            px: 0.75,
            borderRadius: "4px",
            backgroundColor: "rgba(99, 102, 241, 0.1)",
            border: `1px solid ${ACCENT}`,
            "& input": { padding: 0 },
          }}
        />
      ) : (
        <span
          className="flex-1 truncate cursor-text"
          onClick={() => setEditing(true)}
          style={{
            color: TEXT_SECONDARY,
            fontSize: "0.8125rem",
            fontWeight: 500,
            paddingLeft: 6,
          }}
        >
          {mood}
        </span>
      )}

      {/* Delete */}
      <span
        onClick={(e) => {
          e.stopPropagation();
          onDelete();
        }}
        className="opacity-0 group-hover:opacity-100"
        style={{
          color: TEXT_MUTED,
          transition: "opacity 150ms, color 150ms",
          display: "flex",
          cursor: "pointer",
          flexShrink: 0,
        }}
      >
        <CloseIcon sx={{ fontSize: 14, "&:hover": { color: "#ef4444" } }} />
      </span>
    </div>
  );
}

/* ── Pool mood row (right side) ── */
function PoolMoodRow({
  mood,
  onAdd,
}: {
  mood: string;
  onAdd: () => void;
}) {
  return (
    <div
      className="group flex items-center gap-1 px-2 rounded-md transition-colors cursor-pointer"
      style={{ height: 32 }}
      onClick={onAdd}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLDivElement).style.backgroundColor =
          "rgba(99, 102, 241, 0.08)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLDivElement).style.backgroundColor =
          "transparent";
      }}
    >
      <span
        className="flex-1 truncate"
        style={{
          color: TEXT_MUTED,
          fontSize: "0.8125rem",
          fontWeight: 500,
          paddingLeft: 4,
        }}
      >
        {mood}
      </span>
      <span
        className="opacity-0 group-hover:opacity-100"
        style={{
          color: ACCENT,
          transition: "opacity 150ms",
          display: "flex",
          flexShrink: 0,
        }}
      >
        <AddRoundedIcon sx={{ fontSize: 16 }} />
      </span>
    </div>
  );
}

/* ── Character detail panel ── */
function CharacterDetail({
  character,
  onUpdate,
  onDelete,
  onAddMood,
  onRemoveMood,
  onRenameMood,
  onSetFavoriteMood,
  allMoods,
}: {
  character: Character;
  onUpdate: (id: string, updates: Partial<Omit<Character, "id">>) => void;
  onDelete: (id: string) => void;
  onAddMood: (charId: string, mood: string) => void;
  onRemoveMood: (charId: string, moodIndex: number) => void;
  onRenameMood: (charId: string, moodIndex: number, newName: string) => void;
  onSetFavoriteMood: (charId: string, moodIndex: number) => void;
  allMoods: string[];
}) {
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [newMood, setNewMood] = useState("");
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  // Reset confirm state when switching characters
  useEffect(() => {
    setConfirmDelete(false);
    setNewMood("");
  }, [character.id]);

  const handleDelete = () => {
    if (confirmDelete) {
      if (timerRef.current) clearTimeout(timerRef.current);
      onDelete(character.id);
    } else {
      setConfirmDelete(true);
      timerRef.current = setTimeout(() => setConfirmDelete(false), 2000);
    }
  };

  const handleAddMood = () => {
    const trimmed = newMood.trim();
    if (!trimmed) return;
    onAddMood(character.id, trimmed);
    setNewMood("");
  };

  const handleMoodKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddMood();
    }
  };

  const ownMoodsLower = useMemo(
    () => new Set(character.moods.map((m) => m.toLowerCase())),
    [character.moods],
  );

  const availablePoolMoods = useMemo(
    () => allMoods.filter((m) => !ownMoodsLower.has(m.toLowerCase())),
    [allMoods, ownMoodsLower],
  );

  const sortedMoods = useMemo(
    () =>
      character.moods
        .map((mood, originalIndex) => ({ mood, originalIndex }))
        .sort((a, b) => a.mood.toLowerCase().localeCompare(b.mood.toLowerCase())),
    [character.moods],
  );

  return (
    <div className="animate-fade-slide-in flex flex-col gap-6 p-8">
      {/* Name */}
      <div className="flex flex-col gap-1 max-w-xl">
        <label
          className="text-xs font-semibold uppercase tracking-wider"
          style={{ color: TEXT_MUTED }}
        >
          Name
        </label>
        <InputBase
          value={character.name}
          onChange={(e) => onUpdate(character.id, { name: e.target.value })}
          placeholder="Character name"
          sx={{
            color: TEXT_PRIMARY,
            fontSize: "1.5rem",
            fontWeight: 700,
            "& input": { padding: 0 },
            "& input::placeholder": { color: TEXT_MUTED, opacity: 1 },
          }}
        />
      </div>

      {/* Description */}
      <div
        className="flex flex-col"
        style={{
          borderRadius: "12px",
          backgroundColor: CARD_BG,
          border: `1px solid ${CARD_BORDER}`,
          height: 130,
          overflow: "hidden",
        }}
      >
        <div
          className="flex items-center justify-between"
          style={{ padding: "8px 14px 0 14px" }}
        >
          <label
            className="text-xs font-semibold uppercase tracking-wider"
            style={{ color: TEXT_MUTED }}
          >
            Description
          </label>
          <span
            className="text-xs"
            style={{
              color:
                character.description.length > 500 ? "#ef4444" : TEXT_MUTED,
            }}
          >
            {character.description.length}/500
          </span>
        </div>
        <InputBase
          value={character.description}
          onChange={(e) => {
            if (e.target.value.length <= 500)
              onUpdate(character.id, { description: e.target.value });
          }}
          placeholder="Add a description..."
          multiline
          sx={{
            flex: 1,
            minHeight: 0,
            color: TEXT_SECONDARY,
            fontSize: "0.9rem",
            lineHeight: 1.7,
            padding: "6px 14px 12px 14px",
            alignItems: "flex-start",
            overflow: "auto",
            "& textarea": { overflow: "auto !important" },
            "& textarea::placeholder": { color: TEXT_MUTED, opacity: 1 },
          }}
        />
      </div>

      {/* Moods — side-by-side list layout */}
      <div
        className="flex items-stretch"
        style={{
          borderRadius: "12px",
          backgroundColor: CARD_BG,
          border: `1px solid ${CARD_BORDER}`,
          overflow: "hidden",
          height: 240,
        }}
      >
        {/* Left: character moods (2 columns, sorted) */}
        <div
          className="flex flex-col gap-1 p-4 min-w-0"
          style={{ flex: 6 }}
        >
          <label
            className="text-xs font-semibold uppercase tracking-wider shrink-0 mb-1"
            style={{ color: TEXT_MUTED }}
          >
            Moods
          </label>

          {/* Scrollable 2-column mood grid */}
          <div
            className="overflow-y-auto"
            style={{ flex: 1, minHeight: 0, paddingRight: 2 }}
          >
            {character.moods.length > 0 ? (
              <div
                className="grid gap-x-1 gap-y-0.5"
                style={{ gridTemplateColumns: "1fr 1fr" }}
              >
                {sortedMoods.map(({ mood, originalIndex }) => (
                  <MoodRow
                    key={`${character.id}-${originalIndex}`}
                    mood={mood}
                    isFavorite={character.favoriteMoodIndex === originalIndex}
                    onToggleFavorite={() =>
                      onSetFavoriteMood(character.id, originalIndex)
                    }
                    onRename={(newName) =>
                      onRenameMood(character.id, originalIndex, newName)
                    }
                    onDelete={() => onRemoveMood(character.id, originalIndex)}
                  />
                ))}
              </div>
            ) : (
              <span
                className="text-xs italic py-2 px-2"
                style={{ color: TEXT_MUTED }}
              >
                No moods assigned
              </span>
            )}
          </div>

          {/* Add new mood */}
          <div className="flex items-center gap-2 shrink-0 pt-1">
            <TextField
              value={newMood}
              onChange={(e) => setNewMood(e.target.value)}
              onKeyDown={handleMoodKeyDown}
              placeholder="New mood..."
              size="small"
              variant="outlined"
              sx={{
                flex: 1,
                maxWidth: 200,
                "& .MuiOutlinedInput-root": {
                  color: TEXT_SECONDARY,
                  fontSize: "0.8rem",
                  backgroundColor: SIDEBAR_BG,
                  borderRadius: "8px",
                  height: 30,
                  "& fieldset": { borderColor: CARD_BORDER },
                  "&:hover fieldset": { borderColor: TEXT_MUTED },
                  "&.Mui-focused fieldset": { borderColor: ACCENT },
                },
                "& input::placeholder": { color: TEXT_MUTED, opacity: 1 },
              }}
            />
            <IconButton
              onClick={handleAddMood}
              disabled={!newMood.trim()}
              size="small"
              sx={{
                color: TEXT_SECONDARY,
                backgroundColor: SIDEBAR_BG,
                width: 30,
                height: 30,
                borderRadius: "8px",
                "&:hover": {
                  color: TEXT_PRIMARY,
                  backgroundColor: ACCENT,
                },
                "&.Mui-disabled": { color: TEXT_MUTED },
              }}
            >
              <AddRoundedIcon sx={{ fontSize: 16 }} />
            </IconButton>
          </div>
        </div>

        {/* Divider */}
        <div
          style={{
            width: 2,
            flexShrink: 0,
            backgroundColor: TEXT_MUTED,
            alignSelf: "stretch",
          }}
        />

        {/* Right: all moods pool (2 columns, sorted) */}
        <div
          className="flex flex-col gap-1 p-4 min-w-0"
          style={{ flex: 4 }}
        >
          <label
            className="text-xs font-semibold uppercase tracking-wider shrink-0 mb-1"
            style={{ color: TEXT_MUTED }}
          >
            All Moods
          </label>
          <div
            className="overflow-y-auto"
            style={{
              flex: 1,
              minHeight: 0,
              paddingRight: 2,
            }}
          >
            {availablePoolMoods.length > 0 ? (
              <div
                className="grid gap-x-1 gap-y-0.5"
                style={{ gridTemplateColumns: "1fr 1fr" }}
              >
                {availablePoolMoods.map((mood) => (
                  <PoolMoodRow
                    key={mood}
                    mood={mood}
                    onAdd={() => onAddMood(character.id, mood)}
                  />
                ))}
              </div>
            ) : (
              <span
                className="text-xs italic py-2 px-2"
                style={{ color: TEXT_MUTED }}
              >
                {allMoods.length === 0
                  ? "No moods in project"
                  : "All moods assigned"}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Delete */}
      <div className="pt-4 mt-auto">
        <button
          onClick={handleDelete}
          className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer"
          style={{
            color: confirmDelete ? "#fca5a5" : TEXT_MUTED,
            backgroundColor: confirmDelete
              ? "rgba(239, 68, 68, 0.15)"
              : "transparent",
            border: `1px solid ${confirmDelete ? "rgba(239, 68, 68, 0.3)" : "transparent"}`,
          }}
        >
          <DeleteOutlineRoundedIcon fontSize="small" />
          {confirmDelete ? "Click again to confirm" : "Delete character"}
        </button>
      </div>
    </div>
  );
}

export default function CharactersPanel({
  open,
  onClose,
}: CharactersPanelProps) {
  const {
    characters,
    addCharacter,
    updateCharacter,
    deleteCharacter,
    addMoodToCharacter,
    removeMoodFromCharacter,
    renameMoodInCharacter,
    setFavoriteMood,
    favoriteId,
    toggleFavorite,
  } = useCharacters();
  const { getNodes, setNodes } = useReactFlow();
  const [selectedId, setSelectedId] = useState<string | null>(
    characters[0]?.id ?? null,
  );

  const selectedCharacter = characters.find((c) => c.id === selectedId) ?? null;

  // Collect all unique moods across all characters, sorted alphabetically
  const allMoods = useMemo(() => {
    const seen = new Map<string, string>();
    for (const char of characters) {
      for (const mood of char.moods) {
        const key = mood.toLowerCase();
        if (!seen.has(key)) seen.set(key, mood);
      }
    }
    return [...seen.values()].sort((a, b) =>
      a.toLowerCase().localeCompare(b.toLowerCase()),
    );
  }, [characters]);

  // If selected character was deleted, select the first one
  useEffect(() => {
    if (selectedId && !characters.find((c) => c.id === selectedId)) {
      setSelectedId(characters[0]?.id ?? null);
    }
  }, [characters, selectedId]);

  const normalizeMood = (m: string) => m.toLowerCase().replace(/\s+/g, "_");

  const getNodeDialogue = (node: { data: Record<string, unknown> }) =>
    node.data?.data as { speaker?: string; mood?: string } | undefined;

  const handleRemoveMood = useCallback(
    (charId: string, moodIndex: number) => {
      const char = characters.find((c) => c.id === charId);
      if (!char) return;
      const removedMood = char.moods[moodIndex];
      removeMoodFromCharacter(charId, moodIndex);
      const moodValue = normalizeMood(removedMood);
      const nodes = getNodes();
      let changed = false;
      const updated = nodes.map((node) => {
        if (node.type !== "statement" && node.type !== "question") return node;
        const d = getNodeDialogue(node);
        if (d?.speaker !== char.name || d?.mood !== moodValue) return node;
        changed = true;
        return {
          ...node,
          data: { ...node.data, data: { ...d, mood: "" } },
        };
      });
      if (changed) setNodes(updated);
    },
    [characters, removeMoodFromCharacter, getNodes, setNodes],
  );

  const handleRenameMood = useCallback(
    (charId: string, moodIndex: number, newName: string) => {
      const char = characters.find((c) => c.id === charId);
      if (!char) return;
      const oldMood = char.moods[moodIndex];
      renameMoodInCharacter(charId, moodIndex, newName);
      const oldNorm = normalizeMood(oldMood);
      const newNorm = normalizeMood(newName);
      if (oldNorm === newNorm) return;
      const nodes = getNodes();
      let changed = false;
      const updated = nodes.map((node) => {
        if (node.type !== "statement" && node.type !== "question") return node;
        const d = getNodeDialogue(node);
        if (d?.speaker !== char.name || d?.mood !== oldNorm) return node;
        changed = true;
        return {
          ...node,
          data: { ...node.data, data: { ...d, mood: newNorm } },
        };
      });
      if (changed) setNodes(updated);
    },
    [characters, renameMoodInCharacter, getNodes, setNodes],
  );

  const handleDeleteCharacter = useCallback(
    (charId: string) => {
      const char = characters.find((c) => c.id === charId);
      if (!char) return;
      deleteCharacter(charId);
      const nodes = getNodes();
      let changed = false;
      const updated = nodes.map((node) => {
        if (node.type !== "statement" && node.type !== "question") return node;
        const d = getNodeDialogue(node);
        if (d?.speaker !== char.name) return node;
        changed = true;
        return {
          ...node,
          data: { ...node.data, data: { ...d, speaker: "", mood: "" } },
        };
      });
      if (changed) setNodes(updated);
    },
    [characters, deleteCharacter, getNodes, setNodes],
  );

  const handleAdd = useCallback(() => {
    const newChar = { name: "", description: "" };
    addCharacter(newChar.name, newChar.description);
    setTimeout(() => {
      // The new character will be the last one
    }, 0);
  }, [addCharacter]);

  // Select newly added character
  useEffect(() => {
    const last = characters[characters.length - 1];
    if (last && last.name === "" && last.description === "") {
      setSelectedId(last.id);
    }
  }, [characters.length]);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullScreen
      PaperProps={{
        sx: {
          backgroundColor: PANEL_BG,
          backgroundImage: "none",
        },
      }}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between px-6 py-4 shrink-0"
        style={{ borderBottom: `1px solid ${CARD_BORDER}` }}
      >
        <h1
          className="text-xl font-bold tracking-wide"
          style={{ color: TEXT_PRIMARY }}
        >
          Characters
        </h1>
        <div className="flex items-center gap-2">
          <IconButton
            onClick={onClose}
            sx={{ color: TEXT_SECONDARY, "&:hover": { color: TEXT_PRIMARY } }}
          >
            <CloseRoundedIcon />
          </IconButton>
        </div>
      </div>

      {/* Body: split layout */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left sidebar - character list */}
        <div
          className="flex flex-col overflow-y-auto shrink-0"
          style={{
            width: 220,
            backgroundColor: SIDEBAR_BG,
            borderRight: `1px solid ${CARD_BORDER}`,
          }}
        >
          <button
            onClick={handleAdd}
            className="flex items-center justify-center gap-2 px-5 py-3 text-sm font-medium cursor-pointer transition-colors"
            style={{
              color: ACCENT,
              borderBottom: `1px solid ${CARD_BORDER}`,
            }}
          >
            <PersonAddAlt1RoundedIcon sx={{ fontSize: 18 }} />
            Add character
          </button>
          {characters.map((char) => {
            const isFav = favoriteId === char.id;
            return (
              <button
                key={char.id}
                onClick={() => setSelectedId(char.id)}
                className="group flex items-center gap-2 px-5 py-3.5 text-left transition-colors cursor-pointer"
                style={{
                  backgroundColor:
                    selectedId === char.id
                      ? "rgba(99, 102, 241, 0.12)"
                      : "transparent",
                  borderLeft:
                    selectedId === char.id
                      ? `3px solid ${ACCENT}`
                      : "3px solid transparent",
                  color:
                    selectedId === char.id ? TEXT_PRIMARY : TEXT_SECONDARY,
                }}
              >
                <span
                  className="text-sm font-medium truncate flex-1"
                  style={{ maxWidth: 150 }}
                >
                  {char.name || "Unnamed"}
                </span>
                <span
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleFavorite(char.id);
                  }}
                  className={isFav ? "" : "opacity-0 group-hover:opacity-100"}
                  style={{
                    color: isFav ? "#facc15" : TEXT_MUTED,
                    transition: "opacity 150ms, color 150ms",
                    display: "flex",
                    cursor: "pointer",
                  }}
                >
                  {isFav ? (
                    <StarRoundedIcon sx={{ fontSize: 18 }} />
                  ) : (
                    <StarOutlineRoundedIcon sx={{ fontSize: 18 }} />
                  )}
                </span>
              </button>
            );
          })}

          {characters.length === 0 && (
            <div className="px-5 py-8 text-center">
              <p className="text-sm" style={{ color: TEXT_MUTED }}>
                No characters
              </p>
            </div>
          )}
        </div>

        {/* Right panel - character detail */}
        <div className="flex-1 overflow-y-auto">
          {selectedCharacter ? (
            <CharacterDetail
              key={selectedCharacter.id}
              character={selectedCharacter}
              onUpdate={updateCharacter}
              onDelete={handleDeleteCharacter}
              onAddMood={addMoodToCharacter}
              onRemoveMood={handleRemoveMood}
              onRenameMood={handleRenameMood}
              onSetFavoriteMood={setFavoriteMood}
              allMoods={allMoods}
            />
          ) : (
            <div className="flex items-center justify-center h-full">
              <p className="text-lg" style={{ color: TEXT_MUTED }}>
                {characters.length === 0
                  ? "Add a character to get started"
                  : "Select a character"}
              </p>
            </div>
          )}
        </div>
      </div>
    </Dialog>
  );
}
