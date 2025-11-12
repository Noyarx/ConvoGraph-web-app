import type { TextModifier } from "./TextModifiers.model";

export interface DialogueChoice {
  index: number;
  text: string;
  next_node: string;
  color?: string;
  text_modifier?: TextModifier[];
}
