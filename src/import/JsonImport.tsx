export async function importTreeFromJSON(): Promise<any | null> {
  // create file input element
  const input = document.createElement("input");
  input.type = "file";
  input.accept = ".json";
  // create promise that returns nodelist or null
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
        if (!Array.isArray(jsonData)) {
          alert("JSON filemust contain a list of valid nodes!");
          return;
        }

        // Filter nodes with a valid structure
        const validNodes = jsonData.filter((node, index) => {
          if (
            typeof node !== "object" ||
            !node.id ||
            !node.type ||
            !node.node_info
          ) {
            console.warn(`Invalid node at index ${index}:`, node);
            return false;
          }
          // set default position to nodes which have no position set
          if (!node.node_info.position) {
            console.warn(
              `Node at index ${index} has no position.\nSetting default position.`
            );
            node.node_info.position = { x: 0, y: 0 };
          }
          return true;
        });
        if (validNodes.length < 1) {
          alert("No valid nodes found in JSON file.");
          resolve(null);
          return;
        }
        // set valid nodes list as response content
        resolve(validNodes);
      } catch (err) {
        console.error("Error parsing JSON: ", err);
        window.alert("Selected file is not a valid JSON file!");
        resolve(null);
      }
    };
  });
  input.click();
  return response;
}
