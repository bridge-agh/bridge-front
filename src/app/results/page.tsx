"use client";

import { useSessionInfo } from "@/api/session";
import { PlayerDirection } from "@/game_engine/gameModels";
import protectRoute from "@/logic/protect_route";
import useUser from "@/logic/use_user";
import Link from "next/link";

function Results() {

  const sessionInfo = useSessionInfo();
  const user = useUser();
  // const results = useResults();

  if (!sessionInfo.data || !user) return null;

  const users = sessionInfo.data?.users;
  const north_south = users.filter(u => u.position in [PlayerDirection.NORTH, PlayerDirection.SOUTH]);
  const east_west = users.filter(u => u.position in [PlayerDirection.EAST, PlayerDirection.WEST]);
  const result = 7;


  return (                                   
    <div className="col-start-1 col-span-4 sm:col-start-2 sm:col-span-4 md:col-start-1 md:col-span-6 lg:col-start-2 lg:col-span-6 xl:col-start-4 xl:col-span-6">
      <div className="rounded-xl bg-base-200 p-5 flex flex-col justify-start items-stretch">
        <div className="text-2xl font-bold mb-5 self-center">{result >= 7 ? "Victory!" : "Defeat"}</div>
        <div className="flex flex-col md:flex-row justify-center items-center w-[100%] mb-6">        
          <div className="flex flex-col items-center justify-between w-[95%] md:w-[50%]">
            <div className="flex flex-row items-center justify-between w-[75%]">
              <div className="text-accent-content text-sm xs:text-base font-bold mr-8">North</div>
              <div className="font-semibold xs:font-bold truncate ">
                {users.filter(u => u.position == PlayerDirection.NORTH).map(u => u.id)}
              </div>
            </div>
            <div className="flex flex-row items-center justify-between w-[75%]">
              <div className="text-accent-content text-sm xs:text-base font-bold mr-8">South</div>
              <div className="font-semibold xs:font-bold truncate ">
                {users.filter(u => u.position == PlayerDirection.SOUTH).map(u => u.id)}
              </div>
            </div>
          </div>
          
          <div className="text-2xl font-bold self-center">VS</div>

          <div className="flex flex-col items-center justify-between w-[95%] md:w-[50%]">
            <div className="flex flex-row items-center justify-between w-[75%]">
              <div className="font-semibold xs:font-bold truncate ">
                {users.filter(u => u.position == PlayerDirection.EAST).map(u => u.id)}
              </div>
              <div className="text-accent-content text-sm xs:text-base font-bold ml-8">East</div>
            </div>
            <div className="flex flex-row items-center justify-between w-[75%]">
              <div className="font-semibold xs:font-bold truncate ">
                {users.filter(u => u.position == PlayerDirection.WEST).map(u => u.id)}
              </div>
              <div className="text-accent-content text-sm xs:text-base font-bold ml-8">West</div>
            </div>
          </div>
        </div>


        <div className="text-2xl font-bold mb-8 self-center">Won tricks: {result}/13</div>
        <div className="flex flex-row justify-center items-center">
          <Link className="btn btn-xs btn-primary xs:btn-sm sm:btn-md" href={"/home"}>
            Home
          </Link>
        </div>
      </div>
    </div>
  );


}

export default protectRoute(Results);
