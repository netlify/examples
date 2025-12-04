import { ProviderLabels, type Message } from "../types";

export function SingleMessage({ message }: { message: Message }) {
  const isProviderMessage = message.type === "assistant";

  const lineStyles =
    "chat text-base-content " + (isProviderMessage ? "chat-start" : "chat-end");
  const providerNameStyles = isProviderMessage
    ? "py-2 px-3 mr-2 rounded-xl font-semibold text-lg gradient-" +
      message.provider
    : "";
  const bubbleStyles =
    "chat-bubble rounded-xl text-[16px] " +
    (isProviderMessage ? "chat-bubble-warning rounded-bl-none" : "chat-bubble-info rounded-br-none");

  return (
    <div className={lineStyles}>
      {isProviderMessage && (
        <div className="chat-image">
          <span className={providerNameStyles}>
            {ProviderLabels[message.provider]}
          </span>
        </div>
      )}
      <div className={bubbleStyles}>{message.content}</div>
      {isProviderMessage && message.responseTime && (
        <div className="chat-footer text-[14px]">
          <time className="">{message.responseTime}ms</time>
        </div>
      )}
    </div>
  );
}
