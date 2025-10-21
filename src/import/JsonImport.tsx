export async function importTimelineFromJSON(): Promise<any | null> {
  // Create file input element
  const input = document.createElement("input");
  input.type = "file";
  input.accept = ".json";
  // Create promise that returns timeline or null
  const response = new Promise((resolve) => {
    input.onchange = async (event: any) => {
      const file = event.target.files?.[0];
      if (!file) {
        resolve(null);
        return;
      }

      try {
        const text = await file.text();
        const jsonData = JSON.parse(text);
        // Abort if JSON structure doesn't contain info and nodes
        if (
          typeof jsonData !== "object" ||
          jsonData === null ||
          Array.isArray(jsonData)
        ) {
          alert(
            "❌ JSON file must contain an object with 'info' and 'nodes' properties!"
          );
          resolve(null);
          return;
        }

        // --- INFO VALIDATION ---
        let info = jsonData.info;
        const nodes = jsonData.nodes;
        if (!info || typeof info !== "object") {
          console.warn(
            "ℹ️ No 'info' object found in JSON. Creating default metadata."
          );
          info = {
            name: "",
            node_count: Array.isArray(nodes) ? nodes.length : 0,
            last_modified: new Date().toLocaleString(),
            made_with: "ConvoGraph © 2025",
          };
        }

        // Alert when there's no timeline name set
        if (!info.name || info.name.trim() === "") {
          alert("⚠️ Warning: this timeline has no name set.");
        }

        // --- NODES VALIDATION ---

        // Abort if there is no 'nodes' array
        if (!nodes || !Array.isArray(nodes)) {
          alert("❌ JSON file must contain a 'nodes' array!");
          resolve(null);
          return;
        }

        // Filter nodes with a valid structure
        const validNodes = nodes.filter((node, index) => {
          if (
            typeof node !== "object" ||
            !node.id ||
            !node.type ||
            !node.node_info
          ) {
            console.warn(`Invalid node at index ${index}:`, node);
            return false;
          }
          // Set default position to nodes which have no position set
          if (!node.node_info.position) {
            console.warn(
              `Node at index ${index} has no position.\nSetting default position.`
            );
            node.node_info.position = { x: 0, y: 0 };
          }
          return true;
        });
        // Abort if there is no valid nodes
        if (validNodes.length < 1) {
          alert("⚠️  No valid nodes found in JSON file.");
          resolve(null);
          return;
        }
        // Set valid nodes list as response content
        resolve({ info, nodes: validNodes });
      } catch (err) {
        console.error("❌ Error parsing JSON: ", err);
        alert("⚠️ Selected file is not a valid JSON file!");
        resolve(null);
      }
    };
  });
  input.click();
  return response;
}
