export interface Message {
  id: string;
  role: "assistant" | "user";
  content: string;
  isTyping: boolean;
}

export interface BridgetHook {
  messages: Message[];
}

export default function useChatWithBridget() {
  const messages: Message[] = [
    {
      id: "1",
      role: "assistant",
      content: "Hello, I'm Bridget. How can I help you today?",
      isTyping: false,
    },
    {
      id: "2",
      role: "user",
      content: "Can I double my partner's bid?",
      isTyping: false,
    },
    {
      id: "3",
      role: "assistant",
      content: "Hello, I'm Bridget. How can I help you today?",
      isTyping: false,
    },
    {
      id: "4",
      role: "user",
      content: "Can I double my partner's bid?",
      isTyping: false,
    },
    {
      id: "5",
      role: "assistant",
      content: "You",
      isTyping: true,
    },
  ];

  return {
    messages,
  };
}
