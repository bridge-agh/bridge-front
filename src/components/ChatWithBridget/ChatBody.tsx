import cc from "classcat";
import { ChatEntry } from "./ChatEntry";
import { Message } from "./useChatWithBridget";
import { ChatInput } from "./ChatInput";

export const ChatBody = ({ messages }: { messages: Message[] }) => (
  <div
    className={cc([
      "flex",
      "flex-col",
      "h-full",
      "bg-white",
      "text-gray-700",
    ])}
  >
    <div className="overflow-y-auto p-2">
      {messages.map((message) => (
        <ChatEntry
          key={message.id}
          message={message} />
      ))}
    </div>
    <ChatInput />
  </div>
);
