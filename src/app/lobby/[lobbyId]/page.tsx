"use client";

import Link from "next/link";
import { useGetLobby } from "@/api/lobby";
import ProtectedRoute from "@/components/protected_route";
import { FaExchangeAlt } from "react-icons/fa";
import { TiDelete } from "react-icons/ti";
import { BsPersonCircle, BsQuestionCircle } from "react-icons/bs";
import { useCallback, useState } from "react";

function Player({ name, role, owner, lobby }: { name: string, role: string, owner: boolean, lobby: any }) {
  const [player, setPlayer] = useState(name);
  const onClickDelete = useCallback(() => {
    for (let i = 0; i < lobby.users.length; i++) {
      if (lobby.users[i] === player) {
        lobby.users[i] = null;
        setPlayer("Waiting...");
      }
    }
  }, [player, lobby.users]);
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
        {!owner && (
          <TiDelete className="w-[20px] h-[20px] xs:w-[25px] xs:h-[25px] ml-auto shrink-0 justify-self-end text-error" onClick={onClickDelete}/>
        )}
      </div>
    </div>
  );
}



function Lobby({ params }: { params: { lobbyId: string } }) {
  const [lobby, getLobbyError] = useGetLobby(params.lobbyId);
  console.log(lobby);
  if (getLobbyError) {
    console.log(getLobbyError);
    return <div>Error</div>;
  }

  if (!lobby) {
    return <div>Loading...</div>;
  }

  return (
    <div className="col-start-1 col-span-4 sm:col-start-1 sm:col-span-6 lg:col-start-2 lg:col-span-6 xl:col-start-4 xl:col-span-6">
      <div className="rounded-xl bg-base-200 p-5 flex flex-col justify-start items-stretch">
        <div className="text-2xl font-bold mb-3 self-center">Lobby</div>
        <div className="flex flex-col gap-4 md:flex-row justify-between items-center mb-3">
          <div className="flex w-[90%] sm:w-[70%] md:w-[43%] flex-col justify-start items-stretch gap-4">
            <Player name={lobby.users[0] || "Waiting..."} role="North" owner={true} lobby={lobby}/>
            <Player name={lobby.users[1] || "Waiting..."} role="South" owner={false} lobby={lobby}/>
          </div>
          <FaExchangeAlt className="w-[30px] h-[30px] xs:w-[40px] xs:h-[40px] sm:w-[50px] sm:h-[50px] rotate-90 md:rotate-0" />
          <div className="flex w-[90%] sm:w-[70%] md:w-[43%] flex-col justify-start items-stretch gap-4">
            <Player name={lobby.users[2] || "Waiting..."} role="West" owner={false} lobby={lobby}/>
            <Player name={lobby.users[3] || "Waiting..."} role="East" owner={false} lobby={lobby}/>
          </div>
        </div>
        <div className="flex flex-row justify-between items-center">
          <Link href="/home" className="btn btn-sm btn-link text-error xs:btn-md">
            Leave
          </Link>
          <Link href="/game" className="btn btn-sm btn-primary xs:btn-md">
            Start
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function ProtectedLobby({ params }: { params: { lobbyId: string } }) {
  return (
    <ProtectedRoute>
      <Lobby params={params} />
    </ProtectedRoute>
  );
}
