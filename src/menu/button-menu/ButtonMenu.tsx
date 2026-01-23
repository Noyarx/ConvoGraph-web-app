import { Button } from "@material-tailwind/react";
import { ChevronRightRounded } from "@mui/icons-material";
import { useState, type ReactNode } from "react";
import GenericMenu from "../GenericMenu";
import type { MenuItem } from "../models/MenuItem.model";

interface ButtonMenuProps {
  items: MenuItem[];
  label?: string;
  startIcon?: ReactNode;
  anchorOffset?: { x: number; y: number };
}

export default function ButtonMenu({
  items,
  label,
  startIcon,
  anchorOffset,
}: ButtonMenuProps) {
  const [open, setOpen] = useState<boolean>(false);
  const [el, setEl] = useState<HTMLElement | null | undefined>(null);

  if (!items) return;

  return (
    <>
      <Button
        className={`flex flew-row justify-between gap-1 rounded-xl p-1`}
        onClick={(e) => {
          setEl(e.currentTarget);
          setOpen(!open);
        }}
      >
        {startIcon && <span className={``}>{startIcon}</span>}

        {label && <span className={`font-bold px-1`}>{label}</span>}
        {(label || startIcon) && (
          <span className={`${open ? "rotate-90" : "-rotate-90"}`}>
            {<ChevronRightRounded />}
          </span>
        )}
      </Button>
      <GenericMenu
        onClose={() => setOpen(false)}
        open={open}
        items={items}
        anchorEl={el}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        transformOrigin={{ vertical: "bottom", horizontal: "center" }}
        anchorOffset={anchorOffset ?? { x: 0, y: 0 }}
      />
    </>
  );
}
