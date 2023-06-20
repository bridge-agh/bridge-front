export enum GameStage {
  BIDDING,
  PLAYING,
  SCORING,
}

export enum PlayerDirection {
  NORTH,
  EAST,
  SOUTH,
  WEST,
}

export enum CardSuit {
  CLUBS,
  DIAMONDS,
  HEARTS,
  SPADES,
}

export enum CardRank {
  TWO,
  THREE,
  FOUR,
  FIVE,
  SIX,
  SEVEN,
  EIGHT,
  NINE,
  TEN,
  JACK,
  QUEEN,
  KING,
  ACE,
}

export enum BidSuit {
  CLUBS,
  DIAMONDS,
  HEARTS,
  SPADES,
  NO_TRUMP,
}

export enum BidTricks {
  ONE = 7,
  TWO,
  THREE,
  FOUR,
  FIVE,
  SIX,
  SEVEN,
}

export interface Card {
  suit: CardSuit;
  rank: CardRank;
}

export interface TrickBid {
  suit: BidSuit;
  tricks: BidTricks;
}

export enum SpecialBid {
  PASS,
  DOUBLE,
}

export interface Trick {
  round_player: PlayerDirection;
  winner: PlayerDirection;
  cards: Card[];
}

export interface BaseObservation {
  game_stage: GameStage;
  current_player: PlayerDirection;
}

export interface BiddingObservation {
  first_dealer: PlayerDirection;
  bid_history: (TrickBid | SpecialBid)[];
  bid: TrickBid | SpecialBid | null;
  declarer: PlayerDirection | null;
  multiplier: number;
}

export interface GameObservation {
  game: {
    round_player: PlayerDirection;
    round_cards: Card[];
    tricks: {
      NS: Trick[];
      EW: Trick[];
    };
  };
  hand: Card[];
}
