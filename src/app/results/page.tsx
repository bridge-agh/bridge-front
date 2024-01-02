"use client";

import { useSessionInfo } from "@/api/session";
import { GameStage } from "@/game_engine/gameModels";
import protectRoute from "@/logic/protect_route";
import useUser from "@/logic/use_user";
import Link from "next/link";
import { useRouter } from "next/navigation";
import BiddingHistory from "../game/bidding/biddingHistory";

function Results() {

  const router = useRouter();
  const { user } = useUser();
  const sessionInfo = useSessionInfo();

  if (sessionInfo.loading) {
    return null;
  }

  if (!sessionInfo.data || !user || !sessionInfo.data.gameState || sessionInfo.data.gameState.base.game_stage !== GameStage.SCORING) {
    router.replace("/home");
    return null;
  }

  return (
    <div className="col-start-1 col-span-4 sm:col-start-2 sm:col-span-4 md:col-start-1 md:col-span-6 lg:col-start-2 lg:col-span-6 xl:col-start-4 xl:col-span-6">
      <div className="rounded-xl bg-base-200 p-5 flex flex-col justify-start items-stretch">
        <div className="text-2xl font-bold mb-3 self-center text-center">Results</div>

        <div className="md:w-3/5 mx-auto text-center mb-8">
          <span className="text-xl mb-8">Bidding history</span>
          <div className="w-full flex flex-row justify-center mb-4">
            <span className="mx-auto">N</span>
            <span className="mx-auto">E</span>
            <span className="mx-auto">S</span>
            <span className="mx-auto">W</span>
          </div>
          <BiddingHistory biddingObservation={sessionInfo.data.gameState?.bidding!} />
        </div>

        <div className="mx-auto text-center mb-4">
          <span className="text-xl mb-8">Tricks scoring</span>
          <div className="flex flex-row text-center">
            <div className="flex flex-col w-1/2">
              <span className="font-medium">NS</span>
              <span>{sessionInfo.data.gameState?.game.tricks.NS.length}</span>
            </div>
            <div className="flex flex-col w-1/2">
              <span className="font-medium">EW</span>
              <span>{sessionInfo.data.gameState?.game.tricks.EW.length}</span>
            </div>
          </div>
        </div>

        <div className="mx-auto text-center mb-2">
          {sessionInfo.data.gameState!.game.tricks.NS.length > sessionInfo.data.gameState!.game.tricks.EW.length ?
            <div>
              <span className="font-bold">North</span> and <span className="font-bold">South</span> have won the game!
            </div> :
            <div>
              <span className="font-bold">East</span> and <span className="font-bold">West</span> have won the game!
            </div>
          }
        </div>

        <div className="w-full flex flex-row justify-center">
          <Link
            href="/lobby"
            className="btn btn-xs btn-primary xs:btn-sm sm:btn-md">
            Return to lobby
          </Link>
        </div>

      </div>
    </div>

  );

}

export default protectRoute(Results);
