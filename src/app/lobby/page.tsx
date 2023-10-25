"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { useFindSession } from "@/api/session";
import { useGetLobby, useLeaveLobby, useReady, useForceSwap, Player, GetInfoResponse } from "@/api/session/lobby";
import protectRoute from "@/logic/protect_route";
import useUser from "@/logic/use_user";
import { TiDelete } from "react-icons/ti";
import { BsPersonCircle, BsQuestionCircle } from "react-icons/bs";
import { FaExchangeAlt } from "react-icons/fa";
import { twMerge } from "tailwind-merge";
import { PlayerDirection, getPlayerDirectionName } from "../game/gameModels";


function Player({ player, userId, host, position, addPositionToSwap, positionsToSwap }: { player: Player | undefined | null, userId: string, host: Player | undefined, position: PlayerDirection, addPositionToSwap: (position: PlayerDirection) => void, positionsToSwap: PlayerDirection[]}) {
  const [nameText, setNameText] = useState(player?.id);
  const [isPlayer, setIsPlayer] = useState(false);
  const [animation, setAnimation] = useState("");
  const [exchangeButtonHovered, setExchangeButtonHovered] = useState(false);


  const changeNameText = useCallback((newName: string) => {
    if (nameText == null) setNameText(newName);
    else if (nameText != newName) {
      setAnimation("animate-fade-in");
      setTimeout(() => {
        setNameText(newName);
        setAnimation("animate-fade-out");
      }, 300);
    }  
  }, [nameText]);
  
  useEffect(() => {
    if (player != null && player != undefined) {
      changeNameText(player.id);
      setIsPlayer(true);
    }
    else {
      changeNameText("Waiting...");
      setIsPlayer(false);
    }
  }, [player, changeNameText]);

  return (
    <div 
      className="flex flex-col justify-start items-start items-stretch min-w-[100%]"
    >
      <div className="font-bold text-accent-content w-11 xs:w-14 text-center text-sm xs:text-base">{getPlayerDirectionName(position)}</div>
      <div className={twMerge("flex flex-row pe-2 rounded-full justify-start items-center bg-base-300 w-[100%] transition-all", exchangeButtonHovered ? "ring-4 ring-primary" : "", position == positionsToSwap[0] && !host?.ready ? "ring-4 ring-accent": "")}>
        <div className={`w-11 h-11 xs:w-14 xs:h-14 rounded-full duration-500 ${player?.ready ? "bg-green-600" : "bg-blue-600"} flex flex-col justify-center items-center`}>
          {isPlayer &&
          <BsPersonCircle 
            className="w-11 h-11 xs:w-14 xs:h-14"
          /> || 
          <BsQuestionCircle className="w-11 h-11 xs:w-14 xs:h-14 "/>}
        </div>
   
        <div
          className={twMerge("ml-2 font-semibold xs:text-lg xs:font-bold truncate hover:break-all hover:whitespace-normal")}
        >
          <span className={twMerge(animation)}>{nameText}</span>
        </div>

        {userId == host?.id && (isPlayer || positionsToSwap.length > 0 && !host?.ready) && (
          <FaExchangeAlt 
            className={twMerge("w-[15px] h-[15px] xs:w-[22px] xs:h-[22px] ml-auto shrink-0 justify-self-end animate-fade-out", host?.ready ? "opacity-50" : "cursor-pointer")}
            onClick={() => {if (!host?.ready) addPositionToSwap(position);}}
            onMouseEnter={() => {if (!host?.ready) setExchangeButtonHovered(true);}}
            onMouseLeave={() => {if (!host?.ready) setExchangeButtonHovered(false);}}
            onAnimationStart={() => {if (!host?.ready) setExchangeButtonHovered(false);}}
          />
        )}        
        {player?.id != userId && userId == host?.id && isPlayer && (
          <TiDelete className="w-[20px] h-[20px] xs:w-[25px] xs:h-[25px] ml-2 shrink-0 justify-self-end text-error cursor-pointer"/>
        )}
      </div>
    </div>
  );
}

