import { useEffect, useRef, useState } from "react";
import HorizontalCard from "./cards";
import { Card } from "@/app/game/gameModels";

const maxDynamicWidth = 1024;
const overlap = 0.5;

function HorizontalHand({ cards }: { cards: Card[] }) {
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
          <HorizontalCard
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

export default HorizontalHand;
