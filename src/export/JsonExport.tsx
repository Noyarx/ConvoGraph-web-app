export function exportTimelineToJSON(graphNodes: any[]) {
  // Create timeline object adding info
  const timelineObj = {
    info: {
      name: "",
      node_count: graphNodes.length,
      last_modified: new Date().toLocaleString(),
      made_with: "ConvoGraph © 2025",
    },
    nodes: graphNodes,
  };
  const jsonString = JSON.stringify(timelineObj, null, 2);
  const blob = new Blob([jsonString], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  // create link element
  const link = document.createElement("a");
  link.href = url;
  link.download = "timeline.json";
  document.body.appendChild(link);
  link.click();

  // clean up link
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
