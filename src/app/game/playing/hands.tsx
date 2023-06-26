import { useEffect, useRef } from "react";
import HorizontalCard from "./cards";
import { Card } from "@/app/game/gameModels";
import useElement from "@/logic/use_element_properties";

const maxDynamicWidth = 1000;
const overlap = 0.5;

function HorizontalHand({
  cards,
  cards_left,
  accessible,
}: {
  cards?: Card[];
  cards_left: number;
  accessible: boolean;
}) {
  const playerCardHolderRef = useRef<HTMLDivElement>(null);
  const [width, height, setElement] = useElement(playerCardHolderRef.current!);

  useEffect(() => {
    if (playerCardHolderRef.current) {
      setElement(playerCardHolderRef.current);
    }
  }, [setElement, playerCardHolderRef]);

  return (
    <div className="relative w-full" ref={playerCardHolderRef}>
      <div className="absolute w-min left-0 right-0 mx-auto">
        {(cards &&
          cards.map((card, index) => (
            <HorizontalCard
              key={index}
              card={card}
              index={index}
              overlap={overlap}
              parentWidth={width <= maxDynamicWidth ? width : maxDynamicWidth}
              accessible={accessible}
              cards_left={cards_left}
            />
          ))) ||
          [...Array(cards_left)].map((_, index) => (
            <HorizontalCard
              key={index}
              card={undefined}
              index={index}
              overlap={overlap}
              parentWidth={width <= maxDynamicWidth ? width : maxDynamicWidth}
              accessible={accessible}
              cards_left={cards_left}
            />
          ))}
      </div>
    </div>
  );
}

export function PlayerHand({cards, accessible}: {cards: Card[], accessible: boolean}) {
  return (
    <HorizontalHand cards={cards} cards_left={cards.length} accessible={accessible} />
  );
}

export function TopHand({cards, cards_left, accessible}: {cards?: Card[], cards_left: number, accessible: boolean}) {
  return (
    <HorizontalHand cards={cards} cards_left={cards_left} accessible={accessible} />
  );
}



export default HorizontalHand;
