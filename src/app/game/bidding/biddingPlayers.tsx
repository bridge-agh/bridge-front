import {
  PlayerDirection
} from "@/game_engine/gameModels";
import { useContext } from "react";
import { FaAngleDown } from "react-icons/fa";
import { twMerge } from "tailwind-merge";
import { BiddingContext } from "./biddingPage";


const selectedTip = "Current player";
const winnerTip = "Actual declarer";

function BiddingPlayers() {

  const bidding = useContext(BiddingContext);

  return (
    <div className="grid grid-cols-4 justify-center gap-4 mb-4">
      {Object.keys(PlayerDirection)
        .filter((key) => isNaN(Number(key)))
        .map((directionValue) => {
          const playerDirection: PlayerDirection = PlayerDirection[directionValue as keyof typeof PlayerDirection];

          const isSelected = playerDirection.valueOf() === bidding.currentPlayer.valueOf();
          const isWinner = bidding.observation.declarer && (bidding.observation.declarer.valueOf() === playerDirection.valueOf());

          return (
            <div key={playerDirection} className="flex flex-col">
              <div className="h-5">
                {playerDirection === bidding.userDirection ?
                  <span data-tip="You" className="tooltip w-full">
                    <FaAngleDown size={"1.5rem"} className="mx-auto text-yellow-600" />
                  </span>
                  : ""}
              </div>
              <div
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
            </div>
          );
        })}
    </div>
  );
}

export default BiddingPlayers;
