import { SpecialBid } from "@/game_engine/gameModels";
import { useContext } from "react";
import { suitToSymbol } from "./biddingBids";
import { BiddingContext } from "./biddingPage";

function BiddingHistory() {

  const bidding = useContext(BiddingContext);

  return (
    <div className="overflow-auto no-scrollbar grid grid-cols-4 gap-4">
      {Array(bidding.observation.first_dealer.valueOf()).fill(<div></div>)}
      {
        bidding.observation.bid_history.map((bid, index) => {
          return (
            <div key={index} className="mx-auto">
              {
                bid === SpecialBid.PASS ? "PASS" :
                  bid === SpecialBid.DOUBLE ? "X" :
                    bid === SpecialBid.REDOUBLE ? "XX" :
                      <div className="flex flex-row gap-1 bid-history transition-all">
                        <span>{bid.tricks}</span>
                        <div className="w-6 h-6 flex flex-col justify-center fill-neutral">
                          {suitToSymbol(bid.suit)}
                        </div>
                      </div>
              }
            </div>
          );
        })
      }
    </div>
  );
}

export default BiddingHistory;