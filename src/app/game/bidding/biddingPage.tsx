import BiddingBids from "@/app/game/bidding/biddingBids";
import BiddingPlayers from "@/app/game/bidding/biddingPlayers";
import {
  BaseObservation,
  BidSuit,
  BiddingObservation,
  GameStage,
  PlayerDirection,
} from "@/app/game/gameModels";
import { useEffect, useState } from "react";

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
      bid: null,
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
    }, 1000);
    return () => {
      clearInterval(timer);
    };
  });

  return (
    <div className="flex-col">
      <div className="mb-4">
        <BiddingPlayers
          baseObservation={baseObservation}
          biddingObservation={biddingObservation}
        />
      </div>
      <div>
        <BiddingBids biddingObservation={biddingObservation} />
      </div>
    </div>
  );
}

export default BiddingPage;
