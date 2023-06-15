"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect, useCallback } from "react";
import { useCreateLobby, useJoinLobby } from "@/api/lobby";
import useUserUid from "@/logic/use_user_uid";

export default function Home() {
  const router = useRouter();
  const [createLobby, createdLobbyId, createLoading, createError] = useCreateLobby();
  const [joinLobby, isJoinedLobby, joinLoading, joinError] = useJoinLobby();
  const [userUid, userLoading, userError] = useUserUid();
  const [targetLobbyId, setTargetLobbyId] = useState<string>("");

  const onClickCreate = useCallback(() => {
    if (!userUid || createLoading || joinLoading) {
      return;
    }
    createLobby(userUid);
  }, [createLobby, userUid, createLoading, joinLoading]);

  const onClickJoin = useCallback(() => {
    if (!userUid || !targetLobbyId || createLoading || joinLoading) {
      return;
    }
    joinLobby(targetLobbyId, userUid);
  }, [joinLobby, userUid, targetLobbyId, createLoading, joinLoading]);

  useEffect(() => {
    if (createdLobbyId) {
      router.push(`/lobby/${createdLobbyId}`);
    }
  }, [router, createdLobbyId]);

  useEffect(() => {
    if (isJoinedLobby) {
      router.push(`/lobby/${targetLobbyId}`);
    }
  }, [router, isJoinedLobby, targetLobbyId]);

  return (
    <div className="col-start-1 col-span-4 sm:col-start-2 sm:col-span-4 lg:col-start-3 lg:col-span-4 xl:col-start-5 xl:col-span-4">
      <div className="flex flex-col border-opacity-50">
        <div className="h-auto card bg-base-200 rounded-box place-items-center p-6 gap-6">
          <p className="text-3xl text-accent-content text-center">
            Join a game
          </p>
          <div className="flex flex-col sm:flex-row w-full gap-4">
            <input
              className="input input-bordered input-primary sm:flex-1"
              placeholder="Game ID"
              value={targetLobbyId}
              onChange={e => setTargetLobbyId(e.target.value)}
              onSubmit={onClickJoin}
            />
            <a onClick={onClickJoin} className="btn btn-primary">
              Join
            </a>
          </div>
        </div>
        <div className="divider">OR</div>
        <div className="h-auto card bg-base-200 rounded-box place-items-center p-6 gap-6">
          <p className="text-3xl text-accent-content text-center">
            Create your lobby
          </p>
          <a onClick={onClickCreate} className="btn btn-primary">
            Create a game
          </a>
        </div>
      </div>
    </div>
  );
}
