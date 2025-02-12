import { useState, useRef, useEffect } from "react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
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
  };

  return (
    <div className="chat-container" style={styles.container}>
      <div className="messages" style={styles.messages}>
        {messages.map((message, index) => (
          <div
            key={index}
            style={{
              ...styles.message,
              ...(message.role === "user"
                ? styles.userMessage
                : styles.assistantMessage),
            }}>
            <strong>{message.role === "user" ? "You: " : "AI: "}</strong>
            <span>{message.content}</span>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <form onSubmit={handleSubmit} style={styles.form}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
          style={styles.input}
          disabled={isLoading}
        />
        <button type="submit" disabled={isLoading} style={styles.button}>
          {isLoading ? "Sending..." : "Send"}
        </button>
      </form>
    </div>
  );
}

const styles = {
  container: {
    display: "flex",
    flexDirection: "column" as const,
    height: "600px",
    border: "1px solid #ddd",
    borderRadius: "8px",
    background: "#fff",
  },
  messages: {
    flex: 1,
    overflowY: "auto" as const,
    padding: "1rem",
  },
  message: {
    marginBottom: "1rem",
    padding: "0.8rem",
    borderRadius: "8px",
    maxWidth: "80%",
  },
  userMessage: {
    marginLeft: "auto",
    background: "#007bff",
    color: "#fff",
  },
  assistantMessage: {
    marginRight: "auto",
    background: "#f1f1f1",
    color: "#333",
  },
  form: {
    display: "flex",
    padding: "1rem",
    borderTop: "1px solid #ddd",
    gap: "0.5rem",
  },
  input: {
    flex: 1,
    padding: "0.5rem",
    border: "1px solid #ddd",
    borderRadius: "4px",
    fontSize: "1rem",
  },
  button: {
    padding: "0.5rem 1rem",
    background: "#007bff",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "1rem",
  },
};
