"use client";

import Link from "next/link";
import { FaExchangeAlt } from "react-icons/fa";
import { TiDelete } from "react-icons/ti";
import { BsPersonCircle, BsQuestionCircle } from "react-icons/bs";
import { useCallback, useState } from "react";
import { useGetLobby, useFindLobby } from "@/api/lobby";
import protectRoute from "@/logic/protect_route";
import useUserUid from "@/logic/use_user_uid";


function Player({ name, role, lobby, userUid }: { name: string, role: string, lobby: any, userUid: string | null }) {
  const [player, setPlayer] = useState(name);
  const onClickDelete = useCallback(() => {
    for (let i = 0; i < lobby.users.length; i++) {
      if (lobby.users[i] === player) {
        lobby.users[i] = null;
        setPlayer("Waiting...");
      }
    }
  }, [player, lobby.users]);
  const onClickChange = () => {};
  return (
    <div className="flex flex-col justify-start items-start items-stretch min-w-[100%] w-100 hover:w-fit hover:z-10">
      <div className="ml-2 font-bold text-accent-content">{role}</div>
      <div className="flex flex-row pe-2 rounded-3xl justify-start items-center bg-base-300 w-[100%]">
        <div className="w-11 h-11 xs:w-14 xs:h-14 rounded-full bg-blue-600 me-3 flex flex-col justify-center items-center shrink-0">
          {player != "Waiting..." &&
          <BsPersonCircle className="w-11 h-11 xs:w-14 xs:h-14" /> || 
          <BsQuestionCircle className="w-11 h-11 xs:w-14 xs:h-14 "/>}
        </div>
        <div className="font-semibold xs:text-lg xs:font-bold truncate ">{player}</div>
        {name == "Waiting..." && (
          <FaExchangeAlt className="w-[15px] h-[15px] xs:w-[22px] xs:h-[22px] ml-auto shrink-0 justify-self-end cursor-pointer" onClick={onClickChange}/>
        )}
        {name != lobby.host_id && userUid == lobby.host_id && (
          <TiDelete className="w-[20px] h-[20px] xs:w-[25px] xs:h-[25px] ml-2 shrink-0 text-error cursor-pointer" onClick={onClickDelete}/>
        )}
      </div>
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

  const user = lobby.users[lobby.users.length - 1];
  console.log(user);
  
  return (
    <div className="col-start-1 col-span-4 sm:col-start-2 sm:col-span-4 md:col-start-1 md:col-span-6 lg:col-start-2 lg:col-span-6 xl:col-start-4 xl:col-span-6">
      <div className="rounded-xl bg-base-200 p-5 flex flex-col justify-start items-stretch">
        <div className="text-2xl font-bold mb-3 self-center">Lobby</div>
        <div className="flex flex-col gap-4 md:flex-row justify-between items-center mb-3">
          <div className="flex w-[90%] sm:w-[70%] md:w-[43%] flex-col justify-start items-stretch gap-4">
            <Player name={lobby.users[0] || "Waiting..."} role="North" lobby={lobby} userUid={userUid}/>
            <Player name={lobby.users[1] || "Waiting..."} role="South" lobby={lobby} userUid={userUid}/>
          </div>
          <div className="flex w-[90%] sm:w-[70%] md:w-[43%] flex-col justify-start items-stretch gap-4">
            <Player name={lobby.users[2] || "Waiting..."} role="West" lobby={lobby} userUid={userUid}/>
            <Player name={lobby.users[3] || "Waiting..."} role="East" lobby={lobby} userUid={userUid}/>
          </div>
        </div>
        <div className="flex flex-row justify-between items-center">
          <Link href="/home" className="btn btn-sm btn-link text-error text-xs xs:btn-md">
            Leave
          </Link>
          <button className="btn btn-sm btn-primary text-xs xs:btn-md" onClick={handleCopyClick}>
            Copy ID
          </button>
          <Link href="/game" className="btn btn-sm btn-primary text-xs xs:btn-md">
            Start
          </Link>
        </div>
      </div>
    </div>
  );
}

export default protectRoute(Lobby);
