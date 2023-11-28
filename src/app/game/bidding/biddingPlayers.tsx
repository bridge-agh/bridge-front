import {
  BaseObservation,
  BiddingObservation,
  PlayerDirection,
} from "@/game_engine/gameModels";
import { twMerge } from "tailwind-merge";


const selectedTip = "Current player";
const winnerTip = "Actual declarer";

function BiddingPlayers({
  baseObservation,
  biddingObservation,
}: {
  baseObservation: BaseObservation;
  biddingObservation: BiddingObservation;
}) {
  return (
    <div className="flex flex-row justify-center gap-4">
      {Object.keys(PlayerDirection)
        .filter((key) => isNaN(Number(key)))
        .map((directionValue) => {
          const playerDirection: PlayerDirection = PlayerDirection[directionValue as keyof typeof PlayerDirection];

          const isSelected = playerDirection.valueOf() === baseObservation.current_player.valueOf();
          const isWinner = biddingObservation.declarer && (biddingObservation.declarer.valueOf() === playerDirection.valueOf());

          return (
            <div
              key={playerDirection}
              data-tip={isSelected ? selectedTip : isWinner ? winnerTip : ""}
              className={twMerge(
                "avatar placeholder transition ease-in-out ring-primary rounded-full select-none",

                isSelected
                  ? "scale-100 ring-2 bg-base-200 text-base-content tooltip"
                  : "scale-100 ring-0 bg-neutral-focus text-neutral-content",
                isWinner
                  ? "bg-accent text-neutral-focus tooltip"
                  : ""
              )}
            >
              <div className="rounded-full w-16">
                <span className="text-2xl">{directionValue[0]}</span>
              </div>
            </div>
          );
        })}
    </div>
  );
}

export default BiddingPlayers;
