"use client";

import BiddingPage from "@/app/game/bidding/biddingPage";
import {
  BaseObservation,
  GameObservation,
  GameStage,
  PlayerDirection,
} from "@/app/game/gameModels";
import protectRoute from "@/logic/protect_route";
import { useState } from "react";
import PlayingPage from "./playing/playingPage";

function gameStageToName(gameStage: GameStage) {
  switch (gameStage) {
    case GameStage.BIDDING:
      return "Bidding";
    case GameStage.PLAYING:
      return "Playing";
    case GameStage.SCORING:
      return "Scoring";
  }
}

function gameStageToScreen(gameStage: GameStage) {
  switch (gameStage) {
    case GameStage.BIDDING:
      return <BiddingPage />;
    case GameStage.PLAYING:
      return <PlayingPage />;
  }
}

function Game() {
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
    hand: [],
  });

  // debug
  const [selectedStage, setSelectedStage] = useState<GameStage>(
    GameStage.PLAYING
  );

  return (
    <div className="absolute content-height w-full top-0 left-0">
      {/* <div className="text-center mb-4 flex-row">
        <span className="text-lg uppercase font-bold">
          {gameStageToName(selectedStage)}
        </span>
        <select
          className="select select-bordered select-accent"
          onChange={(e) => {
            setSelectedStage(
              GameStage[e.target.value as keyof typeof GameStage]
            );
          }}
        >
          {Object.keys(GameStage)
            .filter((key) => isNaN(Number(key)))
            .map((gameStageValue) => {
              const gameStage: GameStage =
                GameStage[gameStageValue as keyof typeof GameStage];
              return (
                <option
                  key={gameStageValue}
                  value={gameStageValue}
                  selected={gameStage === selectedStage}
                >
                  {gameStageToName(gameStage)}
                </option>
              );
            })}
        </select>
      </div> */}
      {gameStageToScreen(selectedStage)}
    </div>
  );
}

export default protectRoute(Game);
