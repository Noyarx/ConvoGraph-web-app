import type { ReactNode } from "react";

export interface MenuAction {
  id: string;
  label: string;
  icon: ReactNode;
  shortcut?: string;
  variant?: "default" | "critical";
  onClick: (context: any) => void;
}

export interface MenuSection {
  id: string;
  title?: string;
  items: MenuAction[];
}
