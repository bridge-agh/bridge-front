import { useEffect, useState } from "react";
import {
  BaseObservation,
  BiddingObservation,
  GameStage,
  PlayerDirection,
} from "@/app/game/gameModels";
import BiddingPlayers from "@/app/game/bidding/biddingPlayers";

function BiddingPage() {
  // redux here, currently dummy data
  const [baseObservation, setBaseObservation] = useState<BaseObservation>({
    game_stage: GameStage.BIDDING,
    current_player: PlayerDirection.NORTH,
  });

  const [biddingObservation, setBiddingObservation] =
    useState<BiddingObservation>({
      first_dealer: PlayerDirection.NORTH,
      bid_history: [],
      bid: null,
      declarer: null,
      multiplier: 1,
    });

  useEffect(() => {
    const timer = setInterval(() => {
      setBaseObservation({
        game_stage: GameStage.BIDDING,
        current_player: (baseObservation.current_player + 1) % 4,
      });
    }, 1000);
    return () => {
      clearInterval(timer);
    };
  });

  return (
    <div className="flex-col">
      <div>
        <BiddingPlayers current_player={baseObservation.current_player} />
      </div>
    </div>
  );
}

export default BiddingPage;
