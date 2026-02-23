import { useReactFlow, type Edge, type Node } from "@xyflow/react";
import { useCallback } from "react";
import { v4 as uuidv4 } from "uuid";
import { useFlowHistory } from "../flow-history/FlowHistoryContext";
import type { GraphNode, NodeTypeString } from "../models/NodeTypes.model";
import { bgColor as commentBgColor } from "../nodes/components/CommentNodeComponent";
import { bgColor as conditionBgColor } from "../nodes/components/ConditionalNodeComponent";
import { bgColor as eventBgColor } from "../nodes/components/EventNodeComponent";
import { bgColor as questionBgColor } from "../nodes/components/QuestionNodeComponent";
import { bgColor as statementBgColor } from "../nodes/components/StatementNodeComponent";
import { useCharacters } from "../characters/CharactersContext";
import type { addNodeProps, GraphActions } from "./GraphActions.model";
import { useGraphState } from "./graph-state/GraphStateContext";

function createGraphNode(
  type: NodeTypeString,
  id: string,
  position: { x: number; y: number } = { x: 0, y: 0 },
  defaultSpeaker: string = "",
  defaultMood: string = "",
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
          speaker: defaultSpeaker,
          mood: defaultMood,
          text: "Hello World!",
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
          speaker: defaultSpeaker,
          mood: defaultMood,
          text: "Hello World?",
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

function createNewEdge(
  source: Node,
  target: Node,
  sourceHandle?: string,
): Edge {
  const isQuestion = source.type === "question";
  return {
    id: uuidv4(),
    source: source.id,
    sourceHandle: sourceHandle ?? null,
    target: target.id,
    targetHandle: null,
    type: isQuestion ? "box" : "default",
    label: "",
    data: {},
  } as Edge;
}

export function useGraphActions(): GraphActions {
  const {
    getEdges,
    addNodes,
    addEdges,
    deleteElements,
    screenToFlowPosition,
    fitView,
  } = useReactFlow();
  const flowHistory = useFlowHistory();
  const { characters, favoriteId } = useCharacters();

  const favChar = characters.find((c) => c.id === favoriteId);
  const favoriteSpeaker = favChar?.name ?? "";
  const normalizeMood = (m: string) => m.toLowerCase().replace(/\s+/g, "_");
  const favoriteMood =
    favChar && favChar.moods[favChar.favoriteMoodIndex]
      ? normalizeMood(favChar.moods[favChar.favoriteMoodIndex])
      : "";

  const offset = { x: 120, y: 120 };

  const centerView = () => {
    fitView();
  };
  const { setSelectedNodeType } = useGraphState();

  const selectNodeType = (type: NodeTypeString) => setSelectedNodeType(type);

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
        data: createGraphNode(type || "statement", newId, pos, favoriteSpeaker, favoriteMood) as any,
      };
      flowHistory.saveState();
      addNodes(newNode);
      type && selectNodeType(type);
      return newNode ?? null;
    },
    [addNodes, selectNodeType, flowHistory.saveState, favoriteSpeaker, favoriteMood],
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

  const handleConnectNode = useCallback(
    (sourceNode: Node, targetNode: Node, sourceHandle?: string) => {
      const newEdge = createNewEdge(sourceNode, targetNode, sourceHandle);

      addEdges(newEdge);
    },
    [getEdges, createNewEdge, addEdges],
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

  return {
    handleAddNode,
    handleDuplicateNode,
    handleDuplicateNodes,
    handleConnectNode,
    handleDeleteNode,
    handleDeleteNodes,
    handleDeleteEdge,
    selectNodeType,
    centerView,
  };
}
