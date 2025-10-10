import type { TextModifier } from "./TextModifiers.model";

export interface DialogueChoice {
  index: number;
  text: string;
  text_modifier: TextModifier[];
  next_node: string;
}
