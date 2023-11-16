import cc from "classcat";
import { BridgetIcon } from "./BridgetIcon";

export const ChatHeader = () => (
  <div
    className={cc([
      "flex",
      "flex-row",
      "items-center",
      "bg-pink-400",
      "text-white",
      "p-2",
    ])}
  >
    <BridgetIcon size={12} rounded={false} />
    <div className="h-12 relative flex flex-row justify-end items-center grow overflow-hidden">
      <div className="flex flex-row items-center grow absolute">
        <div className="ms-2 font-bold">Bridget</div>
        <div className="grow" />
        <div className="ms-2">Online</div>
        <div className="ms-2 w-3 h-3 bg-green-400 rounded-full" />
      </div>
    </div>
  </div>
);
