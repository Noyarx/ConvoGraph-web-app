import type { ReactNode } from "react";

export type MenuItem = MenuActionItem | MenuSubmenuItem | MenuSeparator;

export interface MenuBaseItem {
  id: string;
}

export interface MenuActionItem extends MenuBaseItem {
  type: "action";
  label: string;
  icon?: ReactNode;
  shortcut?: string;
  variant?: "default" | "critical";
  command: () => void;
}

export interface MenuSubmenuItem extends MenuBaseItem {
  type: "submenu";
  label: string;
  icon?: ReactNode;
  items: MenuItem[]; //
}

export interface MenuSeparator {
  type: "separator";
}
