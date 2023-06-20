"use client";

import protectRoute from "@/logic/protect_route";
import { useState } from "react";
import {
  BaseObservation,
  GameObservation,
  GameStage,
  PlayerDirection,
} from "@/app/game/gameModels";
import BiddingPage from "@/app/game/bidding/biddingPage";

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
      tricks: {
        NS: [],
        EW: [],
      },
    },
    hand: [],
  });

  return (
    <div className="col-start-1 col-span-4 sm:col-start-2 sm:col-span-4 lg:col-start-3 lg:col-span-4 xl:col-start-5 xl:col-span-4">
      <div className="text-center mb-4">
        <span className="text-lg uppercase font-bold">
          {gameStageToName(baseObservation.game_stage)}
        </span>
      </div>
      <div className="">{gameStageToScreen(baseObservation.game_stage)}</div>
    </div>
  );
}

export default protectRoute(Game);
