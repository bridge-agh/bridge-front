"use client";

import { useSessionInfo, useSetAssistantLevel } from "@/api/session";
import protectRoute from "@/logic/protect_route";
import useUser from "@/logic/use_user";
import Link from "next/link";
import { useCallback, useState } from "react";
import { FaRegStar, FaStar } from "react-icons/fa";

function AssistantPower() {
  
  const { user } = useUser();
  const sessionInfo = useSessionInfo();
  const setAssistantLevel = useSetAssistantLevel();

  const [power, setPower] = useState(sessionInfo.data?.assistantLevel || 0);
  const [stars, setStars] = useState(Array(5).fill(false));

  const handleSetAssistantLevel = useCallback(() => {
    if (setAssistantLevel.loading) return;
    setAssistantLevel.trigger({level: power + 1});
  }, [power, setAssistantLevel]);

  const setPowerLevel = (level: number, set: boolean) => {
    const newStars = [...stars];
    for (let i = 0; i < newStars.length; i++) {
      if (i <= level) newStars[i] = true;
      else newStars[i] = false;
    }
    setStars(newStars);
    if (set) {
      setPower(level);
      handleSetAssistantLevel();
    };
  };

  if (!sessionInfo.data || !user || user.uid != sessionInfo.data.hostId) return null;

  return (
    <div className="col-start-1 col-span-4 sm:col-start-2 sm:col-span-4 md:col-start-1 md:col-span-6 lg:col-start-2 lg:col-span-6 xl:col-start-4 xl:col-span-6">
      <div className="rounded-xl bg-base-200 p-5 flex flex-col justify-start items-stretch">
        <div className="text-2xl font-bold mb-3 self-center text-center">AI Power</div>
        <div className="self-center text-center mb-2">Current power level: {power+ 1}</div>
        <div className="flex flex-row items-center justify-center w-[100%] ms:w-[70%] mx-auto mb-6">
          {stars.map((filled, i) => filled ?  
            <FaStar 
              key={i}
              className="w-[85px] h-[100px] text-yellow-500 hover:cursor-pointer"
              onClick={() => setPowerLevel(i, true)}
              onPointerOver={() => setPowerLevel(i, false)}
              onPointerOut={() => setPowerLevel(power, false)}
            /> :
            <FaRegStar 
              key={i}
              className="w-[85px] h-[100px] text-yellow-500 hover:cursor-pointer"
              onClick={() => setPowerLevel(i, true)}
              onPointerOver={() => setPowerLevel(i, false)}
              onPointerOut={() => setPowerLevel(power, false)}
            />)
          }
        </div>
        <div className="w-full flex flex-row justify-center">
          <Link
            href={sessionInfo.data.gameState != null ? "/game" : "/lobby"}
            className="btn btn-xs btn-primary xs:btn-sm sm:btn-md">
            Go back
          </Link>
        </div>
        
      </div>
    </div>
   
  );
}


export default protectRoute(AssistantPower);
