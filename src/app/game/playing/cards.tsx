import { Card, CardSuit } from "../gameModels";
import cardToComponent from "@/components/cards/cards";

function HorizontalCard({
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

export default HorizontalCard;