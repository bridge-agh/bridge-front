import { OrbitControls, PerspectiveCamera, Stats } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { RefObject, useCallback, useContext, useEffect, useRef, useState } from "react";
import { MathUtils } from "three";
import { GameCard } from "./components/gameCard";
import { GameContext } from "./gameController";

function calcFovAndAspect(currentHeight: number, currentWidth: number, currentAspect: number) {
  const fov = 50;
  const planeAspectRatio = 12 / 9;

  if (currentAspect > planeAspectRatio) {
    return [fov, currentAspect];
  }
  else {
    const newAspect = currentWidth / currentHeight;

    const cameraHeight = Math.tan(MathUtils.degToRad(fov / 2));
    const ratio = newAspect / planeAspectRatio;
    const newCameraHeight = cameraHeight / ratio;
    const newFov = MathUtils.radToDeg(Math.atan(newCameraHeight)) * 2;
    return [newFov, newAspect];
  }
}

const fov = 50;
const planeAspectRatio = 12 / 9;

export default function GameScene({ width, height, parentRef }: { width: number, height: number, parentRef: RefObject<HTMLDivElement> }) {
  console.log("gamescene");
  // canvas resize and scaling
  const canvasRef = useRef<HTMLCanvasElement>(null!);
  const cameraRef = useRef<any>(null!); // any to supress warning

  const [cameraFOV, setCameraFOV] = useState(calcFovAndAspect(0, 0, planeAspectRatio)[0]);
  const [cameraPlaneAspectRatio, setCameraPlaneAspectRatio] =
    useState(calcFovAndAspect(0, 0, planeAspectRatio)[1]);

  const onWindowResize = useCallback(() => {
    console.log("canvasHeight: ", canvasRef.current.clientHeight);
    console.log("canvasWidth: ", canvasRef.current.clientWidth);

    var res;
    if (canvasRef.current && cameraRef.current) {
      res = calcFovAndAspect(height, width, cameraRef.current.aspect);
    } else {
      res = calcFovAndAspect(height, width, cameraPlaneAspectRatio);
    }

    setCameraFOV(res[0]);
    setCameraPlaneAspectRatio(res[1]);

    console.log("fov: ", cameraFOV);
    console.log("aspect ", cameraPlaneAspectRatio);
  }, [canvasRef, cameraRef, cameraFOV, cameraPlaneAspectRatio, width, height]);

  useEffect(() => {
    if (parentRef.current)
      onWindowResize();
    window.addEventListener("resize", onWindowResize);
    return () => window.removeEventListener("resize", onWindowResize);
  }, [onWindowResize, parentRef]);


  const gameContext = useContext(GameContext);
  console.log("gameContext: ", gameContext);

  return (
    <Canvas ref={canvasRef}>
      <ambientLight intensity={1.5} />
      <directionalLight position={[0, 0, 4]} color={0xffffff} intensity={1.5} />
      {gameContext && gameContext.cards.map((_, index) => {
        console.log("cards render");
        return (
          <GameCard
            key={index}
            cardFront="7S"
            position={gameContext.cards[index].props.position}
            rotation={gameContext.cards[index].props.rotation}
            scale={gameContext.cards[index].props.scale}
            onPointerEnter={() => gameContext.onPointerEnter(gameContext.cards[index])}
            onPointerLeave={() => gameContext.onPointerLeave(gameContext.cards[index])}
            onClick={() => gameContext.onClick(gameContext.cards[index])}
          />
        );
      })}
      <OrbitControls />
      <gridHelper />
      <axesHelper />
      <Stats />
      <PerspectiveCamera
        makeDefault
        fov={cameraFOV}
        aspect={cameraPlaneAspectRatio}
        position={[0, 0, 4]}
        ref={cameraRef}
      />
    </Canvas>
  );
}
