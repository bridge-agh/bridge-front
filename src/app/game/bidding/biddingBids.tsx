import ClubSymbol from "@/components/cards/symbols/clubs";
import DiamondsSymbol from "@/components/cards/symbols/diamonds";
import HeartsSymbol from "@/components/cards/symbols/hearts";
import SpadesSymbol from "@/components/cards/symbols/spades";
import {
  BidSuit,
  BidTricks,
  SpecialBid,
  TrickBid
} from "@/game_engine/gameModels";
import _ from "lodash";
import { useContext } from "react";
import { twMerge } from "tailwind-merge";
import { BiddingContext } from "./biddingPage";

export function suitToSymbol(suit: BidSuit) {
  switch (suit) {
    case BidSuit.CLUBS:
      return <ClubSymbol className="fill-neutral-content" />;
    case BidSuit.DIAMONDS:
      return <DiamondsSymbol className="fill-red-700" />;
    case BidSuit.HEARTS:
      return <HeartsSymbol className="fill-red-700" />;
    case BidSuit.SPADES:
      return <SpadesSymbol className="fill-neutral-content" />;
    case BidSuit.NO_TRUMP:
      return <span>NT</span>;
  }
}

// def is_legal(current_bid: TrickBid, bid_history: list[Union[TrickBid, SpecialBid]],
//   new_bid: Union[TrickBid, SpecialBid]) -> bool:
// if isinstance(new_bid, SpecialBid):
// if new_bid == SpecialBid.PASS:
//  return True
// n_bids = len(bid_history)
// if new_bid == SpecialBid.DOUBLE and n_bids > 0:
//  # TrickBid was played by opponent's team
//  if isinstance(bid_history[-1], TrickBid) or (n_bids >= 3 and
//          bid_history[-2:] == [SpecialBid.PASS, SpecialBid.PASS] and isinstance(bid_history[-3], TrickBid)):
//      return True
// elif new_bid == SpecialBid.REDOUBLE and n_bids > 0:
//  # DOUBLE was used by opponent's team
//  if bid_history[-1] == SpecialBid.DOUBLE or (n_bids >= 3 and
//          bid_history[-2:] == [SpecialBid.PASS, SpecialBid.PASS] and bid_history[-3] == SpecialBid.DOUBLE):
//      return True
// return False
// else:
// if current_bid is None:
//  return True
// else:
//  return new_bid > current_bid

function isBidLegal(currentBid: TrickBid | SpecialBid, newBid: TrickBid | SpecialBid, bidHistory: (TrickBid | SpecialBid)[]) {
  if (!newBid.hasOwnProperty("suit")) {
    if (newBid === SpecialBid.PASS) return true;

    const nBids = bidHistory.length;
    if (newBid === SpecialBid.DOUBLE && nBids > 0) {
      // TrickBid was played by opponent's team
      if (bidHistory[nBids - 1].hasOwnProperty("suit") || (nBids >= 3 &&
        _.isEqual(bidHistory.slice(nBids - 2), [SpecialBid.PASS, SpecialBid.PASS]) && bidHistory[nBids - 3].hasOwnProperty("suit"))) {
        return true;
      }
    } else if (newBid === SpecialBid.REDOUBLE && nBids > 0) {
      // DOUBLE was used by opponent's team
      if (bidHistory[nBids - 1] === SpecialBid.DOUBLE || (nBids >= 3 &&
        _.isEqual(bidHistory.slice(nBids - 2), [SpecialBid.PASS, SpecialBid.PASS]) && bidHistory[nBids - 3] === SpecialBid.DOUBLE)) {
        return true;
      }
    }

    return false;
  } else {
    newBid = newBid as TrickBid;
    currentBid = currentBid as TrickBid;

    if (currentBid === null) {
      return true;
    } else {
      if (newBid.tricks > currentBid.tricks) {
        return true;
      } else if (newBid.tricks === currentBid.tricks) {
        return newBid.suit > currentBid.suit;
      } else {
        return false;
      }
    }
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
        "btn text-neutral-content bid hover:bg-primary-focus border-0 w-14 h-14 gap-1 p-1 text-lg flex flex-row justify-center transition-all",
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

function BiddingBids() {

  const bidding = useContext(BiddingContext);

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

                    const isSelected = bidding.observation.bid &&
                      tricksN == bidding.observation.bid!.tricks &&
                      suitN == bidding.observation.bid!.suit;

                    const isLegal = isBidLegal(bidding.observation.bid!, { tricks: tricksN, suit: suitN }, bidding.observation.bid_history);

                    return (
                      <TrickBidButton
                        key={suit}
                        bid={{ tricks: tricksN, suit: suitN }}
                        disabled={
                          !(isLegal ||
                            (bidding.observation.bid?.suit === suitN && bidding.observation.bid?.tricks === tricksN)) // show current bid but will be blocked on action
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
          <button className="btn hover-text-primary-bright border-0 hover:bg-primary-focus text-lg col-span-2" disabled={!isBidLegal(bidding.observation.bid!, SpecialBid.PASS, bidding.observation.bid_history)}>
            <span className="text-2xl">Pass</span>
          </button>
          <div className="col-span-2 grid grid-cols-2 gap-4">
            <button className="btn hover-text-primary-bright border-0 hover:bg-primary-focus text-lg" disabled={!isBidLegal(bidding.observation.bid!, SpecialBid.DOUBLE, bidding.observation.bid_history)}>
              <span className="text-2xl">Double</span>
            </button>
            <button className="btn hover-text-primary-bright border-0 hover:bg-primary-focus text-lg" disabled={!isBidLegal(bidding.observation.bid!, SpecialBid.REDOUBLE, bidding.observation.bid_history)}>
              <span className="text-2xl">Redouble</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BiddingBids;
