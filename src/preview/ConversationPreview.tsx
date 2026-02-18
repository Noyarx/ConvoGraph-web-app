import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { Edge, Node } from "@xyflow/react";
import { Close, Fullscreen, FullscreenExit } from "@mui/icons-material";
import { IconButton } from "@mui/material";
import { flowToGraphTree } from "../nodes/utils/xyflowAdapter";
import type { GraphNode } from "../models/NodeTypes.model";
import type { DialogueChoice } from "../models/DialogueChoice.model";

interface ConversationPreviewProps {
  nodes: Node[];
  edges: Edge[];
  startNodeId: string | null;
  fullscreen: boolean;
  onClose: () => void;
  onToggleFullscreen: () => void;
  onHighlightChange: (visited: Set<string>, current: string | null) => void;
}

type ChatEntry =
  | {
      type: "dialogue";
      nodeId: string;
      speaker: string;
      mood: string;
      text: string;
      color: string;
      nextNodeId: string;
    }
  | {
      type: "question";
      nodeId: string;
      speaker: string;
      mood: string;
      text: string;
      color: string;
      choices: DialogueChoice[];
      selectedIndex: number | null;
    }
  | {
      type: "condition";
      nodeId: string;
      varName: string;
      operator: string;
      value: string;
      nextTrue: string;
      nextFalse: string;
      selectedBranch: "true" | "false" | null;
    }
  | {
      type: "event";
      nodeId: string;
      eventName: string;
    };

function findRootNode(graphNodes: GraphNode[]): GraphNode | undefined {
  const referencedIds = new Set<string>();
  for (const node of graphNodes) {
    switch (node.type) {
      case "statement":
      case "event":
        if (node.next_node) referencedIds.add(node.next_node);
        break;
      case "question":
        node.choices.forEach((c) => referencedIds.add(c.next_node));
        break;
      case "condition":
        if (node.next_node_true) referencedIds.add(node.next_node_true);
        if (node.next_node_false) referencedIds.add(node.next_node_false);
        break;
    }
  }
  return graphNodes.find(
    (n) => n.type !== "comment" && !referencedIds.has(n.id),
  );
}

function checkHasNext(node: GraphNode, nodeMap: Map<string, GraphNode>): boolean {
  switch (node.type) {
    case "statement":
    case "event":
      return !!node.next_node && nodeMap.has(node.next_node);
    case "question":
      return node.choices.length > 0;
    case "condition":
      return (
        (!!node.next_node_true && nodeMap.has(node.next_node_true)) ||
        (!!node.next_node_false && nodeMap.has(node.next_node_false))
      );
    case "comment":
      return false;
  }
}

function nodeToEntry(node: GraphNode): ChatEntry | null {
  switch (node.type) {
    case "statement":
      return {
        type: "dialogue",
        nodeId: node.id,
        speaker: node.data.speaker,
        mood: node.data.mood,
        text: node.data.text,
        color: node.node_info.color,
        nextNodeId: node.next_node,
      };
    case "question":
      return {
        type: "question",
        nodeId: node.id,
        speaker: node.data.speaker,
        mood: node.data.mood,
        text: node.data.text,
        color: node.node_info.color,
        choices: [...node.choices].sort((a, b) => a.index - b.index),
        selectedIndex: null,
      };
    case "condition":
      return {
        type: "condition",
        nodeId: node.id,
        varName: node.data.var_name,
        operator: node.data.operator,
        value: String(node.data.value),
        nextTrue: node.next_node_true,
        nextFalse: node.next_node_false,
        selectedBranch: null,
      };
    case "event":
      return {
        type: "event",
        nodeId: node.id,
        eventName: node.data.event_name,
      };
    case "comment":
      return null;
  }
}

