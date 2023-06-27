import protectRoute from "@/logic/protect_route";
import { Card, CardRank, CardSuit } from "../gameModels";
import HorizontalHand, { LeftHand, PlayerHand, RightHand, TopHand } from "@/app/game/playing/hands";
import React from "react";

function PlayingPage() {
  let cards: Card[] = [
    { suit: CardSuit.SPADES, rank: CardRank.ACE },
    { suit: CardSuit.HEARTS, rank: CardRank.QUEEN },
    { suit: CardSuit.CLUBS, rank: CardRank.KING },
    { suit: CardSuit.CLUBS, rank: CardRank.JACK },
    { suit: CardSuit.DIAMONDS, rank: CardRank.TEN },
    { suit: CardSuit.HEARTS, rank: CardRank.TEN },
    { suit: CardSuit.SPADES, rank: CardRank.NINE },
    { suit: CardSuit.SPADES, rank: CardRank.JACK },
    { suit: CardSuit.DIAMONDS, rank: CardRank.TWO },
    { suit: CardSuit.CLUBS, rank: CardRank.THREE },
    { suit: CardSuit.DIAMONDS, rank: CardRank.SEVEN },
    { suit: CardSuit.SPADES, rank: CardRank.QUEEN },
    { suit: CardSuit.SPADES, rank: CardRank.KING },
  ];

  return (
    <div className="h-full grid grid-cols-5 grid-rows-6">
      <div className="col-start-2 col-span-3 row-start-5 row-span-1">
        <PlayerHand cards={cards} accessible={true} />
      </div>
      <div className="col-start-2 col-span-3 row-start-1 row-span-1">
        <TopHand cards={undefined} cards_left={7} accessible={false} />
      </div>
      <div className="col-start-1 col-span-1 row-start-1 row-span-5">
        <LeftHand cards={cards} cards_left={cards.length} accessible={false}/>
      </div>
      <div className="col-start-5 col-span-1 row-start-1 row-span-5">
        <RightHand cards={cards} cards_left={cards.length} accessible={false}/>
      </div>
    </div>
  );
}

export default protectRoute(PlayingPage);
