"use client";

import { useForceSwap, useReady, usePromoteHost } from "@/api/session/lobby";
import { useSessionInfo, useLeaveSession } from "@/api/session";
import protectRoute from "@/logic/protect_route";
import useUser from "@/logic/use_user";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import PlayersPanel from "./playersPanel";


function Lobby() {
  const router = useRouter();
  const { user } = useUser();
  const sessionInfo = useSessionInfo();
  const leaveSession = useLeaveSession();
  const setReady = useReady();
  
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

  useEffect(() => {
    router.prefetch("/game");
  }, [router]);

  useEffect(() => {
    if (sessionInfo.data && sessionInfo.data.users.length === 4 && sessionInfo.data.users.every(u => u.ready)) {
      router.push("/game");
    }
  }, [router, sessionInfo.data]);

  if (!sessionInfo.data || !user) return null;

  const lobby = sessionInfo.data;
  const currentUser = lobby.users.find(u => u.id === user.uid);
  const host = lobby.users.find(u => u.id == lobby.hostId);

  if (sessionInfo.data && sessionInfo.data.users.length === 4 && sessionInfo.data.users.every(u => u.ready)) {
    router.push("/game");
    return null;
  }
  return (                                   
    <div className="col-start-1 col-span-4 sm:col-start-2 sm:col-span-4 md:col-start-1 md:col-span-6 lg:col-start-2 lg:col-span-6 xl:col-start-4 xl:col-span-6">
      <div className="rounded-xl bg-base-200 p-5 flex flex-col justify-start items-stretch">
        <div className="text-2xl font-bold mb-3 self-center">Lobby</div>
        <PlayersPanel players={lobby.users} userId={user.uid} host={host} />
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