function Lobby() {
  const router = useRouter();
  const { user } = useUser();
  const findSession = useFindSession(user ? { user_id: user.uid } : undefined);
  let getLobby = useGetLobby(findSession.data ? { session_id: findSession.data.session_id } : undefined);
  const leaveLobby = useLeaveLobby();
  const setReady = useReady();  
  const forceSwap = useForceSwap();
  const [positionsToSwap, setPositionsToSwap] = useState<PlayerDirection[]>([]);

  const goHome = useCallback(() => {
    router.push("/home");
  }, [router]);

  const handleCopyClick = useCallback(() => {
    if (!findSession.data) return;
    navigator.clipboard.writeText(findSession.data.session_id);
  }, [findSession]);

  const handleLeaveClick = useCallback(() => {
    if (!findSession.data || !user || leaveLobby.loading) return;
    leaveLobby.trigger({ user_id: user.uid, session_id: findSession.data.session_id }).then(goHome);
  }, [leaveLobby, findSession, goHome, user]);

  const handleReadyClick = useCallback(() => {
    if (!findSession.data || !user || setReady.loading) return;
    setReady.trigger({ user_id: user.uid, session_id: findSession.data.session_id });
  }, [findSession.data, user, setReady]);

  const handleForceSwap = useCallback(() => {
    if (!findSession.data || !user || forceSwap.loading || positionsToSwap.length != 2) return;
    forceSwap.trigger({ first_position: positionsToSwap[0], second_position: positionsToSwap[1], session_id: findSession.data.session_id });
  }, [findSession.data, user, forceSwap, positionsToSwap]);

  const addPositionToSwap = useCallback((position: PlayerDirection) => {
    setPositionsToSwap((positions) => {
      const newPositions = [...positions];
      if (newPositions.length < 2) newPositions.push(position);
      return newPositions;
    });
  }, []);

  useEffect(() => {
    router.prefetch("/game");
  }, [router]);

  useEffect(() => {
    if (getLobby.data && getLobby.data.users.length === 4 && getLobby.data.users.every(u => u.ready)) {
      router.push("/game");
    }
  }, [router, getLobby]);

  useEffect(() => {
    if (positionsToSwap.length == 2) {
      if (positionsToSwap[0] != positionsToSwap[1]) handleForceSwap();
      setPositionsToSwap([]);
    }
  }, [positionsToSwap, handleForceSwap]);

  if (!getLobby.data || !user) return null;
  
  const lobby = getLobby.data;
  const currentUser = lobby.users.find(u => u.id === user.uid);
  const host = lobby.users.find(u => u.id == lobby.host_id);
  return (
    <div className="col-start-1 col-span-4 sm:col-start-2 sm:col-span-4 md:col-start-1 md:col-span-6 lg:col-start-2 lg:col-span-6 xl:col-start-4 xl:col-span-6">
      <div className="rounded-xl bg-base-200 p-5 flex flex-col justify-start items-stretch">
        <div className="text-2xl font-bold mb-3 self-center">Lobby</div>
        <div className="flex flex-col gap-4 md:flex-row justify-between items-center mb-3">
          <div className="flex w-[90%] sm:w-[70%] md:w-[43%] flex-col justify-start items-stretch gap-4">
            <Player player={lobby.users.find(u => u.position == PlayerDirection.NORTH)} userId={user.uid} host={host} position={PlayerDirection.NORTH} addPositionToSwap={addPositionToSwap} positionsToSwap={positionsToSwap} />
            <Player player={lobby.users.find(u => u.position == PlayerDirection.SOUTH)} userId={user.uid} host={host} position={PlayerDirection.SOUTH} addPositionToSwap={addPositionToSwap} positionsToSwap={positionsToSwap} />
          </div>
          <div className="flex w-[90%] sm:w-[70%] md:w-[43%] flex-col justify-start items-stretch gap-4">
            <Player player={lobby.users.find(u => u.position == PlayerDirection.WEST)} userId={user.uid} host={host} position={PlayerDirection.WEST} addPositionToSwap={addPositionToSwap} positionsToSwap={positionsToSwap} />
            <Player player={lobby.users.find(u => u.position == PlayerDirection.EAST)} userId={user.uid} host={host} position={PlayerDirection.EAST} addPositionToSwap={addPositionToSwap} positionsToSwap={positionsToSwap} />
          </div>
        </div>
        <div className="flex flex-row justify-evenly sm:justify-between items-center">
          <button className="btn btn-xs btn-link text-error text-xs xs:btn-sm sm:btn-md" onClick={handleLeaveClick}>
            Leave
          </button>
          <button className="btn btn-xs btn-primary xs:btn-sm sm:btn-md" onClick={handleCopyClick}>
            Copy ID
          </button>
          <button className="btn btn-xs btn-primary xs:btn-sm sm:btn-md" disabled={currentUser?.ready} onClick={handleReadyClick}>
            Ready
          </button>
        </div>
      </div>
    </div>
  );
}

export default protectRoute(Lobby);
