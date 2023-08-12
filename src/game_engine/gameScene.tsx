import { OrbitControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { useRef } from "react";

export default function GameScene() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  return (
    <Canvas ref={canvasRef}>
      <ambientLight intensity={0.2} />
      <directionalLight position={[5, 5, 5]} intensity={0.3} />
      <mesh>
        <boxGeometry />
        <meshStandardMaterial color={"white"} />
      </mesh>
      <OrbitControls />
    </Canvas>
  );
}
