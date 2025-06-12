import "./style.css";

function handleSubmit(form: HTMLFormElement) {
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const formData = new FormData(form);
    const query = formData.get("query");

    const submitButton = document.querySelector<HTMLButtonElement>("#submit")!;
    submitButton.textContent = "Loading...";
    submitButton.disabled = true;

    const response = await fetch("/.netlify/functions/query", {
      method: "POST",
      body: JSON.stringify({ query }),
    });
    const data = await response.json();
    const queryResults =
      document.querySelector<HTMLDivElement>("#queryResults")!;
    queryResults.innerHTML = data.answer;

    submitButton.textContent = "Submit";
    submitButton.disabled = false;
    form.reset();
  });
}

document.querySelector<HTMLDivElement>("#app")!.innerHTML = `
  <div class="w-screen h-screen flex items-center justify-center bg-gray-50 p-4">
    <div class="w-full max-w-md bg-white rounded-lg shadow-md p-6">
      <h1 class="text-2xl font-bold mb-4 text-center">San Francisco Travel Guide</h1>
      <form id="queryForm" class="flex flex-col gap-4">
        <input type="text" id="query" name="query" placeholder="Ask me anything..." class="w-full p-2 border border-gray-300 rounded-md mb-4">
        <button id="submit" class="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed">Submit</button>
        <div id="queryResults" class="mt-4"></div>
      </form>
    </div>
  </div>
`;

handleSubmit(document.querySelector<HTMLFormElement>("#queryForm")!);
