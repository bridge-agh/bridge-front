import { SpringValue, a } from "@react-spring/three";
import { useLoader } from "@react-three/fiber";
import { useRef } from "react";
import { DoubleSide, MeshBasicMaterial, SRGBColorSpace, TextureLoader } from "three";
import RoundGeometryBox from "../geometry/roundGeometryBox";

export function GameCard({ cardFront, position, rotation, scale, onPointerEnter, onPointerLeave, onClick }:
  {
    cardFront: string,
    position: SpringValue<number[]>,
    rotation: SpringValue<number[]>,
    scale: SpringValue<number>,
    onPointerEnter: () => void;
    onPointerLeave: () => void;
    onClick: () => void;
  }) {
  console.log("gamecard");

  const cardMap = useLoader(TextureLoader, "png/cards/dark/" + cardFront + ".png");
  cardMap.colorSpace = SRGBColorSpace;

  const backMap = useLoader(TextureLoader, "png/cards/dark/BACK.png");
  backMap.colorSpace = SRGBColorSpace;

  const w = 0.57; // width
  const h = 0.89; // height
  const t = 0.01; // thick
  const r = 0.052; // radius corner
  const s = 25; // smoothness


  const geometry = RoundGeometryBox({ w, h, t, r, s });
  geometry.computeVertexNormals();

  const sideRopeMaterial = new MeshBasicMaterial({ color: 0x000000 });

  const material = [
    new MeshBasicMaterial({ map: cardMap, side: DoubleSide, wireframe: false }),
    new MeshBasicMaterial({ map: backMap, side: DoubleSide, wireframe: false }),
    sideRopeMaterial
  ];

  const ref = useRef(null);

  return (
    <a.mesh ref={ref}
      geometry={geometry}
      material={material}

      position={position.to((x, y, z) => [x, y, z])}
      // @ts-ignore
      rotation={rotation.to((x, y, z) => [x, y, z])}
      scale={scale}

      onPointerEnter={(e) => {
        e.stopPropagation();
        onPointerEnter();
      }}
      onPointerLeave={(e) => {
        e.stopPropagation();
        onPointerLeave();
      }}
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
    />
  );
}
