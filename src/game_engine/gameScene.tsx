import { OrbitControls, PerspectiveCamera, Stats, useTexture } from "@react-three/drei";
import { Canvas, useLoader } from "@react-three/fiber";
import { RefObject, useCallback, useContext, useEffect, useRef, useState } from "react";
import { MathUtils, TextureLoader } from "three";
import { GameCard } from "./components/gameCard";
import { GameContext } from "./gameController";

const textureFilePaths = [
  "BACK",
  "2C", "2D", "2H", "2S",
  "3C", "3D", "3H", "3S",
  "4C", "4D", "4H", "4S",
  "5C", "5D", "5H", "5S",
  "6C", "6D", "6H", "6S",
  "7C", "7D", "7H", "7S",
  "8C", "8D", "8H", "8S",
  "9C", "9D", "9H", "9S",
  "TC", "TD", "TH", "TS",
  "JC", "JD", "JH", "JS",
  "QC", "QD", "QH", "QS",
  "KC", "KD", "KH", "KS",
  "AC", "AD", "AH", "AS",
];

// preload textures in global app context
let loaded = false;
textureFilePaths.forEach((path) => {
  useTexture.preload("png/cards/dark/" + path + ".png");
});

const fov = 50;
const planeAspectRatio = 16 / 9.8;

function calcFovAndAspect(currentHeight: number, currentWidth: number, currentAspect: number) {
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

export default function GameScene({ width, height, parentRef }: { width: number, height: number, parentRef: RefObject<HTMLDivElement> }) {
  // force load textures if not preloaded in global context
  if (!loaded) {
    textureFilePaths.forEach((path) => {
      // eslint-disable-next-line react-hooks/rules-of-hooks
      useLoader(TextureLoader, "png/cards/dark/" + path + ".png");
    });
    loaded = true;
  }

  // canvas resize and scaling
  const canvasRef = useRef<HTMLCanvasElement>(null!);
  const cameraRef = useRef<any>(null!); // any to supress warning

  const [cameraFOV, setCameraFOV] = useState(calcFovAndAspect(0, 0, planeAspectRatio)[0]);
  const [cameraPlaneAspectRatio, setCameraPlaneAspectRatio] =
    useState(calcFovAndAspect(0, 0, planeAspectRatio)[1]);

  const onWindowResize = useCallback(() => {
    var res;
    if (canvasRef.current && cameraRef.current) {
      res = calcFovAndAspect(height, width, cameraRef.current.aspect);
    } else {
      res = calcFovAndAspect(height, width, cameraPlaneAspectRatio);
    }

    setCameraFOV(res[0]);
    setCameraPlaneAspectRatio(res[1]);
  }, [canvasRef, cameraRef, cameraPlaneAspectRatio, width, height]);

  useEffect(() => {
    if (parentRef.current)
      onWindowResize();
    window.addEventListener("resize", onWindowResize);
    return () => window.removeEventListener("resize", onWindowResize);
  }, [onWindowResize, parentRef]);


  const gameContext = useContext(GameContext);

  return (
    <>
      <Canvas ref={canvasRef}>
        <ambientLight intensity={1.5} />
        <directionalLight position={[0, 0, 4]} color={0xffffff} intensity={1.5} />
        {/* <Suspense fallback={null}> */}
        {gameContext.cards.map((_, index) => {
          return (
            <GameCard
              key={index}
              cardFront={gameContext.cards[index].cardFront}
              position={gameContext.cards[index].props.position}
              rotation={gameContext.cards[index].props.rotation}
              scale={gameContext.cards[index].props.scale}
              onPointerEnter={() => gameContext.onPointerEnter(gameContext.cards[index])}
              onPointerLeave={() => gameContext.onPointerLeave(gameContext.cards[index])}
              onClick={() => gameContext.onClick(gameContext.cards[index])} />);
        })}
        {/* </Suspense> */}
        {/* <Preload all /> */}
        <OrbitControls />
        {/* <gridHelper /> */}
        {/* <axesHelper /> */}
        <Stats />
        <PerspectiveCamera
          makeDefault
          fov={cameraFOV}
          aspect={cameraPlaneAspectRatio}
          position={[0, 0, 4]}
          ref={cameraRef}
        />
      </Canvas>
      {/* <Loader /> */}
    </>
  );
}
function componentDidMount(arg0: () => void) {
  throw new Error("Function not implemented.");
}

