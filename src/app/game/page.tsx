"use client";

import { useGameState } from "@/api/session/game";
import GameController from "@/game_engine/gameController";
import protectRoute from "@/logic/protect_route";
import { Suspense } from "react";
import PlayingPage from "./playingPage";


function Game() {
  // these are the observations that are fetched from the server
  const { data } = useGameState();

  if (!data) return (<div>Loading!!!</div>);

  return (
    <div className="col-start-1 col-span-full flex flex-col">
      <Suspense fallback={<div>Loading!!!</div>}>
        <GameController serverGameState={data}>
          <PlayingPage />
        </GameController>
      </Suspense>
    </div>
  );
}

export default protectRoute(Game);
