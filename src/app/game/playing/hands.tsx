import { useEffect, useRef } from "react";
import HorizontalCard, { VerticalCard } from "./cards";
import { Card } from "@/app/game/gameModels";
import useElement from "@/logic/use_element_properties";
import { twMerge } from "tailwind-merge";

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


function VerticalHand({
  cards,
  cards_left,
  accessible,
  side
}: {
  cards?: Card[];
  cards_left: number;
  accessible: boolean;
  side: boolean;
}) {
  const playerCardHolderRef = useRef<HTMLDivElement>(null);
  const [width, height, setElement] = useElement(playerCardHolderRef.current!);
  console.log(playerCardHolderRef);
  useEffect(() => {
    if (playerCardHolderRef.current) {
      setElement(playerCardHolderRef.current);
    }
  }, [setElement, playerCardHolderRef]);
  console.log(height);
  console.log(width);
  
  return (
    <div className="relative w-full h-full" ref={playerCardHolderRef}>
      <div className={twMerge("absolute w-min top-[50%] translate-y-[-50%] mx-auto", side ? "left-[10%]" : "right-[10%]")}>
        {(cards &&
          cards.map((card, index) => (
            <VerticalCard
              key={index}
              card={card}
              index={index}
              overlap={overlap}
              parentHeight={height <= maxDynamicWidth ? height : maxDynamicWidth}
              accessible={accessible}
              cards_left={cards_left}
              side={side}
            />
          ))) ||
          [...Array(cards_left)].map((_, index) => (
            <VerticalCard
              key={index}
              card={undefined}
              index={index}
              overlap={overlap}
              parentHeight={height <= maxDynamicWidth ? height : maxDynamicWidth}
              accessible={accessible}
              cards_left={cards_left}
              side={side}
            />
          ))}
      </div>
    </div>
  );


}

export function LeftHand({cards, cards_left, accessible}: {cards?: Card[], cards_left: number, accessible: boolean}) {
  return (
    <VerticalHand cards={cards} cards_left={cards_left} accessible={accessible} side={true} />
  );
}

export function RightHand({cards, cards_left, accessible}: {cards?: Card[], cards_left: number, accessible: boolean}) {
  return (
    <VerticalHand cards={cards} cards_left={cards_left} accessible={accessible} side={false} />
  );
}
export default HorizontalHand;
