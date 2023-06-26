import protectRoute from "@/logic/protect_route";
import { Card, CardRank, CardSuit } from "../gameModels";
import Image from "next/image";

function Card({
  card,
  index,
  scale,
  cards_left,
}: {
  card: Card;
  index: number;
  scale: number;
  cards_left: number;
}) {
  const path = `/cards/${card.rank}_of_${card.suit}.png`;
  const width = 2.25 * scale;
  const height = 3.5 * scale;

  const overlap = 0.3; // must be between 0 and 1
  const shift = ((cards_left - 1) * width * overlap + width) / 2;
  const left = `${index * width * overlap - shift}rem`;

  console.log(path);
  console.log(left);
  return (
    <div
      className="absolute player-card-hover"
      style={{ left: left, width: `${width}rem`, height: `${height}rem` }}
    >
      <Image className="player-card" src={path} fill={true} alt="card" />
      <div
        style={{ left: left, width: `${width}rem`, height: `${height}rem` }}
      ></div>
    </div>
  );
}

function HandOfCards({ cards }: { cards: Card[] }) {
  return (
    <div className="relative w-full">
      <div className="absolute w-min left-0 right-0 mx-auto">
        {cards.map((card, index) => (
          <Card
            key={index}
            card={card}
            index={index}
            scale={1.5}
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
