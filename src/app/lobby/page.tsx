"use client";

import { useCallback } from "react";
import { useFindSession } from "@/api/session";
import { useGetLobby, useLeaveLobby, useReady } from "@/api/session/lobby";
import protectRoute from "@/logic/protect_route";
import useUserUid from "@/logic/use_user_uid";

function Player({ name }: { name: string }) {
  return (
    <div className="flex flex-row pe-2 rounded-3xl justify-start items-center bg-base-100">
      <div className="w-14 h-14 rounded-full bg-blue-600 me-3 flex flex-col justify-center items-center">
        <div>YOU</div>
      </div>
      <div className="text-lg font-bold">{name.slice(0, 8)}...</div>
    </div>
  );
}

function Lobby() {
  const { uid: userUid } = useUserUid();
  const findSession = useFindSession(userUid);
  const getLobby = useGetLobby(findSession.data?.session_id);
  const leaveLobby = useLeaveLobby();
  const setReady = useReady();

  const handleCopyClick = useCallback(() => {
    if (findSession.data === undefined) return;
    navigator.clipboard.writeText(findSession.data.session_id);
  }, [findSession]);

  const handleLeaveClick = useCallback(() => {
    if (findSession.data === undefined || userUid === undefined) return;
    leaveLobby.trigger({ user_id: userUid, session_id: findSession.data.session_id });
  }, [leaveLobby, findSession, userUid]);

  const handleReadyClick = useCallback(() => {
    if (findSession.data === undefined || userUid === undefined) return;
    setReady.trigger({ user_id: userUid, session_id: findSession.data.session_id });
  }, [setReady, findSession, userUid]);

  if (findSession.loading || getLobby.loading) {
    return <div>Loading...</div>;
  }

  if (getLobby.error !== null || findSession.error !== null) {
    console.log(findSession);
    console.log(getLobby);
    console.log(getLobby.error || findSession.error);
    return <div>Error</div>;
  }

  if (getLobby.data === undefined || findSession.data === undefined) {
    return <div>Error fetching lobby</div>;
  }

  const lobby = getLobby.data;

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
          <button className="btn btn-link text-error" onClick={handleLeaveClick}>
            Leave
          </button>
          <button className="btn btn-primary" onClick={handleCopyClick}>
            Copy ID
          </button>
          <button className="btn btn-primary" onClick={handleReadyClick}>
            Ready
          </button>
        </div>
      </div>
    </div>
  );
}

export default protectRoute(Lobby);
