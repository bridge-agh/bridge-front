"use client";

import GameController from "@/game_engine/gameController";
import { BidSuit, BidTricks, CardRank, CardSuit, GameStage, GameState, PlayerDirection, SpecialBid } from "@/game_engine/gameModels";
import protectRoute from "@/logic/protect_route";
import { Suspense, useState } from "react";
import PlayingPage from "./playingPage";


function Game() {
  // these are the observations that are fetched from the server
  // const { data } = useGameState();

  // if (!data) return (<div>Loading!!!</div>);

  const [serverGameState, setServerGameState] = useState<GameState>(
    {
      base: {
        game_stage: GameStage.PLAYING,
        current_player: PlayerDirection.WEST,
        user_direction: PlayerDirection.EAST,
      },
      bidding: {
        first_dealer: PlayerDirection.WEST,
        bid_history: [
          {
            suit: BidSuit.HEARTS,
            tricks: BidTricks.TWO,
          },
          {
            suit: BidSuit.SPADES,
            tricks: BidTricks.TWO,
          },
          SpecialBid.PASS,
          {
            suit: BidSuit.SPADES,
            tricks: BidTricks.THREE,
          },
          SpecialBid.PASS,
          {
            suit: BidSuit.HEARTS,
            tricks: BidTricks.FOUR,
          },
          SpecialBid.PASS,
          SpecialBid.DOUBLE,
          SpecialBid.REDOUBLE,
          {
            suit: BidSuit.SPADES,
            tricks: BidTricks.FIVE,
          },
          SpecialBid.PASS,
          SpecialBid.PASS,
          {
            suit: BidSuit.NO_TRUMP,
            tricks: BidTricks.SIX,
          },
        ],
        bid: {
          suit: BidSuit.SPADES,
          tricks: BidTricks.THREE,
        },
        declarer: PlayerDirection.EAST,
        multiplier: 1,
      },
      game: {
        round_player: PlayerDirection.EAST,
        round_cards: [
          { suit: CardSuit.DIAMONDS, rank: CardRank.SIX },
          { suit: CardSuit.DIAMONDS, rank: CardRank.FOUR },
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
          // { suit: CardSuit.DIAMONDS, rank: CardRank.NINE },
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
        <GameController serverGameState={serverGameState}>
          <PlayingPage />
        </GameController>
      </Suspense>
    </div>
  );
}

export default protectRoute(Game);
