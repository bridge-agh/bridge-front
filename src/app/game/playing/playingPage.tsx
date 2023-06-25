import protectRoute from "@/logic/protect_route";
import { Card, CardRank, CardSuit } from "../gameModels";
import Image from 'next/image'
import { ReactElement } from "react";

function Card({ card, index }: { card: Card, index: number }) {
  const path = `/cards/${card.rank}_of_${card.suit}.png`
  const left = `${index * 6.25}%`;
  const ml = index != 0 ? "-18.75%" : "0%";
  console.log(path);
  console.log(left);
  return (
    <img src={path} alt="card" className={`w-[25%] h-auto relative ml-[${ml}] translate-x-[${left}] z-${index + 1}`} />
  );
}

function HandOfCards({ cards }: { cards: Card[] }) {

  return (
    <div className="fixed bottom-3 left-0 right-0 w-[90%] sm:w-[80%] md:w-[50%] lg:w-[40%] xl:w-[20 %] h-fit flex flex-row mx-auto">
      {cards.map((card, index) => (
        <Card card={card} index={index} />
      ))}
    </div>
  )
}


function PlayingPage() {

  let cards: Card[] = [{ suit: CardSuit.SPADES, rank: CardRank.ACE },
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

    <HandOfCards cards={cards} />

  );
}

export default protectRoute(PlayingPage);
