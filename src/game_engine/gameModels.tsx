
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

export function nextDirection(direction: PlayerDirection): PlayerDirection {
  return (direction + 1) % 4;
}

export function prevDirection(direction: PlayerDirection): PlayerDirection {
  return (direction + 3) % 4;
}

export function oppositeDirection(direction: PlayerDirection): PlayerDirection {
  return (direction + 2) % 4;
}

export function diffDirection(a: PlayerDirection, b: PlayerDirection): number {
  return (b - a + 4) % 4;
}

export function realDirectionToPlayerDirection(realDirection: PlayerDirection, userDirection: PlayerDirection): PlayerDirection {
  const diff = diffDirection(PlayerDirection.SOUTH, userDirection);
  return (realDirection + diff) % 4;
}

export function playerDirectionToRealDirection(playerDirection: PlayerDirection, userDirection: PlayerDirection): PlayerDirection {
  const diff = diffDirection(PlayerDirection.SOUTH, userDirection);
  return (playerDirection + 4 - diff) % 4;
}

export function getPlayerDirectionFirstLetter(direction: PlayerDirection) {
  return PlayerDirection[direction][0];
}

export function getPlayerDirectionName(direction: PlayerDirection) {
  let first = getPlayerDirectionFirstLetter(direction);
  let rest = PlayerDirection[direction].slice(1).toLowerCase();
  return first + rest;
}

export enum CardSuit {
  CLUBS,
  DIAMONDS,
  HEARTS,
  SPADES,
}

export enum CardRank {
  TWO = 2,
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

export function cardToString(card: Card | null): string {
  if (card === null) return "BACK";
  const rank = card.rank > 9 ? CardRank[card.rank][0] : card.rank;
  const suit = CardSuit[card.suit][0];
  return `${rank}${suit}`;
}

export enum BidSuit {
  CLUBS,
  DIAMONDS,
  HEARTS,
  SPADES,
  NO_TRUMP,
}

export enum BidTricks {
  ONE = 1,
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
  REDOUBLE,
}

export interface Trick {
  round_player: PlayerDirection;
  winner: PlayerDirection;
  cards: Card[];
}

export interface BaseObservation {
  game_stage: GameStage;
  current_player: PlayerDirection;
  user_direction: PlayerDirection;
}

export interface BiddingObservation {
  first_dealer: PlayerDirection;
  bid_history: (TrickBid | SpecialBid)[];
  bid: TrickBid | null;
  declarer: PlayerDirection | null;
  multiplier: number;
}

export interface GameObservation {
  round_player: PlayerDirection;
  round_cards: Card[];
  dummy_cards: Card[];
  tricks: {
    NS: Trick[];
    EW: Trick[];
  };
  hand: Card[];
}

export interface GameState {
  base: BaseObservation;
  bidding: BiddingObservation;
  game: GameObservation;
}
