import { SpringValue, a } from "@react-spring/three";
import { useLoader } from "@react-three/fiber";
import { useMemo } from "react";
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

  const cardMap = useLoader(TextureLoader, "png/cards/dark/" + cardFront + ".png");
  cardMap.colorSpace = SRGBColorSpace;

  const backMap = useLoader(TextureLoader, "png/cards/dark/BACK.png");
  backMap.colorSpace = SRGBColorSpace;

  const w = 0.57; // width
  const h = 0.89; // height
  const t = 0.01; // thick
  const r = 0.052; // radius corner
  const s = 25; // smoothness


  const geometry = useMemo(() => {
    const geometry = RoundGeometryBox({ w, h, t, r, s });
    geometry.computeVertexNormals();
    return geometry;
  }, [w, h, t, r, s]);

  const sideRopeMaterial = useMemo(() => new MeshBasicMaterial({ color: 0x000000 }), []);

  const material = useMemo(() => [
    new MeshBasicMaterial({ map: cardMap, side: DoubleSide, wireframe: false }),
    new MeshBasicMaterial({ map: backMap, side: DoubleSide, wireframe: false }),
    sideRopeMaterial
  ], [cardMap, backMap, sideRopeMaterial]);

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
