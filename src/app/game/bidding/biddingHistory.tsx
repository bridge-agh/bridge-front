import { BiddingObservation, SpecialBid } from "@/game_engine/gameModels";
import { suitToSymbol } from "./biddingBids";

function BiddingHistory({ biddingObservation }: { biddingObservation: BiddingObservation }) {

  return (
    <div className="overflow-auto no-scrollbar grid grid-cols-4 gap-4">
      {Array(biddingObservation.first_dealer.valueOf()).fill(<div></div>)}
      {
        biddingObservation.bid_history.map((bid, index) => {
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