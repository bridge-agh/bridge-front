import { Html } from "@react-three/drei";
import { twMerge } from "tailwind-merge";
import { PlayerDirection } from "../gameModels";


export function GamePosition({ direction, position, scale, visible, selected }:
  {
    direction: PlayerDirection,
    position: number[],
    scale: number,
    visible: boolean,
    selected: boolean
  }) {

  return (
    <Html
      position={[position[0], position[1], position[2]]}
      scale={scale}

      transform
      occlude={"blending"}
    >
      <h1 className={twMerge("ease-in-out duration-200 cursor-default select-none", visible ? "opacity-100" : "opacity-0", selected ? "text-accent" : "text-base-content")}>
        {PlayerDirection[direction][0]}
      </h1>
    </Html>
  );
}