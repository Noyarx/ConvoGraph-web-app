import type { DialogueChoice } from "./DialogueChoice.model";
import type {
  CommentNodeData,
  ConditionalNodeData,
  DialogueNodeData,
  EventNodeData,
  GraphNodeData,
} from "./NodeDataTypes.model";
import type { NodeInfo } from "./NodeInfo.model";

export type NodeTypeString =
  | "statement"
  | "question"
  | "condition"
  | "event"
  | "comment";

// Main node to instantiate and render in the graph
export type GraphNode =
  | StatementNode
  | QuestionNode
  | ConditionalNode
  | EventNode
  | CommentNode;

export interface BaseNode {
  id: string;
  node_info: NodeInfo;
  data: GraphNodeData;
}

export interface StatementNode extends BaseNode {
  type: "statement";
  data: DialogueNodeData;
  next_node: string;
}

export interface QuestionNode extends BaseNode {
  type: "question";
  data: DialogueNodeData;
  choices: DialogueChoice[];
}

export interface ConditionalNode extends BaseNode {
  type: "condition";
  data: ConditionalNodeData;
  next_node_true: string;
  next_node_false: string;
}

export interface EventNode extends BaseNode {
  type: "event";
  data: EventNodeData;
  next_node: string;
}

export interface CommentNode extends BaseNode {
  type: "comment";
  data: CommentNodeData;
}
