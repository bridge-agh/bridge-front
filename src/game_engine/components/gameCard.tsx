import { a, useSpring } from "@react-spring/three";
import { useLoader } from "@react-three/fiber";
import { useRef } from "react";
import { DoubleSide, MeshBasicMaterial, TextureLoader, Vector3, sRGBEncoding } from "three";
import RoundGeomtryBox from "./roundGeometryBox";

export function GameCard({ cardFront, cardBack, position, rotation, scale, }: { cardFront: string, cardBack: string, position: Vector3, rotation: Vector3, scale: number }) {
  const cardMap = useLoader(TextureLoader, "png/cards/dark/" + cardFront + ".png");
  cardMap.encoding = sRGBEncoding;

  const backMap = useLoader(TextureLoader, "png/cards/dark/" + cardBack + ".png");
  backMap.encoding = sRGBEncoding;

  const w = 0.57; // width
  const h = 0.89; // height
  const t = 0.01; // thick
  const r = 0.052; // radius corner
  const s = 25; // smoothness


  const geometry = RoundGeomtryBox({ w, h, t, r, s });
  geometry.computeVertexNormals();

  const sideRopeMaterial = new MeshBasicMaterial({ color: 0x000000 });

  const material = [
    new MeshBasicMaterial({ map: cardMap, side: DoubleSide, wireframe: false }),
    new MeshBasicMaterial({ map: backMap, side: DoubleSide, wireframe: false }),
    sideRopeMaterial
  ];

  const ref = useRef(null);


  const [{ springX, springY, springZ, springXRotation, springYRotation, springZRotation, springScale }] = useSpring({
    springX: position.x,
    springY: position.y,
    springZ: position.z,
    springXRotation: rotation.x,
    springYRotation: rotation.y,
    springZRotation: rotation.z,
    springScale: scale,
    config: { mass: 5, tension: 400, friction: 50, precision: 0.0001, duration: 120 },
  }, [position, rotation, scale]);


  const calcX = springX.to([-10, 10], [-10, 10]);
  const calcY = springY.to([-10, 10], [-10, 10]);
  const calcZ = springZ.to([-10, 10], [-10, 10]);
  const calcXRotation = springXRotation.to([0, 2 * Math.PI], [0, 2 * Math.PI]);
  const calcYRotation = springYRotation.to([0, 2 * Math.PI], [0, 2 * Math.PI]);
  const calcZRotation = springZRotation.to([0, 2 * Math.PI], [0, 2 * Math.PI]);


  return (
    <a.mesh ref={ref}
      position-x={calcX}
      position-y={calcY}
      position-z={calcZ}
      rotation-x={calcXRotation}
      rotation-y={calcYRotation}
      rotation-z={calcZRotation}
      scale={springScale}
      geometry={geometry} material={material}
    />
  );
}
