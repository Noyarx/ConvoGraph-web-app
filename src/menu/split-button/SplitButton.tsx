import { Button } from "@material-tailwind/react";
import { ChevronRightRounded } from "@mui/icons-material";
import { useState, type ReactNode } from "react";
import GenericMenu from "../GenericMenu";
import type { MenuItem } from "../models/MenuItem.model";
import { Divider } from "@mui/material";

interface SplitButtonProps {
  items: MenuItem[];
  label?: string;
  icon?: ReactNode;
  anchorOffset?: { x: number; y: number };

  onClick: () => void;
}

export default function SplitButton({
  items,
  label,
  icon,
  anchorOffset,
  onClick,
}: SplitButtonProps) {
  const [open, setOpen] = useState<boolean>(false);
  const [el, setEl] = useState<HTMLElement | null | undefined>(null);

  if (!items) return;

  return (
    <>
      <div className={`flex flex-row items-center bg-slate-800 rounded-xl`}>
        <Button
          className={`flex flew-row justify-between gap-1 px-1 pl-1.5 rounded-s-xl rounded-e-sm`}
          onClick={onClick}
        >
          {icon && <span className={``}>{icon}</span>}

          {label && <span className={`font-bold px-1`}>{label}</span>}
        </Button>

        <Divider
          orientation={"vertical"}
          sx={{ height: "70%" }}
          className={`bg-slate-600`}
        />

        <Button
          onClick={(e) => {
            setEl(e.currentTarget.parentElement);
            setOpen(!open);
          }}
          className={`rounded-e-xl rounded-s-sm px-1 pr-1.5`}
        >
          {(label || icon) && (
            <span
              className={`transition-transform ${open ? "rotate-90" : "-rotate-90"}`}
            >
              {<ChevronRightRounded />}
            </span>
          )}
        </Button>
      </div>
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
