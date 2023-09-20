import { BaseObservation, CardRank, CardSuit, GameObservation, GameStage, PlayerDirection } from "@/app/game/gameModels";
import { OrbitControls, PerspectiveCamera, Stats } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { useCallback, useEffect, useRef, useState } from "react";
import { MathUtils } from "three";
import GameDeck from "./components/GameDeck";

export default function GameScene() {
  // base three stuff
  const canvasRef = useRef<HTMLCanvasElement>(null!);
  const cameraRef = useRef(null);

  const fov = 45;
  const planeAspectRatio = 16 / 9;

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
    <Canvas ref={canvasRef} >
      <ambientLight intensity={1} />
      <directionalLight position={[5, 5, 5]} color={0xffffff} intensity={2.5} />
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
      />
    </Canvas>
  );
}
function Card() {
  throw new Error("Function not implemented.");
}

