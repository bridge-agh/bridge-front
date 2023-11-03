"use client";

import cc from "classcat";
import { useState } from "react";
import useChatWithBridget from "./useChatWithBridget";
import { ChatHeader } from "./ChatHeader";
import { ChatBody } from "./ChatBody";

export default function ChatWithBridget() {
  const [isOpened, setIsOpened] = useState(false);
  const { messages } = useChatWithBridget();

  return (
    <div
      className={cc([
        "absolute",
        "bottom-0",
        "right-0",
        "transition-all",
      ])}
    >
      <div className="cursor-pointer" onClick={() => setIsOpened(!isOpened)}>
        <ChatHeader />
      </div>
      <div
        className={cc([
          "transition-all",
          isOpened ? "h-96 w-96" : "h-0 w-0",
        ])}
      >
        <ChatBody messages={messages} />
      </div>
    </div>
  );
}
