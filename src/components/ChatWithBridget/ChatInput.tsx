export const ChatInput = () => (
  <div className="bg-gray-400 p-1 flex flex-row">
    <input
      type="text"
      className="bg-gray-200 grow rounded-lg p-1"
      placeholder="..."
    />
    <button className="rounded-xl bg-blue-500 ms-1 p-1 text-gray-100">
      Send
    </button>
  </div>
);
