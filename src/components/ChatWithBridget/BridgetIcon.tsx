import cc from "classcat";
import Image from "next/image";
import bridget from "./bridget-icon.png";

export const BridgetIcon = ({ size, rounded }: { size: number, rounded: boolean }) => (
  <div
    className={cc([
      "relative",
      "w-" + size,
      "h-" + size,
      rounded && "rounded-full",
      "bg-pink-400",
      "overflow-hidden",
      "shadow-md",
    ])}
  >
    <Image
      src={bridget}
      alt="Bridget"
      fill={true}
      style={{
        objectFit: "cover",
      }} />
  </div>
);
