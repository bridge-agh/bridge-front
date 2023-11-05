"use client";

import GameController from "@/game_engine/gameController";
import {
  BidSuit,
  BidTricks,
  CardRank,
  CardSuit,
  GameStage,
  GameState,
  PlayerDirection
} from "@/game_engine/gameModels";
import protectRoute from "@/logic/protect_route";
import { Suspense, useState } from "react";
import PlayingPage from "./playingPage";


function Game() {
  // these are the observations that are fetched from the server
  const [serverGameState, setServerGameState] = useState<GameState>(
    {
      base: {
        game_stage: GameStage.PLAYING,
        current_player: PlayerDirection.EAST,
        user_direction: PlayerDirection.EAST,
      },
      bidding: {
        first_dealer: PlayerDirection.WEST,
        bid_history: [],
        bid: {
          suit: BidSuit.SPADES,
          tricks: BidTricks.THREE,
        },
        declarer: PlayerDirection.WEST,
        multiplier: 1,
      },
      game: {
        round_player: PlayerDirection.EAST,
        round_cards: [
        ],
        dummy_cards: [
          { suit: CardSuit.CLUBS, rank: CardRank.ACE },
          { suit: CardSuit.SPADES, rank: CardRank.TWO },
          { suit: CardSuit.CLUBS, rank: CardRank.THREE },
          { suit: CardSuit.DIAMONDS, rank: CardRank.FOUR },
          { suit: CardSuit.DIAMONDS, rank: CardRank.FIVE },
          { suit: CardSuit.SPADES, rank: CardRank.SEVEN },
          { suit: CardSuit.CLUBS, rank: CardRank.EIGHT },
          { suit: CardSuit.DIAMONDS, rank: CardRank.NINE },
          { suit: CardSuit.HEARTS, rank: CardRank.FIVE },
          { suit: CardSuit.SPADES, rank: CardRank.JACK },
          { suit: CardSuit.SPADES, rank: CardRank.QUEEN },
          { suit: CardSuit.HEARTS, rank: CardRank.KING },
        ],
        tricks: {
          NS: [],
          EW: [
            {
              round_player: PlayerDirection.NORTH,
              winner: PlayerDirection.EAST,
              cards: [
                { suit: CardSuit.DIAMONDS, rank: CardRank.TWO },
                { suit: CardSuit.CLUBS, rank: CardRank.THREE },
                { suit: CardSuit.DIAMONDS, rank: CardRank.QUEEN },
                { suit: CardSuit.HEARTS, rank: CardRank.TEN },
              ]
            }
          ],
        },
        hand: [
          { suit: CardSuit.CLUBS, rank: CardRank.ACE },
          { suit: CardSuit.SPADES, rank: CardRank.TWO },
          { suit: CardSuit.DIAMONDS, rank: CardRank.FOUR },
          { suit: CardSuit.DIAMONDS, rank: CardRank.FIVE },
          { suit: CardSuit.SPADES, rank: CardRank.SEVEN },
          { suit: CardSuit.CLUBS, rank: CardRank.EIGHT },
          { suit: CardSuit.DIAMONDS, rank: CardRank.NINE },
          { suit: CardSuit.HEARTS, rank: CardRank.TEN },
          { suit: CardSuit.HEARTS, rank: CardRank.FIVE },
          { suit: CardSuit.SPADES, rank: CardRank.JACK },
          { suit: CardSuit.SPADES, rank: CardRank.QUEEN },
          { suit: CardSuit.HEARTS, rank: CardRank.KING },
        ],
      },
    },
  );

  return (
    <div className="col-start-1 col-span-full flex flex-col">
      <Suspense fallback={<div>Loading!!!</div>}>
        <GameController serverGameState={serverGameState} setGameState={setServerGameState}>
          <PlayingPage />
        </GameController>
      </Suspense>
    </div>
  );
}

export default protectRoute(Game);
