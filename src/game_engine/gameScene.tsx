import { BaseObservation, CardRank, CardSuit, GameObservation, GameStage, PlayerDirection } from "@/app/game/gameModels";
import { OrbitControls, PerspectiveCamera, Stats } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { RefObject, useCallback, useEffect, useRef, useState } from "react";
import { MathUtils } from "three";
import GameDeck from "./components/GameDeck";

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

export default function GameScene({ width, height, parentRef }: { width: number, height: number, parentRef: RefObject<HTMLDivElement> }) {
  // base three stuff
  const canvasRef = useRef<HTMLCanvasElement>(null!);
  const cameraRef = useRef<any>(null!); // any to supress warning

  const fov = 50;
  const planeAspectRatio = 12 / 9;

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


  // redux here, currently dummy data
  const [baseObservation, setBaseObservation] = useState<BaseObservation>({
    game_stage: GameStage.BIDDING,
    current_player: PlayerDirection.NORTH,
  });

  const [gameObservation, setGameObservation] = useState<GameObservation>({
    game: {
      round_player: PlayerDirection.NORTH,
      round_cards: [],
      dummy_cards: [],
      tricks: {
        NS: [],
        EW: [],
      },
    },
    // 13 random cards
    hand: [
      { suit: CardSuit.CLUBS, rank: CardRank.ACE },
      { suit: CardSuit.CLUBS, rank: CardRank.TWO },
      { suit: CardSuit.CLUBS, rank: CardRank.THREE },
      { suit: CardSuit.DIAMONDS, rank: CardRank.FOUR },
      { suit: CardSuit.DIAMONDS, rank: CardRank.FIVE },
      { suit: CardSuit.CLUBS, rank: CardRank.SIX },
      { suit: CardSuit.SPADES, rank: CardRank.SEVEN },
      { suit: CardSuit.CLUBS, rank: CardRank.EIGHT },
      { suit: CardSuit.CLUBS, rank: CardRank.NINE },
      { suit: CardSuit.CLUBS, rank: CardRank.TEN },
      { suit: CardSuit.CLUBS, rank: CardRank.JACK },
      { suit: CardSuit.CLUBS, rank: CardRank.QUEEN },
      { suit: CardSuit.CLUBS, rank: CardRank.KING },
    ],
  });

  // debug
  const [selectedStage, setSelectedStage] = useState<GameStage>(
    GameStage.PLAYING
  );

  return (
    <Canvas ref={canvasRef}>
      <ambientLight intensity={1.5} />
      <directionalLight position={[0, 0, 4]} color={0xffffff} intensity={1.5} />
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
        position={[0, 0, 4]}
        ref={cameraRef}
      />
    </Canvas>
  );
}
function Card() {
  throw new Error("Function not implemented.");
}

