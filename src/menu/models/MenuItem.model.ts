import type { ReactNode } from "react";

export type MenuItem = MenuActionItem | MenuSubmenuItem | MenuSeparator;

export interface MenuActionItem {
  type: "action";
  id: string;
  label: string;
  icon?: ReactNode;
  shortcut?: string;
  variant?: "default" | "critical";
  command: () => void;
}

export interface MenuSubmenuItem {
  type: "submenu";
  id: string;
  label: string;
  icon?: ReactNode;
  items: MenuItem[]; //
}

export interface MenuSeparator {
  type: "separator";
}
