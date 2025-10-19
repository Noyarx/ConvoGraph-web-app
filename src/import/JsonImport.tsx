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
        resolve(jsonData);
      } catch (err) {
        console.error("Error importing JSON: ", err);
        alert("Selected file is not a valid JSON file!");
        resolve(null);
      }
    };

    input.click();
  });
  return response;
}
