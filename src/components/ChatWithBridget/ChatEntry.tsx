import cc from "classcat";
import { BsPersonCircle } from "react-icons/bs";
import { BridgetIcon } from "./BridgetIcon";
import { Message } from "./useChatWithBridget";

export const ChatEntry = ({ message }: { message: Message }) => (
  <div className="flex flex-col mb-4">
    <div
      className={cc([
        "flex",
        "flex-row",
        "items-center",
        message.role === "assistant" ? "justify-start" : "justify-end",
      ])}
    >
      {message.role === "assistant" ? <>
        <BridgetIcon size={12} rounded={true} />
        <div className="ms-2 font-bold">Bridget</div>
      </> : <>
        <div className="me-2 font-bold">You</div>
        <BsPersonCircle className="w-12 h-12 fill-pink-400" />
      </>}
    </div>
    <div
      className={cc([
        "bg-gray-200",
        "rounded-lg",
        "p-2",
        "mt-1",
        message.role === "assistant" ? "me-14" : "ms-14",
      ])}
    >
      {message.content} {message.isTyping && <span className="animate-pulse">...</span>}
    </div>
  </div>
);
