import type { MenuItem } from "../models/MenuItem.model";

export interface MenuRequest {
  id: string;
  anchorPosition?: { x: number; y: number };
  anchorEl?: HTMLElement;
  items: MenuItem[];
}
