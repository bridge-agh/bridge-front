import BiddingBids from "@/app/game/bidding/biddingBids";
import BiddingPlayers from "@/app/game/bidding/biddingPlayers";
import {
  BaseObservation,
  BidSuit,
  BiddingObservation,
  GameStage,
  PlayerDirection,
} from "@/game_engine/gameModels";
import { useEffect, useState } from "react";
import BiddingHistory from "./biddingHistory";

function BiddingPage() {
  // redux here, currently dummy data
  const [baseObservation, setBaseObservation] = useState<BaseObservation>({
    game_stage: GameStage.BIDDING,
    current_player: PlayerDirection.NORTH,
    user_direction: PlayerDirection.NORTH,
  });

  const [biddingObservation, setBiddingObservation] =
    useState<BiddingObservation>({
      first_dealer: PlayerDirection.EAST,
      bid_history: [],
      bid: {
        suit: BidSuit.HEARTS,
        tricks: 3,
      },
      declarer: PlayerDirection.EAST,
      multiplier: 1,
    });

  useEffect(() => {
    const bids: any = [
      {
        suit: BidSuit.SPADES,
        tricks: 1,
      },
      {
        suit: BidSuit.HEARTS,
        tricks: 3,
      },
      {
        suit: BidSuit.SPADES,
        tricks: 5,
      },
      {
        suit: BidSuit.NO_TRUMP,
        tricks: 7,
      },
    ];

    const timer = setInterval(() => {
      setBaseObservation({
        game_stage: GameStage.BIDDING,
        current_player: (baseObservation.current_player + 1) % 4,
        user_direction: PlayerDirection.NORTH,
      });
      setBiddingObservation({
        first_dealer: biddingObservation.first_dealer,
        bid_history: [],
        bid: bids[(baseObservation.current_player + 1) % 4],
        declarer: (biddingObservation.declarer! + 1) % 4,
        multiplier: 1,
      });
    }, 5000);
    return () => {
      clearInterval(timer);
    };
  });

  return (
    <div className="absolute z-50 top-[40%] w-max left-1/2 transform -translate-x-1/2 -translate-y-1/2 scale-[2]">
      <div className="flex flex-row gap-4 bg-base-200 p-8 pr-4 rounded-xl">
        <div>
          <BiddingBids biddingObservation={biddingObservation} />
        </div>
        <div className="m-4 flex flex-col">
          <div className="mb-4">
            <BiddingPlayers
              baseObservation={baseObservation}
              biddingObservation={biddingObservation}
            />
          </div>
          <div>
            <BiddingHistory />
          </div>
        </div>
      </div>
    </div>
  );
}

export default BiddingPage;
