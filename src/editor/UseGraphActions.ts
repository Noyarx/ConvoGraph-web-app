import { useReactFlow, type Edge, type Node } from "@xyflow/react";
import { useCallback } from "react";
import { v4 as uuidv4 } from "uuid";
import { useFlowHistory } from "../flow-history/FlowHistoryContext";
import type { GraphNode, nodeTypeString } from "../models/NodeTypes.model";
import { bgColor as commentBgColor } from "../nodes/components/CommentNodeComponent";
import { bgColor as conditionBgColor } from "../nodes/components/ConditionalNodeComponent";
import { bgColor as eventBgColor } from "../nodes/components/EventNodeComponent";
import { bgColor as questionBgColor } from "../nodes/components/QuestionNodeComponent";
import { bgColor as statementBgColor } from "../nodes/components/StatementNodeComponent";
import type { addNodeProps, GraphActions } from "./GraphActions.model";

function createGraphNode(
  type: nodeTypeString,
  id: string,
  position: { x: number; y: number } = { x: 0, y: 0 }
): GraphNode {
  switch (type) {
    case "statement":
      return {
        id,
        type,
        next_node: "",
        node_info: {
          position,
          title: "Nuova frase",
          color: statementBgColor,
        },
        data: {
          speaker: "Matthew",
          mood: "happy",
          text: "Ciao, sono Matthew. In realtà sono solo un nuovo nodo blu.",
        },
      };
    case "question":
      return {
        id,
        type,
        node_info: {
          position,
          title: "Nuova Domanda",
          color: questionBgColor,
        },
        data: {
          speaker: "Matthew",
          mood: "happy",
          text: "Ciao, sono Matthew. In realtà sono solo un nuovo nodo blu.",
        },
        choices: [],
      };
    case "condition":
      return {
        id,
        type,
        next_node_true: "",
        next_node_false: "",
        node_info: {
          position,
          title: "Nuova Condition",
          color: conditionBgColor,
        },
        data: {
          var_name: "weaponsFound",
          operator: ">=",
          value: 2,
        },
      };
    case "event":
      return {
        id,
        type,
        next_node: "",
        node_info: {
          position,
          title: "Nuovo Evento",
          color: eventBgColor,
        },
        data: {
          event_name: "unEvento",
          parameters: { someParam: 7 },
        },
      };
    case "comment":
      return {
        id,
        type,
        node_info: {
          position,
          title: "Nuovo Commento",
          color: commentBgColor,
        },
        data: {
          text: "# Questo è un commento",
        },
      };
  }
}

export function useGraphActions(): GraphActions {
  const { addNodes, addEdges, deleteElements, screenToFlowPosition } =
    useReactFlow();
  const flowHistory = useFlowHistory();

  const handleAddNode = useCallback(
    ({ position, node, type }: addNodeProps) => {
      const newId = uuidv4();
      const offset = { x: 120, y: 120 };
      const pos = position
        ? position
        : screenToFlowPosition({
            x: screen.width / 2 - offset.x,
            y: screen.height / 2 - offset.y,
          });

      const newNode: Node = node
        ? {
            ...node,
            selected: false,
            id: newId,
            position: {
              x: node.position.x + offset.x,
              y: node.position.y + offset.y,
            },
            data: {
              ...node.data,
              node_info: node.data.node_info,
              data: node.data.data,
            },
          }
        : {
            type,
            id: newId,
            position: pos,
            data: createGraphNode(type || "statement", newId, pos) as any,
          };
      flowHistory.saveState();
      addNodes(newNode);
    },
    [addNodes, flowHistory.saveState]
  );

  const handleDeleteNode = useCallback(
    (node: Node) => {
      flowHistory.saveState();
      deleteElements({ nodes: [node] });
    },
    [deleteElements, flowHistory.saveState]
  );

  const handleDeleteEdge = useCallback(
    (edge: Edge) => {
      flowHistory.saveState();
      deleteElements({ edges: [edge] });
    },
    [deleteElements, flowHistory.saveState]
  );

  const handleConnect = useCallback(
    (edge: Edge) => {
      flowHistory.saveState();
      addEdges(edge);
    },
    [addEdges, flowHistory.saveState]
  );

  return {
    handleAddNode,
    handleDeleteNode,
    handleDeleteEdge,
    handleConnect,
  };
}
