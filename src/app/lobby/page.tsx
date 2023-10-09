"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect } from "react";
import { useFindSession } from "@/api/session";
import { useGetLobby, useLeaveLobby, useReady } from "@/api/session/lobby";
import protectRoute from "@/logic/protect_route";
import useUser from "@/logic/use_user";

function Player({ name, ready }: { name: string, ready: boolean }) {
  return (
    <div className="flex flex-row pe-2 rounded-3xl justify-start items-center bg-base-100">
      <div className={`w-14 h-14 rounded-full ${ready ? "bg-green-600" : "bg-blue-600"} me-3 flex flex-col justify-center items-center`}>
        <div>YOU</div>
      </div>
      <div className="text-lg font-bold">{name.slice(0, 8)}...</div>
    </div>
  );
}

function Lobby() {
  const router = useRouter();
  const { user } = useUser();
  const findSession = useFindSession(user ? { user_id: user.uid } : undefined);
  const getLobby = useGetLobby(findSession.data ? { session_id: findSession.data.session_id } : undefined);
  const leaveLobby = useLeaveLobby();
  const setReady = useReady();

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
  }, [setReady, findSession, user]);

  useEffect(() => {
    router.prefetch("/game");
  }, [router]);

  useEffect(() => {
    if (getLobby.data && getLobby.data.users.length === 4 && getLobby.data.ready.every(x => x)) {
      console.log(getLobby);
      router.push("/game");
    }
  }, [router, getLobby]);

  if (!getLobby.data || !user) return null;

  const lobby = getLobby.data;
  const myIndex = lobby.users.indexOf(user.uid);

  return (
    <div className="col-start-1 col-span-4 sm:col-start-2 sm:col-span-4 lg:col-start-3 lg:col-span-4 xl:col-start-5 xl:col-span-4">
      <div className="rounded-xl bg-base-200 p-5 flex flex-col justify-start items-stretch">
        <div className="text-2xl font-bold mb-3 self-center">Lobby</div>
        <div className="flex flex-row justify-between items-center mb-3">
          <div className="flex flex-col justify-start items-stretch me-16 gap-4">
            <Player name={lobby.users[0] || "Waiting..."} ready={lobby.ready[0]} />
            <Player name={lobby.users[1] || "Waiting..."} ready={lobby.ready[1]} />
          </div>
          <div className="flex flex-col justify-start items-stretch gap-4">
            <Player name={lobby.users[2] || "Waiting..."} ready={lobby.ready[2]} />
            <Player name={lobby.users[3] || "Waiting..."} ready={lobby.ready[3]} />
          </div>
        </div>
        <div className="flex flex-row justify-between items-center">
          <button className="btn btn-link text-error" onClick={handleLeaveClick}>
            Leave
          </button>
          <button className="btn btn-primary" onClick={handleCopyClick}>
            Copy ID
          </button>
          <button className="btn btn-primary" disabled={lobby.ready[myIndex]} onClick={handleReadyClick}>
            Ready
          </button>
        </div>
      </div>
    </div>
  );
}

export default protectRoute(Lobby);