export default function ConversationPreview({
  nodes,
  edges,
  startNodeId,
  fullscreen,
  onClose,
  onToggleFullscreen,
  onHighlightChange,
}: ConversationPreviewProps) {
  const { nodeMap, startId } = useMemo(() => {
    const graphNodes = flowToGraphTree(nodes, edges);
    const map = new Map<string, GraphNode>(graphNodes.map((n) => [n.id, n]));

    let start = startNodeId;
    if (!start || !map.has(start)) {
      const root = findRootNode(graphNodes);
      start = root?.id ?? null;
    }
    if (start && map.get(start)?.type === "comment") {
      start = null;
    }
    return { nodeMap: map, startId: start };
  }, [nodes, edges, startNodeId]);

  const initialState = useMemo(() => {
    if (!startId) return { log: [] as ChatEntry[], done: true };
    const node = nodeMap.get(startId);
    if (!node || node.type === "comment") return { log: [] as ChatEntry[], done: true };
    const entry = nodeToEntry(node);
    if (!entry) return { log: [] as ChatEntry[], done: true };
    const done = !checkHasNext(node, nodeMap);
    return { log: [entry], done };
  }, [startId, nodeMap]);

  const [chatLog, setChatLog] = useState<ChatEntry[]>(initialState.log);
  const [finished, setFinished] = useState(initialState.done);
  const scrollRef = useRef<HTMLDivElement>(null);
  const eventTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Notify parent of highlight changes whenever chatLog changes
  useEffect(() => {
    const visited = new Set<string>();
    let current: string | null = null;
    for (let i = 0; i < chatLog.length; i++) {
      const entry = chatLog[i];
      if (i < chatLog.length - 1) {
        visited.add(entry.nodeId);
      } else {
        current = entry.nodeId;
      }
    }
    onHighlightChange(visited, current);
  }, [chatLog, onHighlightChange]);

  // Scroll to bottom when chat grows
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [chatLog, finished]);

  const pushNode = useCallback(
    (nodeId: string | null) => {
      if (!nodeId || !nodeMap.has(nodeId)) {
        setFinished(true);
        return;
      }
      const node = nodeMap.get(nodeId)!;
      if (node.type === "comment") {
        setFinished(true);
        return;
      }
      const entry = nodeToEntry(node);
      if (!entry) {
        setFinished(true);
        return;
      }
      setChatLog((prev) => [...prev, entry]);
      if (!checkHasNext(node, nodeMap)) {
        setFinished(true);
      }
    },
    [nodeMap],
  );

  // Auto-advance for event nodes
  useEffect(() => {
    const lastEntry = chatLog[chatLog.length - 1];
    if (lastEntry?.type === "event") {
      const node = nodeMap.get(lastEntry.nodeId);
      if (node?.type === "event") {
        eventTimerRef.current = setTimeout(() => {
          pushNode(node.next_node || null);
        }, 1000);
        return () => {
          if (eventTimerRef.current) clearTimeout(eventTimerRef.current);
        };
      }
    }
  }, [chatLog, nodeMap, pushNode]);

  const handleAdvanceDialogue = useCallback(
    (entry: ChatEntry & { type: "dialogue" }) => {
      pushNode(entry.nextNodeId || null);
    },
    [pushNode],
  );

  const handleSelectChoice = useCallback(
    (entryIndex: number, choiceIndex: number) => {
      setChatLog((prev) => {
        const updated = [...prev];
        const entry = updated[entryIndex];
        if (entry.type !== "question" || entry.selectedIndex !== null) return prev;
        updated[entryIndex] = { ...entry, selectedIndex: choiceIndex };
        return updated;
      });
      const entry = chatLog[entryIndex];
      if (entry.type === "question") {
        const choice = entry.choices.find((c) => c.index === choiceIndex);
        if (choice) {
          setTimeout(() => pushNode(choice.next_node || null), 200);
        }
      }
    },
    [chatLog, pushNode],
  );

  const handleRewind = useCallback(
    (entryIndex: number, choiceIndex: number) => {
      const entry = chatLog[entryIndex];
      if (entry.type !== "question") return;
      const choice = entry.choices.find((c) => c.index === choiceIndex);
      if (!choice) return;

      setChatLog((prev) => {
        const truncated = prev.slice(0, entryIndex + 1);
        truncated[entryIndex] = {
          ...truncated[entryIndex],
          selectedIndex: choiceIndex,
        } as ChatEntry & { type: "question" };
        return truncated;
      });
      setFinished(false);
      setTimeout(() => pushNode(choice.next_node || null), 200);
    },
    [chatLog, pushNode],
  );

  const handleSelectBranch = useCallback(
    (entryIndex: number, branch: "true" | "false") => {
      setChatLog((prev) => {
        const updated = [...prev];
        const entry = updated[entryIndex];
        if (entry.type !== "condition" || entry.selectedBranch !== null)
          return prev;
        updated[entryIndex] = { ...entry, selectedBranch: branch };
        return updated;
      });
      const entry = chatLog[entryIndex];
      if (entry.type === "condition") {
        const nextId =
          branch === "true" ? entry.nextTrue : entry.nextFalse;
        setTimeout(() => pushNode(nextId || null), 200);
      }
    },
    [chatLog, pushNode],
  );

  const handleRewindCondition = useCallback(
    (entryIndex: number, branch: "true" | "false") => {
      const entry = chatLog[entryIndex];
      if (entry.type !== "condition") return;
      const nextId = branch === "true" ? entry.nextTrue : entry.nextFalse;

      setChatLog((prev) => {
        const truncated = prev.slice(0, entryIndex + 1);
        truncated[entryIndex] = {
          ...truncated[entryIndex],
          selectedBranch: branch,
        } as ChatEntry & { type: "condition" };
        return truncated;
      });
      setFinished(false);
      setTimeout(() => pushNode(nextId || null), 200);
    },
    [chatLog, pushNode],
  );

  // Keyboard
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
        return;
      }
      if (e.key === "Enter") {
        const lastEntry = chatLog[chatLog.length - 1];
        if (!lastEntry) return;
        if (lastEntry.type === "dialogue") {
          handleAdvanceDialogue(lastEntry);
        }
        if (lastEntry.type === "event") {
          if (eventTimerRef.current) clearTimeout(eventTimerRef.current);
          const node = nodeMap.get(lastEntry.nodeId);
          if (node?.type === "event") pushNode(node.next_node || null);
        }
      }
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [chatLog, nodeMap, pushNode, handleAdvanceDialogue, onClose]);

  const isLastEntry = (i: number) => i === chatLog.length - 1;

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        backgroundColor: "#0f172a",
      }}
    >
      {/* Header bar */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "10px 14px",
          borderBottom: "1px solid #1e293b",
          flexShrink: 0,
        }}
      >
        <span style={{ color: "#94a3b8", fontSize: 13, fontWeight: 600 }}>
          Preview
        </span>
        <div style={{ display: "flex", gap: 2 }}>
          <IconButton onClick={onToggleFullscreen} style={{ color: "#94a3b8" }} size="small">
            {fullscreen ? <FullscreenExit fontSize="small" /> : <Fullscreen fontSize="small" />}
          </IconButton>
          <IconButton onClick={onClose} style={{ color: "#94a3b8" }} size="small">
            <Close fontSize="small" />
          </IconButton>
        </div>
      </div>

      {/* Chat area */}
      <div
        ref={scrollRef}
        style={{
          flex: 1,
          overflowY: "auto",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          padding: fullscreen ? "24px 16px" : "16px 10px",
          transition: "padding 0.3s ease",
        }}
      >
        <div style={{ width: "100%", maxWidth: 640, display: "flex", flexDirection: "column", gap: 10 }}>
          {chatLog.map((entry, i) => (
            <div
              key={`${entry.nodeId}-${i}`}
              style={{
                animation: "fadeSlideIn 0.25s ease-out",
              }}
            >
              {entry.type === "dialogue" && (
                <DialogueBubble
                  entry={entry}
                  isLast={isLastEntry(i) && !finished}
                  onContinue={() => handleAdvanceDialogue(entry)}
                />
              )}
              {entry.type === "question" && (
                <QuestionBubble
                  entry={entry}
                  isLast={isLastEntry(i) && !finished}
                  onSelectChoice={(choiceIdx) =>
                    handleSelectChoice(i, choiceIdx)
                  }
                  onRewind={(choiceIdx) => handleRewind(i, choiceIdx)}
                />
              )}
              {entry.type === "condition" && (
                <ConditionBubble
                  entry={entry}
                  onSelectBranch={(branch) => handleSelectBranch(i, branch)}
                  onRewind={(branch) => handleRewindCondition(i, branch)}
                />
              )}
              {entry.type === "event" && <EventBubble entry={entry} />}
            </div>
          ))}

          {finished && (
            <div
              style={{
                textAlign: "center",
                padding: "24px 0 12px",
                animation: "fadeSlideIn 0.25s ease-out",
              }}
            >
              <p style={{ fontSize: 14, color: "#64748b", marginBottom: 12 }}>
                End of conversation
              </p>
              <button
                onClick={onClose}
                style={{
                  padding: "6px 22px",
                  borderRadius: 8,
                  backgroundColor: "#334155",
                  color: "#f1f5f9",
                  border: "1px solid #475569",
                  cursor: "pointer",
                  fontSize: 13,
                  fontWeight: 600,
                }}
              >
                Close
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Keyboard hints */}
      <div
        style={{
          padding: "6px 14px",
          borderTop: "1px solid #1e293b",
          textAlign: "center",
          flexShrink: 0,
        }}
      >
        <span style={{ fontSize: 11, color: "#475569" }}>
          <strong>Enter</strong> continue · <strong>Esc</strong> close
        </span>
      </div>

      <style>{`
        @keyframes fadeSlideIn {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}

/* ── Sub-components ── */

function DialogueBubble({
  entry,
  isLast,
  onContinue,
}: {
  entry: ChatEntry & { type: "dialogue" };
  isLast: boolean;
  onContinue: () => void;
}) {
  return (
    <div
      style={{
        backgroundColor: "#1e293b",
        border: "1px solid #334155",
        borderRadius: 10,
        padding: "10px 14px",
        display: "flex",
        flexDirection: "column",
        gap: 6,
      }}
    >
      <SpeakerHeader speaker={entry.speaker} mood={entry.mood} color={entry.color} />
      <p style={{ fontSize: 13, color: "#e2e8f0", lineHeight: 1.6, margin: 0 }}>
        {entry.text}
      </p>
      {isLast && (
        <button
          onClick={onContinue}
          style={{
            alignSelf: "flex-end",
            padding: "5px 14px",
            borderRadius: 6,
            backgroundColor: "#334155",
            color: "#cbd5e1",
            border: "1px solid #475569",
            cursor: "pointer",
            fontSize: 12,
            fontWeight: 600,
            marginTop: 2,
          }}
        >
          Continue ↵
        </button>
      )}
    </div>
  );
}

function QuestionBubble({
  entry,
  isLast,
  onSelectChoice,
  onRewind,
}: {
  entry: ChatEntry & { type: "question" };
  isLast: boolean;
  onSelectChoice: (choiceIndex: number) => void;
  onRewind: (choiceIndex: number) => void;
}) {
  const answered = entry.selectedIndex !== null;

  return (
    <div
      style={{
        backgroundColor: "#1e293b",
        border: "1px solid #334155",
        borderRadius: 10,
        padding: "10px 14px",
        display: "flex",
        flexDirection: "column",
        gap: 6,
      }}
    >
      <SpeakerHeader speaker={entry.speaker} mood={entry.mood} color={entry.color} />
      <p style={{ fontSize: 13, color: "#e2e8f0", lineHeight: 1.6, margin: 0 }}>
        {entry.text}
      </p>
      <div style={{ display: "flex", flexDirection: "column", gap: 5, marginTop: 4 }}>
        {entry.choices.map((choice) => {
          const isSelected = entry.selectedIndex === choice.index;
          const isUnselectedAfterAnswer = answered && !isSelected;
          const borderColor =
            choice.color && choice.color !== "#F5F5F5"
              ? choice.color
              : "#475569";

          let opacity = 1;
          let bg = "rgba(255,255,255,0.04)";
          let cursor: string = "pointer";
          let borderStyle: string = "solid";

          if (answered) {
            if (isSelected) {
              opacity = 1;
              bg = "rgba(255,255,255,0.1)";
              cursor = "default";
            } else {
              opacity = 0.5;
              borderStyle = "dashed";
              cursor = "pointer";
            }
          }

          const handleClick = () => {
            if (!answered && isLast) {
              onSelectChoice(choice.index);
            } else if (isUnselectedAfterAnswer) {
              onRewind(choice.index);
            }
          };

          return (
            <div
              key={choice.index}
              onClick={handleClick}
              style={{
                padding: "7px 12px",
                borderRadius: 7,
                border: `1px ${borderStyle} ${borderColor}`,
                borderWidth: isSelected ? 2 : 1,
                backgroundColor: bg,
                color: "#e2e8f0",
                cursor,
                fontSize: 13,
                opacity,
                transition: "opacity 0.2s, background-color 0.15s, border-width 0.15s",
              }}
              onMouseEnter={(e) => {
                if ((!answered && isLast) || isUnselectedAfterAnswer) {
                  e.currentTarget.style.backgroundColor = isUnselectedAfterAnswer
                    ? "rgba(255,255,255,0.08)"
                    : "rgba(255,255,255,0.1)";
                  if (isUnselectedAfterAnswer) {
                    e.currentTarget.style.opacity = "0.75";
                  }
                }
              }}
              onMouseLeave={(e) => {
                if ((!answered && isLast) || isUnselectedAfterAnswer) {
                  e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.04)";
                  if (isUnselectedAfterAnswer) {
                    e.currentTarget.style.opacity = "0.5";
                  }
                }
              }}
            >
              {choice.text || `Choice ${choice.index + 1}`}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function ConditionBubble({
  entry,
  onSelectBranch,
  onRewind,
}: {
  entry: ChatEntry & { type: "condition" };
  onSelectBranch: (branch: "true" | "false") => void;
  onRewind: (branch: "true" | "false") => void;
}) {
  const answered = entry.selectedBranch !== null;

  const renderBranchButton = (branch: "true" | "false") => {
    const isTrue = branch === "true";
    const isSelected = entry.selectedBranch === branch;
    const isUnselectedAfterAnswer = answered && !isSelected;

    const baseColor = isTrue ? "34,197,94" : "239,68,68";
    const textColor = isTrue ? "#4ade80" : "#f87171";

    let bg: string;
    let borderStyle = "solid";
    let borderOpacity: string;
    let cursor: string;
    let opacity: number;

    if (!answered) {
      bg = `rgba(${baseColor},0.1)`;
      borderOpacity = "0.25";
      cursor = "pointer";
      opacity = 1;
    } else if (isSelected) {
      bg = `rgba(${baseColor},0.25)`;
      borderOpacity = "0.5";
      cursor = "default";
      opacity = 1;
    } else {
      bg = `rgba(${baseColor},0.1)`;
      borderOpacity = "0.25";
      borderStyle = "dashed";
      cursor = "pointer";
      opacity = 0.5;
    }

    const handleClick = () => {
      if (!answered) {
        onSelectBranch(branch);
      } else if (isUnselectedAfterAnswer) {
        onRewind(branch);
      }
    };

    return (
      <button
        key={branch}
        onClick={handleClick}
        style={{
          padding: "6px 20px",
          borderRadius: 7,
          backgroundColor: bg,
          color: textColor,
          border: `1px ${borderStyle} rgba(${baseColor},${borderOpacity})`,
          borderWidth: isSelected ? 2 : 1,
          cursor,
          fontSize: 13,
          fontWeight: 600,
          opacity,
          transition: "opacity 0.2s, background-color 0.15s, border-width 0.15s",
        }}
        onMouseEnter={(e) => {
          if (!answered || isUnselectedAfterAnswer) {
            e.currentTarget.style.backgroundColor = isUnselectedAfterAnswer
              ? `rgba(${baseColor},0.18)`
              : `rgba(${baseColor},0.2)`;
            if (isUnselectedAfterAnswer) {
              e.currentTarget.style.opacity = "0.75";
            }
          }
        }}
        onMouseLeave={(e) => {
          if (!answered || isUnselectedAfterAnswer) {
            e.currentTarget.style.backgroundColor = `rgba(${baseColor},0.1)`;
            if (isUnselectedAfterAnswer) {
              e.currentTarget.style.opacity = "0.5";
            }
          }
        }}
      >
        {isTrue ? "True" : "False"}
      </button>
    );
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 8,
        padding: "12px 0",
      }}
    >
      <span
        style={{
          fontSize: 10,
          color: "#64748b",
          textTransform: "uppercase",
          letterSpacing: 1.5,
          fontWeight: 600,
        }}
      >
        Condition
      </span>
      <div
        style={{
          display: "flex",
          gap: 6,
          alignItems: "center",
          padding: "5px 12px",
          borderRadius: 7,
          backgroundColor: "rgba(252,123,219,0.12)",
          border: "1px solid rgba(252,123,219,0.25)",
          fontSize: 12,
        }}
      >
        <span style={{ color: "#e2e8f0", fontWeight: 600 }}>{entry.varName}</span>
        <span style={{ color: "#94a3b8" }}>{entry.operator}</span>
        <span style={{ color: "#e2e8f0", fontWeight: 600 }}>{entry.value}</span>
      </div>
      <div style={{ display: "flex", gap: 10 }}>
        {renderBranchButton("true")}
        {renderBranchButton("false")}
      </div>
    </div>
  );
}

function EventBubble({
  entry,
}: {
  entry: ChatEntry & { type: "event" };
}) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        padding: "6px 0",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 6,
          padding: "4px 12px",
          borderRadius: 16,
          backgroundColor: "rgba(255,165,0,0.1)",
          border: "1px solid rgba(255,165,0,0.2)",
          fontSize: 12,
          color: "#FFA500",
          fontWeight: 500,
        }}
      >
        <span style={{ fontSize: 9, textTransform: "uppercase", letterSpacing: 1, color: "#94a3b8" }}>
          Event
        </span>
        {entry.eventName}
      </div>
    </div>
  );
}

function SpeakerHeader({
  speaker,
  mood,
  color,
}: {
  speaker: string;
  mood: string;
  color: string;
}) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <span style={{ fontSize: 13, fontWeight: 700, color }}>{speaker}</span>
      {mood && (
        <span
          style={{
            fontSize: 10,
            padding: "1px 6px",
            borderRadius: 8,
            backgroundColor: "rgba(255,255,255,0.08)",
            color: "#94a3b8",
          }}
        >
          {mood}
        </span>
      )}
    </div>
  );
}
