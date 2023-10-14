import { SpringValue, a } from "@react-spring/three";
import { useMemo } from "react";
import { DoubleSide, MeshBasicMaterial, SRGBColorSpace, TextureLoader } from "three";
import RoundGeometryBox from "../geometry/roundGeometryBox";

export const CARD_WIDTH = 0.57; // width
export const CARD_HEIGHT = 0.89; // height
export const CARD_THICK = 0.01; // thick
export const CARD_RADIUS = 0.052; // radius corner
export const CARD_SMOOTHNESS = 25; // smoothness

const textureLoader = new TextureLoader();
const backMap = textureLoader.load("png/cards/dark/BACK.png");
backMap.colorSpace = SRGBColorSpace;

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

  const cardMap = useMemo(() => {
    if (cardFront == "BACK") return backMap;
    console.log("loading mesh");
    const map = textureLoader.load("png/cards/dark/" + cardFront + ".png");
    map.colorSpace = SRGBColorSpace;
    return map;
  }, [cardFront]);

  const geometry = useMemo(() => {
    const geometry = RoundGeometryBox({ w: CARD_WIDTH, h: CARD_HEIGHT, t: CARD_THICK, r: CARD_RADIUS, s: CARD_SMOOTHNESS });
    geometry.computeVertexNormals();
    return geometry;
  }, []);

  const sideRopeMaterial = useMemo(() => new MeshBasicMaterial({ color: 0x000000 }), []);

  const material = useMemo(() => [
    new MeshBasicMaterial({ map: cardMap, side: DoubleSide, wireframe: false }),
    new MeshBasicMaterial({ map: backMap, side: DoubleSide, wireframe: false }),
    sideRopeMaterial
  ], [cardMap, sideRopeMaterial]);

  console.log("card");
  return (
    <a.mesh
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
