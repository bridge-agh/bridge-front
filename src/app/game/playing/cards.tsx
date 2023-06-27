import { Card, CardSuit } from "../gameModels";
import cardToComponent from "@/components/cards/cards";
import Back from "@/components/cards/cards/Back";
import { twMerge } from "tailwind-merge";

function HorizontalCard({
  card,
  index,
  cards_left,
  overlap, // must be between 0 and 1
  accessible,
  parentWidth,
}: {
  card?: Card;
  index: number;
  cards_left: number;
  overlap: number;
  accessible: boolean;
  parentWidth: number;
}) {
  const scale = parentWidth / (12 * overlap + 1);

  const width = scale;
  const height = (3.5 / 2.25) * scale;

  const shift = ((cards_left - 1) * width * overlap + width) / 2;
  const left = index * width * overlap - shift;

  const CardComponent:
    | React.FC<{
        className?: string;
        background: string;
        fill: string;
      }>
    | undefined = cardToComponent(card!);

  return (
    <div
      className={twMerge("absolute", card && accessible ? "player-card-hover cursor-pointer" : "cursor-default")}
      style={{ left: `${left}px`, width: `${width}px`, height: `${height}px` }}
    >
      {(CardComponent && (
        <CardComponent
          className="player-card"
          background="#20252e"
          fill={
            card!.suit == CardSuit.DIAMONDS || card!.suit == CardSuit.HEARTS
              ? "#ff3838"
              : "#e3e3e3"
          }
        />
      )) || <Back className="player-card" fill="#20252e" />}
    </div>
  );
}


export function VerticalCard({
  card,
  index,
  cards_left,
  overlap, // must be between 0 and 1
  accessible,
  parentHeight,
  side
}: {
  card?: Card;
  index: number;
  cards_left: number;
  overlap: number;
  accessible: boolean;
  parentHeight: number;
  side: boolean;
}) {
  const scale = parentHeight / (12 * overlap + 1);

  const width = scale;
  const height = (3.5 / 2.25) * scale;
  

  const shift = ((cards_left - 1) * width * overlap + width) / 2;
  const left = index * width * overlap - shift;

  const CardComponent:
    | React.FC<{
        className?: string;
        background: string;
        fill: string;
      }>
    | undefined = cardToComponent(card!);

  return (
    <div
      className={twMerge("absolute", card && accessible ? "player-card-hover cursor-pointer" : "cursor-default", side ? "rotate-90" : "rotate-[-90deg]" )}
      style={{ top: `${left}px`, width: `${width}px`, height: `${height}px`, translate: `-${width/2}px -${width*overlap/2}px` }}
    >
      {(CardComponent && (
        <CardComponent
          className="player-card"
          background="#20252e"
          fill={
            card!.suit == CardSuit.DIAMONDS || card!.suit == CardSuit.HEARTS
              ? "#ff3838"
              : "#e3e3e3"
          }
        />
      )) || <Back className="player-card" fill="#20252e" />}
    </div>
  );
}

export default HorizontalCard;
