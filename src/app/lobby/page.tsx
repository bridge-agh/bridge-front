"use client";

import Link from "next/link";

import { useGetLobby, useFindLobby } from "@/api/lobby";
import protectRoute from "@/logic/protect_route";
import useUserUid from "@/logic/use_user_uid";

import { TiDelete } from "react-icons/ti";
import { BsPersonCircle, BsQuestionCircle } from "react-icons/bs";
import { useCallback, useState } from "react";


function Player({ name, role, lobby, userUid }: { name: string, role: string, lobby: any, userUid: string | null }) {
  const onClickDelete = useCallback(() => {}, []);


  console.log(name, role, lobby, userUid);
  const onClickChange = () => {};
  return (
    <div className="flex flex-col justify-start items-start items-stretch min-w-[100%] w-100 hover:w-fit hover:z-10">
      <div className="font-bold text-accent-content w-11 xs:w-14 text-center text-sm xs:text-base">{role}</div>
      <div className="flex flex-row pe-2 rounded-3xl justify-start items-center bg-base-300 w-[100%] max-w-full">
    
        <div className="w-11 h-11 xs:w-14 xs:h-14 rounded-full bg-blue-600 flex flex-col justify-center items-center shrink-0">
          {name != "Waiting..." &&
          <BsPersonCircle className="w-11 h-11 xs:w-14 xs:h-14" /> || 
          <BsQuestionCircle className="w-11 h-11 xs:w-14 xs:h-14 "/>}
        </div>
        
        
        <div className="ml-2 font-semibold xs:text-lg xs:font-bold truncate hover:break-all hover:whitespace-normal">{name}</div>
        {name != lobby.host_id && userUid == lobby.host_id && (
          <TiDelete className="w-[20px] h-[20px] xs:w-[25px] xs:h-[25px] ml-2 shrink-0 ml-auto justify-self-end text-error cursor-pointer" onClick={onClickDelete}/>
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
        <div className="flex flex-row justify-evenly sm:justify-between items-center">
          <Link href="/home" className="btn btn-xs btn-link text-error text-xs xs:btn-sm sm:btn-md">
            Leave
          </Link>
          <button className="btn btn-xs btn-primary xs:btn-sm sm:btn-md" onClick={handleCopyClick}>
            Copy ID
          </button>
          <Link href="/game" className="btn btn-xs btn-primary xs:btn-sm sm:btn-md">
            Start
          </Link>
        </div>
      </div>
    </div>
  );
}

export default protectRoute(Lobby);
