export default function exportTreeToJSON(graphNodes: any[]) {
  // convert node list to json format
  const jsonString = JSON.stringify(graphNodes, null, 2);
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
