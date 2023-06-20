import {
  BidSuit,
  BidTricks,
  SpecialBid,
  TrickBid,
} from "@/app/game/gameModels";
import ClubSymbol from "@/components/cards/symbols/clubs";
import DiamondsSymbol from "@/components/cards/symbols/diamonds";
import HeartsSymbol from "@/components/cards/symbols/hearts";
import SpadesSymbol from "@/components/cards/symbols/spades";

function Bid({ bid }: { bid: TrickBid | SpecialBid }) {}

function suitToSymbol(suit: BidSuit, size: number = 4) {
  switch (suit) {
    case BidSuit.CLUBS:
      return <ClubSymbol className={`w-${size} h-${size} fill-base-content`} />;
    case BidSuit.DIAMONDS:
      return <DiamondsSymbol className={`w-${size} h-${size} fill-red-700`} />;
    case BidSuit.HEARTS:
      return <HeartsSymbol className={`w-${size} h-${size} fill-red-700`} />;
    case BidSuit.SPADES:
      return (
        <SpadesSymbol className={`w-${size} h-${size} fill-base-content`} />
      );
    case BidSuit.NO_TRUMP:
      return "NT";
  }
}

function TrickBidButton({ bid }: { bid: TrickBid }) {
  return (
    <button className="btn bg-base-100 text-base-content border-0 hover:bg-primary-focus w-12 h-12 gap-1 p-1 text-lg">
      {bid.tricks}
      {suitToSymbol(bid.suit, 6)}
    </button>
  );
}

function BiddingBids() {
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
                    return (
                      <TrickBidButton
                        key={suit}
                        bid={{ tricks: Number(trick), suit: Number(suit) }}
                      />
                    );
                  })}
              </div>
            );
          })}
        <div className="grid grid-cols-2 gap-4 mt-4">
          <button className="btn bg-base-100 text-base-content border-0 hover:bg-primary-focus text-lg">
            <span className="text-2xl">Pass</span>
          </button>
          <button className="btn bg-base-100 text-base-content border-0 hover:bg-primary-focus text-lg">
            <span className="text-2xl">Double</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default BiddingBids;
