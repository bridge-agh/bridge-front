import { SpringValue, a } from "@react-spring/three";
import { useTexture } from "@react-three/drei";
import { useMemo } from "react";
import { DoubleSide, MeshBasicMaterial, SRGBColorSpace } from "three";
import RoundGeometryBox from "../geometry/roundGeometryBox";

export const CARD_WIDTH = 0.57; // width
export const CARD_HEIGHT = 0.89; // height
export const CARD_THICK = 0.01; // thick
export const CARD_RADIUS = 0.052; // radius corner
export const CARD_SMOOTHNESS = 25; // smoothness

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

  const cardTexture = useTexture("png/cards/dark/" + cardFront + ".png");
  const cardMap = useMemo(() => {
    cardTexture.colorSpace = SRGBColorSpace;
    return cardTexture;
  }, [cardTexture]);

  const backTexture = useTexture("png/cards/dark/BACK.png");
  const backMap = useMemo(() => {
    backTexture.colorSpace = SRGBColorSpace;
    return backTexture;
  }, [backTexture]);

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
  ], [backMap, cardMap, sideRopeMaterial]);

  return (
    <a.mesh
      geometry={geometry}
      material={material}

      position={position.to((x, y, z) => [x, y, z])}
      // @ts-ignore
      rotation={rotation.to((x, y, z) => [x, y, z])}
      scale={scale}

      onPointerOver={(e) => {
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
