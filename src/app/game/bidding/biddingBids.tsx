import {
  BidSuit,
  BidTricks,
  BiddingObservation,
  TrickBid,
} from "@/app/game/gameModels";
import ClubSymbol from "@/components/cards/symbols/clubs";
import DiamondsSymbol from "@/components/cards/symbols/diamonds";
import HeartsSymbol from "@/components/cards/symbols/hearts";
import SpadesSymbol from "@/components/cards/symbols/spades";
import { twMerge } from "tailwind-merge";

function suitToSymbol(suit: BidSuit) {
  switch (suit) {
    case BidSuit.CLUBS:
      return <ClubSymbol className="fill-base-content" />;
    case BidSuit.DIAMONDS:
      return <DiamondsSymbol className="fill-red-700" />;
    case BidSuit.HEARTS:
      return <HeartsSymbol className="fill-red-700" />;
    case BidSuit.SPADES:
      return <SpadesSymbol className="fill-base-content" />;
    case BidSuit.NO_TRUMP:
      return <span className="h-100 m-auto line-height-100">NT</span>;
  }
}

function TrickBidButton({
  bid,
  disabled,
  selected,
}: {
  bid: TrickBid;
  disabled: boolean;
  selected: boolean;
}) {
  return (
    <button
      disabled={disabled}
      className={twMerge(
        "btn bg-base-100 text-base-content bid hover:bg-primary-focus border-0 w-12 h-12 gap-1 p-1 text-lg",
        selected
          ? "bg-accent bid-selected hover:bg-accent no-animation cursor-default"
          : ""
      )}
    >
      {bid.tricks}
      <div className="w-6 h-6 flex flex-row justify-center">
        {suitToSymbol(bid.suit)}
      </div>
    </button>
  );
}

function BiddingBids({
  biddingObservation,
}: {
  biddingObservation: BiddingObservation;
}) {
  return (
    <div className="h-auto card w-100 bg-base-200 rounded-box place-items-center p-4">
      <div className="grid grid-rows-7 gap-1">
        {Object.keys(BidTricks)
          .filter((trick) => !isNaN(Number(trick)))
          .map((trick) => {
            return (
              <div key={trick} className="grid grid-cols-5 gap-1">
                {Object.keys(BidSuit)
                  .filter((suit) => !isNaN(Number(suit)))
                  .map((suit) => {
                    const tricksN = Number(trick);
                    const suitN = Number(suit);

                    return (
                      <TrickBidButton
                        key={suit}
                        bid={{ tricks: Number(trick), suit: Number(suit) }}
                        disabled={
                          biddingObservation.bid &&
                            (tricksN < biddingObservation.bid!.tricks ||
                              (tricksN == biddingObservation.bid!.tricks &&
                                suitN < biddingObservation.bid!.suit))
                            ? true
                            : false
                        }
                        selected={
                          biddingObservation.bid &&
                            tricksN == biddingObservation.bid!.tricks &&
                            suitN == biddingObservation.bid!.suit
                            ? true
                            : false
                        }
                      />
                    );
                  })}
              </div>
            );
          })}
        <div className="grid grid-cols-2 gap-4 mt-4">
          <button className="btn bg-base-100 text-base-content hover-text-primary-bright border-0 hover:bg-primary-focus text-lg">
            <span className="text-2xl">Pass</span>
          </button>
          <button className="btn bg-base-100 text-base-content hover-text-primary-bright border-0 hover:bg-primary-focus text-lg">
            <span className="text-2xl">Double</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default BiddingBids;
