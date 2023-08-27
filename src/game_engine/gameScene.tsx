import { OrbitControls, PerspectiveCamera, Stats } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { useCallback, useEffect, useRef, useState } from "react";
import { MathUtils } from "three";
import GameDeck from "./components/GameDeck";
import { PlayerDirection } from "@/app/game/gameModels";

export default function GameScene() {
  const canvasRef = useRef<HTMLCanvasElement>(null!);
  const cameraRef = useRef(null);

  const fov = 15;
  const planeAspectRatio = 16/9;

  const [cameraFOV, setCameraFOV] = useState(fov);
  const [cameraPlaneAspectRatio, setCameraPlaneAspectRatio] =
    useState(planeAspectRatio);

  const onWindowResize = useCallback(() => {
    console.log("canvasHeight: ", canvasRef.current.clientHeight);
    console.log("canvasWidth: ", canvasRef.current.clientWidth);
    if (canvasRef.current) {
      console.log("change");

      setCameraPlaneAspectRatio(
        canvasRef.current.clientWidth / canvasRef.current.clientHeight
      );
      const cameraHeight = Math.tan(MathUtils.degToRad(fov / 2));
      const ratio = cameraPlaneAspectRatio / planeAspectRatio;
      const newCameraHeight = cameraHeight / ratio;
      setCameraFOV(MathUtils.radToDeg(Math.atan(newCameraHeight)) * 2);

      console.log("fov: ", cameraFOV);
      console.log("aspect ", cameraPlaneAspectRatio);
    }
  }, [canvasRef, fov, planeAspectRatio, cameraPlaneAspectRatio, cameraFOV]);

  useEffect(() => {
    if (cameraRef.current) {
      onWindowResize();
    }
    window.addEventListener("resize", onWindowResize);
    return () => window.removeEventListener("resize", onWindowResize);
  }, [onWindowResize, cameraRef]);

  return (
    <Canvas ref={canvasRef} >
      <ambientLight intensity={1} />
      <directionalLight position={[5, 5, 5]} color={0xffffff} intensity={2.5} />
      {/* <mesh position={[0, 0, 0]} scale={0.2}>
        <boxGeometry />
        <meshStandardMaterial color={"white"} />
      </mesh> */}
      {/* <GameCard x={0} y={-1.15} z={0} /> */}
      <GameDeck direction={PlayerDirection.NORTH} count={13} />
      <GameDeck direction={PlayerDirection.SOUTH} count={13} />
      <GameDeck direction={PlayerDirection.EAST} count={13} />
      <GameDeck direction={PlayerDirection.WEST} count={13} />
      <OrbitControls />
      <gridHelper />
      <axesHelper />
      <Stats />
      <PerspectiveCamera
        makeDefault
        fov={cameraFOV}
        aspect={cameraPlaneAspectRatio}
        position={[0, 0, 12]}
      />
    </Canvas>
  );
}
