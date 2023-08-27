import THREE from "three";

export function GameCard({ x, y, z, scale}: { x: number; y: number; z: number, scale: number }) {

  return (
    <>
      <mesh position={[x, y, z]} scale={scale}>
        <boxGeometry args={[0.57, 0.89, 0.02]} />
        <meshStandardMaterial color={"white"} />
      </mesh>
    </>
  );
}
