import type { TextModifier } from "./TextModifiers.model";

// This is an abstract node data type, it is only created to be used as template type for a BaseNode.
// Must use one of its variants when instantiating a node
export type GraphNodeData =
  | DialogueNodeData
  | ConditionalNodeData
  | EventNodeData
  | CommentNodeData;

export interface DialogueNodeData {
  speaker: string;
  mood: string;
  text: string;
  text_modifiers?: TextModifier[];
}

export interface ConditionalNodeData {
  condition: string;
}

export interface EventNodeData {
  event_name: string;
  parameters: Record<string, any>;
}

export interface CommentNodeData {
  text: string;
}
