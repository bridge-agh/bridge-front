"use client";

import {
  CardRank,
  CardSuit,
  GameStage,
  GameState,
  PlayerDirection
} from "@/app/game/gameModels";
import GameController from "@/game_engine/gameController";
import protectRoute from "@/logic/protect_route";
import { useState } from "react";
import PlayingPage from "./playingPage";


function Game() {
  // these are the observations that are fetched from the server
  const [serverGameState, setServerGameState] = useState<GameState>({
    base: {
      game_stage: GameStage.PLAYING,
      current_player: PlayerDirection.NORTH,
    },
    bidding: {
      first_dealer: PlayerDirection.NORTH,
      bid_history: [],
      bid: null,
      declarer: null,
      multiplier: 1,
    },
    game: {
      game: {
        round_player: PlayerDirection.NORTH,
        round_cards: [],
        dummy_cards: [],
        tricks: {
          NS: [],
          EW: [],
        },
      },
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
    },
  });

  return (
    <GameController serverGameState={serverGameState}>
      <div className="col-start-1 col-span-full flex flex-col">
        <PlayingPage />
      </div>
    </GameController>
  );
}

export default protectRoute(Game);
