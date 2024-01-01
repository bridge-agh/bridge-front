"use client";

import { useSessionInfo } from "@/api/session";
import { PlayerDirection, getPlayerDirectionName } from "@/game_engine/gameModels";
import protectRoute from "@/logic/protect_route";
import useUser from "@/logic/use_user";
import { useRouter } from "next/navigation";
import { twMerge } from "tailwind-merge";
import { suitToSymbol } from "../game/bidding/biddingBids";

function Results() {

  const router = useRouter();
  const sessionInfo = useSessionInfo();
  const user = useUser();

  if (!sessionInfo.data || !user) return null;


  const users = sessionInfo.data?.users;  
  const player = users.find(u => u.id == user.user?.uid);
  let result;
  
  if (player!.position in [PlayerDirection.NORTH, PlayerDirection.SOUTH]) result = sessionInfo.data.gameState?.game.tricks.NS.length;
  else result = sessionInfo.data.gameState?.game.tricks.NS.length; 

  const bid = sessionInfo.data.gameState?.bidding.bid;

  const teamDirections = (directions: PlayerDirection[], reverse: boolean) => {
    return (
      <div className="flex flex-col items-center justify-between w-[95%] md:w-[45%]" key={directions.map(p => p.toString()).join()}>
        {directions.map(direction => (
          <div className={twMerge("flex", reverse ? "flex-row-reverse" : "flex-row", "items-center justify-between w-[95%] ms:w-[75%]")} key={direction}>
            <div className={twMerge("text-accent-content text-sm xs:text-base font-bold", reverse ? "ml-8" : "mr-8")}>{getPlayerDirectionName(direction)}</div>
            <div className="font-semibold xs:font-bold truncate ">
              {users.filter(u => u.position == direction).map(u => u.id)}
            </div>
          </div>
        ))}                
      </div>
    );
  };

  return (                                   
    <div className="col-start-1 col-span-4 sm:col-start-2 sm:col-span-4 md:col-start-1 md:col-span-6 lg:col-start-2 lg:col-span-6 xl:col-start-4 xl:col-span-6">
      <div className="rounded-xl bg-base-200 p-5 flex flex-col justify-start items-stretch">
        <div className="text-2xl font-bold mb-5 text-center">{result ? (result >= 7 ? "Victory!" : "Defeat") : "Playing"}</div>
        <div className="flex flex-col md:flex-row justify-center items-center w-[100%] mb-6">        
          {teamDirections([PlayerDirection.NORTH, PlayerDirection.SOUTH], false)}
          <div className="text-2xl font-bold self-center my-6" key={0}>VS</div>
          {teamDirections([PlayerDirection.EAST, PlayerDirection.WEST], true)}
        </div>
        <div className="text-lg font-bold mb-6 self-center">Declarer: {sessionInfo.data.gameState?.bidding.declarer}</div> 

        <div className="flex flex-row gap-1 bid-history transition-all mb-6 text-lg self-center">
          <span className="font-bold">Trump:</span>
          <span>{bid?.tricks}</span>
          {bid ? <div className="w-6 h-6 flex flex-col justify-center fill-neutral">
            {suitToSymbol(bid.suit)}
          </div> : ""}
        </div>

        <div className="text-2xl font-bold mb-8 self-center">Won tricks: {result}/13</div>
        <div className="flex flex-row justify-center items-center">
          <button className="btn btn-xs btn-primary xs:btn-sm sm:btn-md" onClick={() => router.push("/lobby")}>
            Lobby
          </button>
        </div>
      </div>
    </div>
  );


}

export default protectRoute(Results);
