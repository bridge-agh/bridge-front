import ClubSymbol from "@/components/cards/symbols/clubs";
import DiamondsSymbol from "@/components/cards/symbols/diamonds";
import HeartsSymbol from "@/components/cards/symbols/hearts";
import SpadesSymbol from "@/components/cards/symbols/spades";
import {
  BidSuit,
  BidTricks,
  BiddingObservation,
  TrickBid,
} from "@/game_engine/gameModels";
import { twMerge } from "tailwind-merge";

function suitToSymbol(suit: BidSuit) {
  switch (suit) {
    case BidSuit.CLUBS:
      return <ClubSymbol className="fill-neutral-content transition-all" />;
    case BidSuit.DIAMONDS:
      return <DiamondsSymbol className="fill-red-700 transition-all" />;
    case BidSuit.HEARTS:
      return <HeartsSymbol className="fill-red-700 transition-all" />;
    case BidSuit.SPADES:
      return <SpadesSymbol className="fill-neutral-content transition-all" />;
    case BidSuit.NO_TRUMP:
      return <span className="">NT</span>;
  }
}

function TrickBidButton({
  bid,
  disabled,
  selected,
  className,
}: {
  bid: TrickBid;
  disabled: boolean;
  selected: boolean;
  className?: string;
}) {
  return (
    <button
      disabled={disabled}
      data-tip="Final contract"
      className={twMerge(
        "btn text-neutral-content bid hover:bg-primary-focus border-0 w-14 h-14 gap-1 p-1 text-lg flex flex-row justify-center",
        selected
          ? "bg-accent bid-selected hover:bg-accent cursor-default"
          : "",
        className
      )}
    >
      <span>{bid.tricks}</span>
      <div className="w-6 h-6 flex flex-col justify-center">
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
    <div className="h-auto card bg-base-100 rounded-box place-items-center p-4">
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

                    const isSelected = biddingObservation.bid &&
                      tricksN == biddingObservation.bid!.tricks &&
                      suitN == biddingObservation.bid!.suit;

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
                        selected={isSelected ? true : false}
                        className={isSelected ? "tooltip" : ""}
                      />
                    );
                  })}
              </div>
            );
          })}
        <div className="grid grid-cols-2 gap-4 mt-4">
          <button className="btn hover-text-primary-bright border-0 hover:bg-primary-focus text-lg col-span-2">
            <span className="text-2xl">Pass</span>
          </button>
          <div className="col-span-2 grid grid-cols-2 gap-4">
            <button className="btn hover-text-primary-bright border-0 hover:bg-primary-focus text-lg">
              <span className="text-2xl">Double</span>
            </button>
            <button className="btn hover-text-primary-bright border-0 hover:bg-primary-focus text-lg">
              <span className="text-2xl">Redouble</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BiddingBids;
