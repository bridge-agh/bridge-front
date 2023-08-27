import { PlayerDirection } from "@/app/game/gameModels";
import { GameCard } from "./gameCard";

export default function GameDeck({
  direction,
  count
}: {
  direction: PlayerDirection;
  count: number;
}) {
  const x = 0;
  const y = -1.15;
  const z = 0;

  const scale = 0.85;

  const cardWidth = 0.57 * scale;
  const cardSpacing = 0.05;
  const cardXOffset = cardWidth + cardSpacing;
  const cardX = x - (cardXOffset * count) / 2 + cardXOffset / 2;

  return (
    <>
      {Array.from(Array(count).keys()).map((i) => {
        return <GameCard x={cardX + i * cardXOffset} y={y} z={z} key={i} scale={scale}/>;
      })}
    </>
  );
}
