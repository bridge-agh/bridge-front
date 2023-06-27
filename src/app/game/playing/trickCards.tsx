import cardToComponent from "@/components/cards/cards";
import {
  Card,
  CardRank,
  CardSuit,
  GameObservation,
  PlayerDirection,
} from "@/app/game/gameModels";
import { useState } from "react";

function TrickCards() {
  const [gameObservation, setGameObservation] = useState<GameObservation>({
    game: {
      round_player: PlayerDirection.NORTH,
      round_cards: [
        { suit: CardSuit.CLUBS, rank: CardRank.ACE },
        { suit: CardSuit.CLUBS, rank: CardRank.TWO },
        { suit: CardSuit.DIAMONDS, rank: CardRank.THREE },
      ],
      dummy_cards: [],
      tricks: {
        NS: [],
        EW: [],
      },
    },
    hand: [],
  });

  const [biddingObservation, setBiddingObservation] = useState({
    first_dealer: PlayerDirection.NORTH,
    bid_history: [],
    bid: null,
    declarer: PlayerDirection.EAST,
    multiplier: 1,
  });

  return (
    <div className="w-full h-full flex flex-row justify-center items-center gap-2">
      {gameObservation.game.round_cards.map((card, index) => {
        const CardComponent:
          | React.FC<{
              className?: string;
              background: string;
              fill: string;
            }>
          | undefined = cardToComponent(card!);
        return (
          <div
            key={index}
            className="w-24"
          >
            {CardComponent && (
              <CardComponent
                className="player-card"
                background="#20252e"
                fill="#ffffff"
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

export default TrickCards;
