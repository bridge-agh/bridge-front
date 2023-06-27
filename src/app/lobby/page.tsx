"use client";

import { useCallback } from "react";
import Link from "next/link";
import { useGetLobby, useFindLobby } from "@/api/lobby";
import protectRoute from "@/logic/protect_route";
import useUserUid from "@/logic/use_user_uid";

function Player({ name }: { name: string }) {
  return (
    <div className="flex flex-row pe-2 rounded-3xl justify-start items-center bg-base-100">
      <div className="w-14 h-14 rounded-full bg-blue-600 me-3 flex flex-col justify-center items-center">
        <div>YOU</div>
      </div>
      <div className="text-lg font-bold">{name}</div>
    </div>
  );
}

function Lobby() {
  const { uid: userUid } = useUserUid();
  const [lobbyId, findLobbyLoading, findLobbyError] = useFindLobby(userUid);
  const [lobby, getLobbyLoading, getLobbyError] = useGetLobby(lobbyId);

  const handleCopyClick = useCallback(() => {
    navigator.clipboard.writeText(lobbyId);
  }, [lobbyId]);

  if (getLobbyError) {
    console.log(getLobbyError);
    return <div>Error</div>;
  }

  if (!lobby) {
    return <div>Loading...</div>;
  }

  return (
    <div className="col-start-1 col-span-4 sm:col-start-2 sm:col-span-4 lg:col-start-3 lg:col-span-4 xl:col-start-5 xl:col-span-4">
      <div className="rounded-xl bg-base-200 p-5 flex flex-col justify-start items-stretch">
        <div className="text-2xl font-bold mb-3 self-center">Lobby</div>
        <div className="flex flex-row justify-between items-center mb-3">
          <div className="flex flex-col justify-start items-stretch me-16 gap-4">
            <Player name={lobby.users[0] || "Waiting..."} />
            <Player name={lobby.users[1] || "Waiting..."} />
          </div>
          <div className="flex flex-col justify-start items-stretch gap-4">
            <Player name={lobby.users[2] || "Waiting..."} />
            <Player name={lobby.users[3] || "Waiting..."} />
          </div>
        </div>
        <div className="flex flex-row justify-between items-center">
          <Link href="/home" className="btn btn-link text-error">
            Leave
          </Link>
          <button className="btn btn-primary" onClick={handleCopyClick}>
            Copy ID
          </button>
          <Link href="/game" className="btn btn-primary">
            Start
          </Link>
        </div>
      </div>
    </div>
  );
}

export default protectRoute(Lobby);
