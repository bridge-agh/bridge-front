import protectRoute from "@/logic/protect_route";
import { Card, CardRank, CardSuit } from "../gameModels";
import cardToComponent from "@/components/cards/cards";
import React, { useEffect, useRef, useState } from "react";

function Card({
  card,
  index,
  cards_left,
  overlap, // must be between 0 and 1
  parentWidth,
}: {
  card: Card;
  index: number;
  cards_left: number;
  overlap: number;
  parentWidth: number;
}) {
  const scale = parentWidth / (12 * overlap + 1);

  const width = scale;
  const height = (3.5 / 2.25) * scale;

  const shift = ((cards_left - 1) * width * overlap + width) / 2;
  const left = index * width * overlap - shift;

  const CardComponent: React.FC<{
    className?: string;
    background: string;
    fill: string;
  }> = cardToComponent(card)!;

  return (
    <div
      className="absolute player-card-hover cursor-pointer"
      style={{ left: `${left}px`, width: `${width}px`, height: `${height}px` }}
    >
      <CardComponent
        className="player-card"
        background="#20252e"
        fill={
          card.suit == CardSuit.DIAMONDS || card.suit == CardSuit.HEARTS
            ? "#ff3838"
            : "#e3e3e3"
        }
      />
    </div>
  );
}

const maxDynamicWidth = 1024;
const overlap = 0.3;

function HandOfCards({ cards }: { cards: Card[] }) {
  const playerCardHolderRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState<number>(0);

  useEffect(() => {
    const resizeObserver = new ResizeObserver(() => {
      if (playerCardHolderRef.current) {
        if (playerCardHolderRef.current.offsetWidth >= maxDynamicWidth) {
          setWidth(maxDynamicWidth);
        } else {
          setWidth(playerCardHolderRef.current.offsetWidth);
        }
      }
    });

    resizeObserver.observe(playerCardHolderRef.current!);

    return function cleanup() {
      resizeObserver.disconnect();
    };
  }, [playerCardHolderRef]);

  return (
    <div className="relative w-full" ref={playerCardHolderRef}>
      <div className="absolute w-min left-0 right-0 mx-auto">
        {cards.map((card, index) => (
          <Card
            key={index}
            card={card}
            index={index}
            overlap={overlap}
            parentWidth={width}
            cards_left={cards.length}
          />
        ))}
      </div>
    </div>
  );
}

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

  return <HandOfCards cards={cards} />;
}

export default protectRoute(PlayingPage);
