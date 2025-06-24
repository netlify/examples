import "./style.css";

function handleSubmit(form: HTMLFormElement) {
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const formData = new FormData(form);
    const apiKey = formData.get("apiKey") as string;
    sessionStorage.setItem("openai-api-key", apiKey);
    const query = formData.get("query") as string;

    const submitButton = document.querySelector<HTMLButtonElement>("#submit")!;
    submitButton.textContent = "Loading...";
    submitButton.disabled = true;

    let data;
    try {
      const response = await fetch("/.netlify/functions/query", {
        method: "POST",
        body: JSON.stringify({ apiKey, query }),
      });
      data = await response.json();
    } catch (e) {
      data = { answer: "Oops. There was problem." };
    }
    const queryResults =
      document.querySelector<HTMLDivElement>("#queryResults")!;
    queryResults.innerHTML = data.answer;

    submitButton.textContent = "Submit";
    submitButton.disabled = false;
    const queryInput = form.querySelector<HTMLInputElement>("#query")!;
    queryInput.value = "";
  });
}

document.querySelector<HTMLDivElement>("#app")!.innerHTML = `
  <div class="w-screen h-screen flex items-center justify-center bg-gray-50 p-4">
    <div class="w-full max-w-md bg-white rounded-lg shadow-md p-6">
      <h1 class="text-2xl font-bold mb-4 text-center">San Francisco Travel Guide</h1>
      <form id="queryForm" class="flex flex-col gap-4">
        <!-- New API-Key field -->
        <input
          type="password"
          id="apiKey"
          name="apiKey"
          placeholder="Your OpenAI API Key"
          class="w-full p-2 border border-gray-300 rounded-md"
          required
          value="${sessionStorage.getItem("openai-api-key") || ""}"
        />
        <div class="text-xs text-gray-500 mb-2 -mt-2 text-right">
          Generate an API key <a href="https://platform.openai.com/api-keys" target="_blank" class="text-blue-500 hover:underline">here</a>.
        </div>
        <input type="text" id="query" name="query" placeholder="Ask me anything..." class="w-full p-2 border border-gray-300 rounded-md mb-4" required>
        <button id="submit" class="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed">Submit</button>
        <div id="queryResults" class="mt-4"></div>
      </form>
    </div>
  </div>
`;

handleSubmit(document.querySelector<HTMLFormElement>("#queryForm")!);
