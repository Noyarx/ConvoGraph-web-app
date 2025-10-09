import type { TextModifier } from "./TextModifiers.model";

export interface DialogueChoice{
    text: string,
    text_modifier: TextModifier[],
    next_node: string
}