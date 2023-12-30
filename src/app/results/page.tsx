"use client";

import { useSessionInfo } from "@/api/session";
import { GameStage, PlayerDirection, getPlayerDirectionName } from "@/game_engine/gameModels";
import protectRoute from "@/logic/protect_route";
import useUser from "@/logic/use_user";
import Link from "next/link";
import { useRouter } from "next/navigation";

function Results() {

  const router = useRouter();
  const sessionInfo = useSessionInfo();
  const user = useUser();

  if (!sessionInfo.data || !user) return null;

  // if (!sessionInfo.data.gameState) router.push("/lobby");
  // if (sessionInfo.data.started && sessionInfo.data.gameState?.base.game_stage != GameStage.SCORING) router.push("/game");

  const users = sessionInfo.data?.users;  
  const player = users.find(u => u.id == user.user?.uid);
  let result;
  
  if (player!.position in [PlayerDirection.NORTH, PlayerDirection.SOUTH]) result = sessionInfo.data.gameState?.game.tricks.NS.length;
  else result = sessionInfo.data.gameState?.game.tricks.NS.length; 

  if (!result) result = 0;

  return (                                   
    <div className="col-start-1 col-span-4 sm:col-start-2 sm:col-span-4 md:col-start-1 md:col-span-6 lg:col-start-2 lg:col-span-6 xl:col-start-4 xl:col-span-6">
      <div className="rounded-xl bg-base-200 p-5 flex flex-col justify-start items-stretch">
        <div className="text-2xl font-bold mb-5 self-center">{result >= 7 ? "Victory!" : "Defeat"}</div>
        <div className="flex flex-col md:flex-row justify-center items-center w-[100%] mb-6">        
          {[[PlayerDirection.NORTH, PlayerDirection.SOUTH], [], [PlayerDirection.EAST, PlayerDirection.WEST]].map(positions => {
            if (positions.length == 0) return <div className="text-2xl font-bold self-center" key={0}>VS</div>;
            else return (
              <div className="flex flex-col items-center justify-between w-[95%] md:w-[50%]" key={positions.map(p => p.toString()).join()}>
                {positions.map(position => (
                  <div className="flex flex-row items-center justify-between w-[75%]" key={position}>
                    <div className="text-accent-content text-sm xs:text-base font-bold mr-8">{getPlayerDirectionName(position)}</div>
                    <div className="font-semibold xs:font-bold truncate ">
                      {users.filter(u => u.position == position).map(u => u.id)}
                    </div>
                  </div>
                ))}                
              </div>
            );
          })}
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
