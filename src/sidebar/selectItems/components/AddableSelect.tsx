import { useState } from "react";
import {
  Box,
  Button,
  MenuItem,
  Popover,
  Select,
  TextField,
  IconButton,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import type { SelectItem } from "../../selectItems/SelectItems";
import { Typography } from "@material-tailwind/react";

interface AddableSelectProps {
  value: string;
  onChange: (val: string) => void;
  items: SelectItem[];
  onAdd: (label: string) => void;
  placeholder?: string;
}
const itemClass = "!mx-1.5 !my-1 !rounded";
const itemHoverClass = "hover:!bg-slate-200";
export default function AddableSelect({
  value,
  items,
  onChange,
  onAdd,
  placeholder = "",
}: AddableSelectProps) {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [newItem, setNewItem] = useState("");

  const handleClose = () => {
    setAnchorEl(null);
    setNewItem("");
  };

  const handleOpen = (evt: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(evt.currentTarget);
  };
  // if an anchor element is set, set the popover open
  const open = Boolean(anchorEl);

  const handleAdd = () => {
    if (!newItem.trim()) return;
    onAdd(newItem.trim());
    handleClose();
  };

  return (
    <div className={`flex items-center gap-1`}>
      <Select
        value={value}
        renderValue={(selected) => {
          if (!selected) return <em>{placeholder}</em>;
          return items.find((e) => e.value === selected)?.label;
        }}
        onChange={(e) => onChange(e.target.value)}
        style={{ border: "none", outline: "none" }}
        sx={{
          maxHeight: 36,
          minWidth: 100,
        }}
        className="hover:!ring-2 hover:!ring-blue-200 "
      >
        {items.map((item) => (
          <MenuItem
            className={`${itemClass} ${itemHoverClass}`}
            key={item.value}
            value={item.value}
          >
            {item.label}
          </MenuItem>
        ))}
      </Select>

      <IconButton
        // style={{ outline: "none", color: "#252525ff" }}
        className="outline-none !p-[3px] shadow-md !text-blue-800 hover:!text-blue-600 "
        onClick={handleOpen}
      >
        <AddIcon fontSize="small" />
      </IconButton>

      {/* --- Popover per aggiungere nuovo item --- */}
      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
      >
        <Typography variant="subtitle2" fontWeight="bold">
          Aggiungi nuovo elemento
        </Typography>
        <TextField
          size="small"
          placeholder="Nome..."
          value={newItem}
          onChange={(e) => setNewItem(e.target.value)}
        />
        <Box display="flex" justifyContent="flex-end" gap={1}>
          <Button size="small" onClick={handleClose}>
            Annulla
          </Button>
          <Button
            size="small"
            variant="contained"
            onClick={handleAdd}
            disabled={!newItem.trim()}
          >
            Aggiungi
          </Button>
        </Box>
      </Popover>
    </div>
  );
}
