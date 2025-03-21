import { useState, useRef, useEffect } from "react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [hasContext, setHasContext] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  function scrollToBottom() {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    setInput(e.target.value);
  }

  async function startNewConversation() {
    try {
      await fetch("/.netlify/functions/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ newConversation: true }),
      });
      setMessages([]);
      setHasContext(false);
    } catch (error) {
      console.error("Error starting new conversation:", error);
    }
  }

  async function processStreamedResponse(reader: ReadableStreamDefaultReader<Uint8Array>) {
    let assistantMessage = "";
    setMessages((prev) => [...prev, { role: "assistant", content: "" }]);

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const text = new TextDecoder().decode(value);
      assistantMessage += text;
      setMessages((prev) => [
        ...prev.slice(0, -1),
        { role: "assistant", content: assistantMessage },
      ]);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = { role: "user" as const, content: input.trim() };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/.netlify/functions/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMessage.content }),
      });

      if (!response.ok) throw new Error("Network response was not ok");

      const reader = response.body?.getReader();
      if (!reader) throw new Error("No reader available");

      await processStreamedResponse(reader);
      setHasContext(true);
    } catch (error) {
      console.error("Error:", error);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Sorry, there was an error processing your request.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  }

  function renderMessage(message: Message, index: number) {
    return (
      <div
        key={index}
        className={`mb-4 p-3 rounded-lg max-w-[80%] ${
          message.role === "user"
            ? "ml-auto bg-blue-600 text-white"
            : "mr-auto bg-gray-100 text-gray-800"
        }`}>
        <strong>{message.role === "user" ? "You: " : "AI: "}</strong>
        <span>{message.content}</span>
      </div>
    );
  }

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (!isLoading) {
      inputRef.current?.focus();
    }
  }, [isLoading]);

  return (
    <div className="flex flex-col h-[600px] border border-gray-200 rounded-lg bg-white">
      <div className="flex justify-between items-center p-4 border-b border-gray-200">
        <span className="text-sm text-gray-500">
          {hasContext ? "Conversation context: On" : "New conversation"}
        </span>
        <button
          onClick={startNewConversation}
          className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800 border border-gray-300 rounded"
          disabled={isLoading}>
          New Conversation
        </button>
      </div>
      <div className="flex-1 overflow-y-auto p-4">
        {messages.map(renderMessage)}
        <div ref={messagesEndRef} />
      </div>
      <form onSubmit={handleSubmit} className="flex p-4 border-t border-gray-200 gap-2">
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={handleInputChange}
          placeholder="Type your message..."
          className="flex-1 p-2 border border-gray-200 rounded text-base disabled:bg-gray-50 disabled:cursor-not-allowed"
          disabled={isLoading}
        />
        <button
          type="submit"
          disabled={isLoading}
          className="px-4 py-2 bg-blue-600 text-white rounded cursor-pointer text-base disabled:bg-blue-400 disabled:cursor-not-allowed">
          {isLoading ? "Sending..." : "Send"}
        </button>
      </form>
    </div>
  );
}