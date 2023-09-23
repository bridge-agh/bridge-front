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
    <div className="col-start-1 col-span-full flex flex-col">
      {gameStageToScreen(selectedStage)}
    </div>
  );
}

export default protectRoute(Game);
