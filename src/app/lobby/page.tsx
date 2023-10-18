"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { useFindSession } from "@/api/session";
import { useGetLobby, useLeaveLobby, useReady, useChoosePosition, useForceSwap} from "@/api/session/lobby";
import protectRoute from "@/logic/protect_route";
import useUser from "@/logic/use_user";
import { User } from "firebase/auth";
import { TiDelete } from "react-icons/ti";
import { BsPersonCircle, BsQuestionCircle } from "react-icons/bs";
import { FaExchangeAlt } from "react-icons/fa";


function Player({ name, ready, lobby, user, position, choosePosition }: { name: string, ready: boolean, lobby: any, user: User, position: string, choosePosition: (position: string) => void}) {
  const [nameText, setNameText] = useState(name);
  useEffect(() => {
    changeNameText(name);
  }, [name]);
  const [opacity, setOpacity] = useState(100);
  const changeNameText = (newName: string) => {
    setOpacity(0);
    setTimeout(() => {
      setNameText(newName);
      setOpacity(100);
    }, 300);
  };
  return (
    <div 
      className="flex flex-col justify-start items-start items-stretch min-w-[100%]"
      onMouseEnter={() =>  {
        if (nameText == "Waiting...") {
          changeNameText("Change position");
        }
      }}
      onMouseLeave={() => {
        if (nameText == "Change position") {
          changeNameText("Waiting...");
        }
      }}
      onClick={() => {
        if (["Change position", "Waiting..."].includes(nameText)) choosePosition(position);
      }}  
    >
      <div className="font-bold text-accent-content w-11 xs:w-14 text-center text-sm xs:text-base">{position}</div>
      <div className="flex flex-row pe-2 rounded-3xl justify-start items-center bg-base-300 w-[100%]">
        <div className={`w-11 h-11 xs:w-14 xs:h-14 rounded-full ${ready ? "bg-green-600" : "bg-blue-600"} transition-all flex flex-col justify-center items-center shrink-0`}>
          {name != "Waiting..." &&
          <BsPersonCircle className="w-11 h-11 xs:w-14 xs:h-14" /> || 
          <BsQuestionCircle className="w-11 h-11 xs:w-14 xs:h-14 "/>}
        </div>
   
        <div
          className={`ml-2 font-semibold xs:text-lg xs:font-bold truncate opacity-${opacity} transition-opacity duration-[300ms]`}

        >{nameText}</div>
        {name == "Waiting..." && (
          <FaExchangeAlt className="w-[15px] h-[15px] xs:w-[22px] xs:h-[22px] ml-auto shrink-0 justify-self-end cursor-pointer"/>
        )}        
        {name != user.uid && user.uid == lobby.host_id && (
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
  const choosePosition = useChoosePosition();
  const forceSwap = useForceSwap();
  
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

  const handleChoosePosition = useCallback((position: string) => {
    if (!findSession.data || !user || choosePosition.loading) return;
    choosePosition.trigger({ user_id: user.uid, session_id: findSession.data.session_id, position: position });
  }, [choosePosition, findSession, user]);

  useEffect(() => {
    router.prefetch("/game");
  }, [router]);

  useEffect(() => {
    if (getLobby.data && getLobby.data.users.length === 4 && getLobby.data.ready.every(x => x)) {
      console.log(getLobby);
      router.push("/game");
    }
  }, [router, getLobby]);

  // const [chosenPosition, setChosenPosition] = useState(false);

  if (!getLobby.data || !user) return null;
  
  const lobby = getLobby.data;
  const myIndex = lobby.users.findIndex(u => u.id === user.uid);
  
  return (
    <div className="col-start-1 col-span-4 sm:col-start-2 sm:col-span-4 md:col-start-1 md:col-span-6 lg:col-start-2 lg:col-span-6 xl:col-start-4 xl:col-span-6">
      <div className="rounded-xl bg-base-200 p-5 flex flex-col justify-start items-stretch">
        <div className="text-2xl font-bold mb-3 self-center">Lobby</div>
        <div className="flex flex-col gap-4 md:flex-row justify-between items-center mb-3">
          <div className="flex w-[90%] sm:w-[70%] md:w-[43%] flex-col justify-start items-stretch gap-4">
            <Player name={lobby.users.find(u => u.position == "north")?.id || "Waiting..."} lobby={lobby}  ready={lobby.ready[0]} user={user} position="north" choosePosition={handleChoosePosition} />
            <Player name={lobby.users.find(u => u.position == "south")?.id || "Waiting..."} lobby={lobby}  ready={lobby.ready[1]} user={user} position="south" choosePosition={handleChoosePosition} />
          </div>
          <div className="flex w-[90%] sm:w-[70%] md:w-[43%] flex-col justify-start items-stretch gap-4">
            <Player name={lobby.users.find(u => u.position == "west")?.id || "Waiting..."} lobby={lobby} ready={lobby.ready[2]} user={user} position="west" choosePosition={handleChoosePosition} />
            <Player name={lobby.users.find(u => u.position == "east")?.id || "Waiting..."} lobby={lobby} ready={lobby.ready[3]} user={user} position="east" choosePosition={handleChoosePosition} />
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
