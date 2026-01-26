import { useReactFlow, type Edge, type Node } from "@xyflow/react";
import { useCallback, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { useFlowHistory } from "../flow-history/FlowHistoryContext";
import type { GraphNode, NodeTypeString } from "../models/NodeTypes.model";
import { bgColor as commentBgColor } from "../nodes/components/CommentNodeComponent";
import { bgColor as conditionBgColor } from "../nodes/components/ConditionalNodeComponent";
import { bgColor as eventBgColor } from "../nodes/components/EventNodeComponent";
import { bgColor as questionBgColor } from "../nodes/components/QuestionNodeComponent";
import { bgColor as statementBgColor } from "../nodes/components/StatementNodeComponent";
import type { addNodeProps, GraphActions } from "./GraphActions.model";

function createGraphNode(
  type: NodeTypeString,
  id: string,
  position: { x: number; y: number } = { x: 0, y: 0 },
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
  const { addNodes, addEdges, deleteElements, screenToFlowPosition, fitView } =
    useReactFlow();
  const flowHistory = useFlowHistory();

  const offset = { x: 120, y: 120 };

  const centerView = () => {
    fitView();
  };
  const [selectedType, setSelectedType] = useState<NodeTypeString>("statement");
  const getSelectedNodeType = () => selectedType;
  const setSelectedNodeType = (type: NodeTypeString) => setSelectedType(type);

  const handleAddNode = useCallback(
    ({ position, type }: addNodeProps) => {
      const newId = uuidv4();
      const pos = position
        ? screenToFlowPosition(position)
        : screenToFlowPosition({
            x: screen.width / 2 - offset.x,
            y: screen.height / 2 - offset.y,
          });

      const newNode: Node = {
        type,
        id: newId,
        position: pos,
        data: createGraphNode(type || "statement", newId, pos) as any,
      };
      flowHistory.saveState();
      addNodes(newNode);
    },
    [addNodes, flowHistory.saveState],
  );

  const handleDuplicateNode = useCallback(
    (node: Node) => {
      const newId = uuidv4();
      const copiedNode = {
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
      };
      flowHistory.saveState();
      addNodes(copiedNode);
    },
    [flowHistory.saveState, addNodes],
  );

  const handleDuplicateNodes = useCallback(
    (nodes: Node[]) => {
      // const selected = getNodes().filter((n) => n.selected === true);

      const newNodes: Node[] = nodes.map((node) => ({
        ...node,
        selected: false,
        id: uuidv4(),
        position: {
          x: node.position.x + offset.x,
          y: node.position.y + offset.y,
        },
        data: {
          ...node.data,
          node_info: node.data.node_info,
          data: node.data.data,
        },
      }));
      flowHistory.saveState();
      addNodes(newNodes);
    },
    [flowHistory.saveState, addNodes],
  );

  const handleDeleteNode = useCallback(
    (node: Node) => {
      deleteElements({ nodes: [node] });
    },
    [deleteElements, flowHistory.saveState],
  );

  const handleDeleteNodes = useCallback(
    (nodes: Node[]) => {
      deleteElements({ nodes });
    },
    [flowHistory.saveState, deleteElements],
  );

  const handleDeleteEdge = useCallback(
    (edge: Edge) => {
      deleteElements({ edges: [edge] });
    },
    [deleteElements, flowHistory.saveState],
  );

  const handleConnect = useCallback(
    (edge: Edge) => {
      flowHistory.saveState();
      addEdges(edge);
    },
    [addEdges, flowHistory.saveState],
  );

  return {
    handleAddNode,
    handleDuplicateNode,
    handleDuplicateNodes,
    handleDeleteNode,
    handleDeleteNodes,
    handleDeleteEdge,
    handleConnect,
    centerView,
    getSelectedNodeType,
    setSelectedNodeType,
  };
}
