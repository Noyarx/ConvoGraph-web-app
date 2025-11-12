import { StepEdge, type Edge, type Node } from "@xyflow/react";
import type { DialogueChoice } from "../../models/DialogueChoice.model";
import type { GraphNode } from "../../models/NodeTypes.model";
import type { TextModifier } from "../../models/TextModifiers.model";

//#region GraphNode-ReactFlow

// Returns a ReactFlow node mapped from a GraphNode and puts the whole GraphNode in the data property
export function toXYFlowNode(node: GraphNode): Node {
  return {
    id: node.id,
    type: node.type,
    position: node.node_info.position,
    data: node as any,
  };
}

// Returns a list of ReactFlow nodes mapped from a list of GraphNodes
export function toXYFlowNodes(nodes: GraphNode[]): Node[] {
  return nodes.map(toXYFlowNode);
}

// Returns a ReactFlow edge based on a GraphNode's id and 'next_node' value
export function toXYFlowEdge(node: GraphNode): Edge[] {
  switch (node.type) {
    case "statement":
    case "event":
      return [
        {
          id: node.type + "-" + node.id + "-" + node.next_node,
          source: node.id,
          target: node.next_node,
        },
      ];
    case "question":
      return node.choices.map((e) => ({
        id: node.id + "-" + e.next_node,
        type: node.type === "question" ? "box" : "default",
        source: node.id,
        target: e.next_node,
        label: e.text,
        data: e as any,
      }));
    case "condition":
      return [
        {
          id: node.type + "-" + node.id + "-" + node.next_node_false,
          source: node.id,
          sourceHandle: "left",
          target: node.next_node_false,
          data: { source: "next_node_false" },
        },
        {
          id: node.type + "-" + node.id + "-" + node.next_node_true,
          source: node.id,
          sourceHandle: "right",
          target: node.next_node_true,
          data: { source: "next_node_true" },
        },
      ];
    case "comment":
      return [];
  }
}

// Returns a list of ReactFlow edges mapped from a list of GraphNodes
export function toXYFlowEdges(nodes: GraphNode[]): Edge[] {
  //use flatMap to return in a single array all the items from a matrix
  return nodes.flatMap(toXYFlowEdge);
}

//#endregion

//#region ReactFlow-GraphNode

export function flowToGraphNode(node: Node): GraphNode {
  const graphNode: GraphNode = {
    ...node.data,
    id: node.id,
    node_info: {
      ...(node.data.node_info as Record<string, any>),
      position: node.position,
    },
    data: node.data.data,
  } as GraphNode;
  return graphNode;
}

export function flowToGraphNodes(nodes: Node[]): GraphNode[] {
  return nodes.map(flowToGraphNode);
}

// Function to remap ReactFlow nodes and edges into GraphNodes
export function flowToGraphTree(nodes: Node[], edges: Edge[]): GraphNode[] {
  let graphNodes: GraphNode[] = flowToGraphNodes(nodes);

  // Reset next_node value for every type of GraphNode
  graphNodes = graphNodes.map((e) => {
    switch (e.type) {
      case "event":
      case "statement":
        return { ...e, next_node: "" };
      case "question":
        return { ...e, choices: [] };
      case "condition":
        return { ...e, next_node_true: "", next_node_false: "" };
      default:
        return e;
    }
  });

  // Create a key:value map where key is the node's id and value is the whole GraphNode
  const graphMap: Record<string, GraphNode> = graphNodes.reduce(
    (acc, curr) => ({ ...acc, [curr.id]: curr }),
    {}
  );

  /*
    For each edge set find the corresponding source node in the graphMap,
    then set that node's 'next_node' value(s) to the edge's target value.
  */
  // Create map  {nodeId : [usedIndexes]}
  const usedIndexesBySource = new Map<string, Set<number>>();

  edges.forEach((el) => {
    const sourceNode = graphMap[el.source];

    switch (sourceNode.type) {
      case "statement":
      case "event":
        sourceNode.next_node = el.target;
        break;
      case "condition":
        if (el.sourceHandle === "left") {
          sourceNode.next_node_false = el.target;
        } else if (el.sourceHandle === "right") {
          sourceNode.next_node_true = el.target;
        }
        break;
      case "question":
        // Retrieve from the map the indexes used by this node's edges
        let usedIndexes = usedIndexesBySource.get(sourceNode.id);
        if (!usedIndexes) {
          // Find and store all indexes used by edges coming from the same source node
          usedIndexes = new Set<number>();
          usedIndexesBySource.set(el.source, usedIndexes);
        }
        // If index is not set, assign the smallest free index
        // otherwise set it as the one manually set
        let index: number;
        const newIndex = el?.data?.index;
        if (Number.isFinite(newIndex) && !usedIndexes.has(newIndex as number)) {
          index = newIndex as number;
        } else {
          index = 0;
          while (usedIndexes.has(index)) index++;
        }
        // Save index as used
        usedIndexes.add(index);

        const choice: DialogueChoice = {
          next_node: el.target,
          text: el.label ? el.label + "" : "",
          text_modifier: (el?.data?.text_modifier as TextModifier[]) || [],
          color: el?.data?.color ? el.data.color + "" : "",
          index,
        };
        sourceNode.choices.push(choice);
        break;
    }
  });
  // Compact choice indexes by shifting them down if there are "holes" between them
  Object.values(graphMap).forEach((node) => {
    if (node.type === "question" && node.choices?.length) {
      node.choices
        .sort((a, b) => a.index - b.index)
        .forEach((choice, i) => {
          choice.index = i;
        });
    }
  });
  return graphNodes;
}

//#endregion
