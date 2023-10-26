"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect, useCallback } from "react";
import { useCreateLobby, useJoinLobby } from "@/api/session/lobby";
import useUser from "@/logic/use_user";
import protectRoute from "@/logic/protect_route";

function Home() {
  const router = useRouter();
  const createLobby = useCreateLobby();
  const joinLobby = useJoinLobby();
  const { user } = useUser();
  const [targetLobbyId, setTargetLobbyId] = useState<string>("");

  const goToLobby = useCallback(() => {
    router.push("/lobby");
  }, [router]);

  const onClickCreate = useCallback(() => {
    if (!user || createLobby.loading || joinLobby.loading) {
      return;
    }
    createLobby.trigger({hostId: user.uid}).then(goToLobby);
  }, [createLobby, joinLobby, goToLobby, user]);

  const onClickJoin = useCallback(() => {
    if (!user || !targetLobbyId || createLobby.loading || joinLobby.loading) {
      return;
    }
    joinLobby.trigger({sessionId: targetLobbyId, userId: user.uid}).then(goToLobby);
  }, [joinLobby, createLobby, goToLobby, user, targetLobbyId]);

  useEffect(() => {
    router.prefetch("/lobby");
  }, [router]);

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

export default protectRoute(Home);
