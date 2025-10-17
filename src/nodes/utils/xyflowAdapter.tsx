import { StepEdge, type Edge, type Node } from "@xyflow/react";
import type { DialogueChoice } from "../../models/DialogueChoice.model";
import type { GraphNode } from "../../models/NodeTypes.model";

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
        type: { step: StepEdge } as any,
        source: node.id,
        target: e.next_node,
        label: e.text,
        data: e as any,
      }));
    case "condition":
      return [
        {
          id: node.type + "-" + node.id + "-" + node.next_node_true,
          source: node.id,
          sourceHandle: "left",
          target: node.next_node_true,
          data: { source: "next_node_true" },
        },
        {
          id: node.type + "-" + node.id + "-" + node.next_node_false,
          source: node.id,
          sourceHandle: "right",
          target: node.next_node_false,
          data: { source: "next_node_false" },
        },
      ];
    case "comment":
      return [
        {
          id: "",
          source: "",
          target: "",
        },
      ];
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
  let graphNode: GraphNode = node.data as any as GraphNode;
  graphNode.id = node.id;
  graphNode.node_info.position = node.position;
  return graphNode;
}

export function flowToGraphNodes(nodes: Node[]): GraphNode[] {
  return nodes.map(flowToGraphNode);
}

// Function to remap ReactFlow nodes and edges into GraphNodes
export function flowToGraphEdges(nodes: Node[], edges: Edge[]): GraphNode[] {
  let graphNodes: GraphNode[] = nodes.map((e) => e.data as any as GraphNode);

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
  edges.forEach((el) => {
    const sourceNode = graphMap[el.source];

    switch (sourceNode.type) {
      case "statement":
      case "event":
        sourceNode.next_node = el.target;
        break;
      case "condition":
        if (el.sourceHandle === "left") {
          sourceNode.next_node_true = el.target;
        } else if (el.sourceHandle === "right") {
          sourceNode.next_node_false = el.target;
        }
        break;
      case "question":
        const choice = el.data as any as DialogueChoice;
        choice.next_node = el.target;
        sourceNode.choices.push(choice);
        break;
    }
  });
  return graphNodes;
}

//#endregion
