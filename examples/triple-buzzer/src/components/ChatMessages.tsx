import { useEffect, useRef } from "react";
import { SingleMessage } from "./SingleMessage";
import type { Message as MessageType } from "../types";

export function ChatMessages({ messages }: { messages: MessageType[] }) {
  const messagesFooterRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesFooterRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex grow flex-col gap-4 overflow-y-auto">
      {messages.length === 0 ? (
        <EmptyState />
      ) : (
        messages.map((message, index) => (
          <SingleMessage key={index} message={message} />
        ))
      )}
      {/* Anchor for always scrolling to end */}
      <div ref={messagesFooterRef} />
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col grow justify-center items-center gap-4">
      <div className="text-center flex flex-col gap-2">
        <span className="text-xl lg:text-2xl font-semibold">
          Welcome to Triple Buzzer!
        </span>
        <span className="text-lg lg:text-xl">
          Give me an answer and I'll respond with the correct question.
        </span>
      </div>
    </div>
  );
}
