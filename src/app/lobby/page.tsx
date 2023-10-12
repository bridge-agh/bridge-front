"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect } from "react";
import { useFindSession } from "@/api/session";
import { useGetLobby, useLeaveLobby, useReady } from "@/api/session/lobby";
import protectRoute from "@/logic/protect_route";
import useUser from "@/logic/use_user";
import { User } from "firebase/auth";
import { TiDelete } from "react-icons/ti";
import { BsPersonCircle, BsQuestionCircle } from "react-icons/bs";


function Player({ name, ready, role, lobby, user}: { name: string, ready: boolean, role: string, lobby: any, user: User}) {

  return (
    <div className="flex flex-col justify-start items-start items-stretch min-w-[100%]">
      <div className="font-bold text-accent-content w-11 xs:w-14 text-center text-sm xs:text-base">{role}</div>
      <div className="flex flex-row pe-2 rounded-3xl justify-start items-center bg-base-300 w-[100%]">
    
        <div className={`w-11 h-11 xs:w-14 xs:h-14 rounded-full ${ready ? "bg-green-600" : "bg-blue-600"} flex flex-col justify-center items-center shrink-0`}>
          {name != "Waiting..." &&
          <BsPersonCircle className="w-11 h-11 xs:w-14 xs:h-14" /> || 
          <BsQuestionCircle className="w-11 h-11 xs:w-14 xs:h-14 "/>}
        </div>
   
        <div className="ml-2 font-semibold xs:text-lg xs:font-bold truncate hover:break-all hover:whitespace-normal">{name}</div>
        {name != user.uid && user.uid == lobby.host_id && (
          <TiDelete className="w-[20px] h-[20px] xs:w-[25px] xs:h-[25px] ml-2 shrink-0 ml-auto justify-self-end text-error cursor-pointer"/>
        )}
      </div>
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
    <div className="col-start-1 col-span-4 sm:col-start-2 sm:col-span-4 md:col-start-1 md:col-span-6 lg:col-start-2 lg:col-span-6 xl:col-start-4 xl:col-span-6">
      <div className="rounded-xl bg-base-200 p-5 flex flex-col justify-start items-stretch">
        <div className="text-2xl font-bold mb-3 self-center">Lobby</div>
        <div className="flex flex-col gap-4 md:flex-row justify-between items-center mb-3">
          <div className="flex w-[90%] sm:w-[70%] md:w-[43%] flex-col justify-start items-stretch gap-4">
            <Player name={lobby.users[0] || "Waiting..."} role="North" lobby={lobby}  ready={lobby.ready[0]} user={user} />
            <Player name={lobby.users[1] || "Waiting..."} role="South" lobby={lobby}  ready={lobby.ready[1]} user={user} />
          </div>
          <div className="flex w-[90%] sm:w-[70%] md:w-[43%] flex-col justify-start items-stretch gap-4">
            <Player name={lobby.users[2] || "Waiting..."} role="West" lobby={lobby} ready={lobby.ready[2]} user={user} />
            <Player name={lobby.users[3] || "Waiting..."} role="East" lobby={lobby} ready={lobby.ready[3]} user={user} />
          </div>
        </div>
        <div className="flex flex-row justify-evenly sm:justify-between items-center">
          <button className="btn btn-xs btn-link text-error text-xs xs:btn-sm sm:btn-md" onClick={handleLeaveClick}>
            Leave
          </button>
          <button className="btn btn-xs btn-primary xs:btn-sm sm:btn-md" onClick={handleCopyClick}>
            Copy ID
          </button>
          <button className="btn btn-xs btn-primary xs:btn-sm sm:btn-md" disabled={lobby.ready[myIndex]} onClick={handleReadyClick}>
            Ready
          </button>
        </div>
      </div>
    </div>
  );
}

export default protectRoute(Lobby);
