import { useBid, useDouble, usePass, useRedouble } from "@/api/session/game";
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
import { useCallback, useContext } from "react";
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

    if (currentBid === null || currentBid === undefined) {
      return true;
    } else {
      newBid = newBid as TrickBid;
      currentBid = currentBid as TrickBid;

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
  onClick,
  className,
}: {
  bid: TrickBid;
  disabled: boolean;
  selected: boolean;
  onClick: (bid: TrickBid | SpecialBid) => void;
  className?: string;
}) {
  return (
    <button
      disabled={disabled}
      data-tip="Final contract"
      onClick={() => onClick(bid)}
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

  const { trigger: bidAction } = useBid();
  const { trigger: passAction } = usePass();
  const { trigger: doubleAction } = useDouble();
  const { trigger: redoubleAction } = useRedouble();

  const bidActionWrapper = useCallback((bid: TrickBid | SpecialBid) => {
    if (bidding.currentPlayer === bidding.userDirection) {
      if (bid.hasOwnProperty("suit")) {
        bidAction(bid as TrickBid);
      } else {
        passAction();
      }
    }
  }, [bidAction, bidding.currentPlayer, bidding.userDirection, passAction]);

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
                        onClick={bidActionWrapper}
                      />
                    );
                  })}
              </div>
            );
          })}
        <div className="grid grid-cols-2 gap-4 mt-4">
          <button className="btn hover-text-primary-bright border-0 hover:bg-primary-focus text-lg col-span-2" onClick={() => {
            if (bidding.currentPlayer === bidding.userDirection)
              passAction();
          }} disabled={!isBidLegal(bidding.observation.bid!, SpecialBid.PASS, bidding.observation.bid_history)}>
            <span className="text-2xl">Pass</span>
          </button>
          <div className="col-span-2 grid grid-cols-2 gap-4">
            <button className="btn hover-text-primary-bright border-0 hover:bg-primary-focus text-lg" onClick={() => {
              if (bidding.currentPlayer === bidding.userDirection)
                doubleAction();
            }} disabled={!isBidLegal(bidding.observation.bid!, SpecialBid.DOUBLE, bidding.observation.bid_history)}>
              <span className="text-2xl">Double</span>
            </button>
            <button className="btn hover-text-primary-bright border-0 hover:bg-primary-focus text-lg" onClick={() => {
              if (bidding.currentPlayer === bidding.userDirection)
                redoubleAction();
            }} disabled={!isBidLegal(bidding.observation.bid!, SpecialBid.REDOUBLE, bidding.observation.bid_history)}>
              <span className="text-2xl">Redouble</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BiddingBids;
