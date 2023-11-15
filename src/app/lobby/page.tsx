"use client";

import { useForceSwap, useReady } from "@/api/session/lobby";
import { Player, useSessionInfo, useLeaveSession } from "@/api/session";
import protectRoute from "@/logic/protect_route";
import useUser from "@/logic/use_user";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { BsPersonCircle, BsQuestionCircle } from "react-icons/bs";
import { FaExchangeAlt } from "react-icons/fa";
import { TiDelete } from "react-icons/ti";
import { twMerge } from "tailwind-merge";
import { PlayerDirection, getPlayerDirectionName } from "@/game_engine/gameModels";


function Player({ player, userId, host, position, addPositionToSwap, positionsToSwap }: { player: Player | undefined | null, userId: string, host: Player | undefined, position: PlayerDirection, addPositionToSwap: (position: PlayerDirection) => void, positionsToSwap: PlayerDirection[] }) {
  const [nameText, setNameText] = useState(player?.id);
  const [isPlayer, setIsPlayer] = useState(false);
  const [animation, setAnimation] = useState("");
  const [exchangeButtonHovered, setExchangeButtonHovered] = useState(false);
  const [kickButtonHovered, setKickButtonHovered] = useState(false);

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
      <div className="font-bold text-accent-content w-11 xs:w-14 text-center text-sm xs:text-base mb-1">{getPlayerDirectionName(position)}</div>
      <div className={twMerge("flex flex-row pe-2 rounded-full justify-start items-center bg-base-300 w-[100%] transition-all", exchangeButtonHovered ? "ring-4 ring-primary" : "", position == positionsToSwap[0] && !host?.ready ? "ring-4 ring-accent" : "", kickButtonHovered ? "ring-4 ring-error" : "" )}>
        <div className={`w-11 h-11 xs:w-14 xs:h-14 rounded-full duration-500 ${player?.ready ? "bg-green-600" : "bg-blue-600"} flex flex-col justify-center items-center`}>
          {isPlayer &&
            <BsPersonCircle
              className="w-11 h-11 xs:w-14 xs:h-14"
            /> ||
            <BsQuestionCircle className="w-11 h-11 xs:w-14 xs:h-14 " />}
        </div>

        <div
          className={twMerge("ml-2 font-semibold xs:text-lg xs:font-bold truncate hover:break-all hover:whitespace-normal")}
        >
          <span className={twMerge(animation)}>{nameText}</span>
        </div>

        {userId == host?.id && (isPlayer || positionsToSwap.length > 0 && !host?.ready) && (
          <FaExchangeAlt
            className={twMerge(animation, "w-[15px] h-[15px] xs:w-[22px] xs:h-[22px] ml-auto shrink-0 justify-self-end", host?.ready ? "opacity-50" : "cursor-pointer")}
            onClick={() => { if (!host?.ready) addPositionToSwap(position); }}
            onMouseEnter={() => { if (!host?.ready) setExchangeButtonHovered(true); }}
            onMouseLeave={() => { if (!host?.ready) setExchangeButtonHovered(false); }}
            onAnimationStart={() => { if (!host?.ready) setExchangeButtonHovered(false); }}
          />
        )}
        {player?.id != userId && userId == host?.id && isPlayer && (
          <TiDelete 
            className="w-[20px] h-[20px] xs:w-[25px] xs:h-[25px] ml-2 shrink-0 justify-self-end text-error cursor-pointer animate-fade-out"
            onMouseEnter={() => { if (!host?.ready) setKickButtonHovered(true); }}
            onMouseLeave={() => { if (!host?.ready) setKickButtonHovered(false); }}
          />
        )}
      </div>
    </div>
  );
}

function Lobby() {
  const router = useRouter();
  const { user } = useUser();
  const sessionInfo = useSessionInfo();
  const leaveSession = useLeaveSession();
  const setReady = useReady();
  const forceSwap = useForceSwap();
  const [positionsToSwap, setPositionsToSwap] = useState<PlayerDirection[]>([]);

  const goHome = useCallback(() => {
    router.push("/home");
  }, [router]);

  const handleCopyClick = useCallback(() => {
    if (!sessionInfo.data) return;
    navigator.clipboard.writeText(sessionInfo.data.sessionId);
  }, [sessionInfo.data]);

  const handleLeaveClick = useCallback(() => {
    if (leaveSession.loading) return;
    leaveSession.trigger(undefined).then(goHome);
  }, [leaveSession, goHome]);

  const handleReadyClick = useCallback(() => {
    if (setReady.loading) return;
    setReady.trigger({ ready: true });
  }, [setReady]);

  const handleForceSwap = useCallback(() => {
    if (forceSwap.loading || positionsToSwap.length != 2) return;
    forceSwap.trigger({ first: positionsToSwap[0], second: positionsToSwap[1] });
  }, [forceSwap, positionsToSwap]);

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
    if (sessionInfo.data && sessionInfo.data.users.length === 4 && sessionInfo.data.users.every(u => u.ready)) {
      router.push("/game");
    }
  }, [router, sessionInfo.data]);

  useEffect(() => {
    if (positionsToSwap.length == 2) {
      if (positionsToSwap[0] != positionsToSwap[1]) handleForceSwap();
      setPositionsToSwap([]);
    }
  }, [positionsToSwap, handleForceSwap]);

  if (!sessionInfo.data || !user) return null;

  const lobby = sessionInfo.data;
  const currentUser = lobby.users.find(u => u.id === user.uid);
  const host = lobby.users.find(u => u.id == lobby.hostId);
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
            <Player player={lobby.users.find(u => u.position == PlayerDirection.EAST)} userId={user.uid} host={host} position={PlayerDirection.EAST} addPositionToSwap={addPositionToSwap} positionsToSwap={positionsToSwap} />
            <Player player={lobby.users.find(u => u.position == PlayerDirection.WEST)} userId={user.uid} host={host} position={PlayerDirection.WEST} addPositionToSwap={addPositionToSwap} positionsToSwap={positionsToSwap} />
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
