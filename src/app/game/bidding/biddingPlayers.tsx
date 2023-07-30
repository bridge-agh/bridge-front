import {
  BaseObservation,
  BiddingObservation,
  PlayerDirection,
} from "@/app/game/gameModels";
import { twMerge } from "tailwind-merge";

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
          const playerDirection: PlayerDirection =
            PlayerDirection[directionValue as keyof typeof PlayerDirection];
          return (
            <div
              key={playerDirection}
              className={twMerge(
                "avatar placeholder transition ease-in-out ring-primary rounded-full",

                playerDirection.valueOf() ===
                  baseObservation.current_player.valueOf()
                  ? "scale-125 ring-2 bg-base-200 text-base-content"
                  : "scale-100 ring-0 bg-neutral-focus text-neutral-content",
                biddingObservation.declarer && (biddingObservation.declarer.valueOf() ===
                  playerDirection.valueOf())
                  ? "bg-accent text-neutral-focus"
                  : ""
              )}
            >
              <div className="rounded-full w-12">
                <span className="text-xl">{directionValue[0]}</span>
              </div>
            </div>
          );
        })}
    </div>
  );
}

export default BiddingPlayers;
