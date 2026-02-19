import {
  Chip,
  Dialog,
  IconButton,
  InputBase,
  TextField,
  Tooltip,
} from "@mui/material";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";
import PersonAddAlt1RoundedIcon from "@mui/icons-material/PersonAddAlt1Rounded";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import { useCharacters, type Character } from "../CharactersContext";
import { useCallback, useEffect, useRef, useState } from "react";

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

function CharacterDetail({
  character,
  onUpdate,
  onDelete,
  onAddMood,
  onRemoveMood,
}: {
  character: Character;
  onUpdate: (id: string, updates: Partial<Omit<Character, "id">>) => void;
  onDelete: (id: string) => void;
  onAddMood: (charId: string, mood: string) => void;
  onRemoveMood: (charId: string, moodIndex: number) => void;
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

  return (
    <div className="animate-fade-slide-in flex flex-col gap-6 p-8 max-w-xl">
      {/* Name */}
      <div className="flex flex-col gap-1">
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
      <div className="flex flex-col gap-1">
        <label
          className="text-xs font-semibold uppercase tracking-wider"
          style={{ color: TEXT_MUTED }}
        >
          Description
        </label>
        <InputBase
          value={character.description}
          onChange={(e) =>
            onUpdate(character.id, { description: e.target.value })
          }
          placeholder="Add a description..."
          multiline
          minRows={3}
          maxRows={8}
          sx={{
            color: TEXT_SECONDARY,
            fontSize: "0.9rem",
            lineHeight: 1.7,
            padding: "12px 14px",
            borderRadius: "10px",
            backgroundColor: CARD_BG,
            border: `1px solid ${CARD_BORDER}`,
            "& textarea::placeholder": { color: TEXT_MUTED, opacity: 1 },
          }}
        />
      </div>

      {/* Moods */}
      <div className="flex flex-col gap-2">
        <label
          className="text-xs font-semibold uppercase tracking-wider"
          style={{ color: TEXT_MUTED }}
        >
          Moods
        </label>
        <div className="flex flex-wrap gap-1.5">
          {character.moods.map((mood, index) => (
            <Chip
              key={`${mood}-${index}`}
              label={mood}
              onDelete={() => onRemoveMood(character.id, index)}
              size="small"
              sx={{
                backgroundColor: CARD_BG,
                color: TEXT_SECONDARY,
                border: `1px solid ${CARD_BORDER}`,
                fontWeight: 500,
                "& .MuiChip-deleteIcon": {
                  color: TEXT_MUTED,
                  "&:hover": { color: "#ef4444" },
                },
              }}
            />
          ))}
        </div>
        <div className="flex items-center gap-2 mt-1">
          <TextField
            value={newMood}
            onChange={(e) => setNewMood(e.target.value)}
            onKeyDown={handleMoodKeyDown}
            placeholder="New mood..."
            size="small"
            variant="outlined"
            sx={{
              width: 180,
              "& .MuiOutlinedInput-root": {
                color: TEXT_SECONDARY,
                fontSize: "0.85rem",
                backgroundColor: CARD_BG,
                borderRadius: "8px",
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
              "&:hover": { color: TEXT_PRIMARY },
              "&.Mui-disabled": { color: TEXT_MUTED },
            }}
          >
            <AddRoundedIcon fontSize="small" />
          </IconButton>
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
  } = useCharacters();
  const [selectedId, setSelectedId] = useState<string | null>(
    characters[0]?.id ?? null,
  );

  const selectedCharacter = characters.find((c) => c.id === selectedId) ?? null;

  // If selected character was deleted, select the first one
  useEffect(() => {
    if (selectedId && !characters.find((c) => c.id === selectedId)) {
      setSelectedId(characters[0]?.id ?? null);
    }
  }, [characters, selectedId]);

  const handleAdd = useCallback(() => {
    const newChar = { name: "", description: "" };
    addCharacter(newChar.name, newChar.description);
    // Select the newly added character after state updates
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
          <Tooltip title="Add character">
            <IconButton
              onClick={handleAdd}
              sx={{
                color: TEXT_PRIMARY,
                backgroundColor: ACCENT,
                "&:hover": { backgroundColor: "#4f46e5" },
                borderRadius: "10px",
                px: 1.5,
                py: 0.75,
              }}
            >
              <PersonAddAlt1RoundedIcon fontSize="small" />
            </IconButton>
          </Tooltip>
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
          {characters.map((char) => (
            <button
              key={char.id}
              onClick={() => setSelectedId(char.id)}
              className="flex items-center gap-3 px-5 py-3.5 text-left transition-colors cursor-pointer"
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
                className="text-sm font-medium truncate"
                style={{ maxWidth: 170 }}
              >
                {char.name || "Unnamed"}
              </span>
            </button>
          ))}

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
              onDelete={deleteCharacter}
              onAddMood={addMoodToCharacter}
              onRemoveMood={removeMoodFromCharacter}
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
