import { Card, GameStage, GameState, PlayerDirection, diffDirection, nextDirection, oppositeDirection, prevDirection } from "@/app/game/gameModels";
import { CARD_HEIGHT, CARD_WIDTH } from "../components/gameCard";

// public constants

export const HORIZONTAL_CARD_SPACING = .5 * CARD_WIDTH; // TODO: calculate for mobile
export const VERTICAL_CARD_SPACING = .45 * CARD_WIDTH; // TODO: calculate for mobile
export const HORIZONTAL_CARD_Y = 1.45; // TODO: calculate for mobile
export const VERTICAL_CARD_X = 2.5; // TODO: calculate for mobile
const MIDDLE_CARD_SHIFT = 0.03;

// interfaces

export interface PlayerHandState {
  cards: {
    card: Card | null;
    position: [number, number, number];
  },
  canPlay: boolean;
}

// support methods

function compareCards(a: Card, b: Card) {
  if (a.suit === b.suit) {
    return a.rank < b.rank ? -1 : 1;
  } else {
    return a.suit < b.suit ? -1 : 1;
  }
}

function getHandWidth(cardCount: number) {
  return CARD_WIDTH + (cardCount - 1) * HORIZONTAL_CARD_SPACING;
}

function getHandHeight(cardCount: number) {
  return CARD_WIDTH + (cardCount - 1) * VERTICAL_CARD_SPACING;
}

function getHandCount(player: PlayerDirection, gameState: GameState) {
  if (gameState.base.game_stage === GameStage.BIDDING) return 13;
  if (player === gameState.base.user_direction) return gameState.game.hand.length;
  // if (player === oppositeDirection(gameState.bidding.declarer!)) return gameState.game.dummy_cards.length;

  const tricksLeft = 13 - gameState.game.tricks.NS.length - gameState.game.tricks.EW.length;

  return tricksLeft - (gameState.game.round_cards.length >= (diffDirection(gameState.game.round_player, player) + 1) ? 1 : 0);
}

function realDirectionToPlayerDirection(realDirection: PlayerDirection, userDirection: PlayerDirection) {
  const diff = diffDirection(PlayerDirection.SOUTH, userDirection);
  return (realDirection + 4 - diff) % 4;
}


// public methods

export interface PlayerHand {
  cards: {
    card: Card | null;
    position: number[];
    rotation: number[];
  }[],
  canPlay: boolean;
  direction: PlayerDirection;
}


export function getHand(gameState: GameState, direction: PlayerDirection, userDirection: PlayerDirection) {
  const realDirection = realDirectionToPlayerDirection(direction, userDirection);
  switch (realDirection) {
    case PlayerDirection.NORTH:
      return getTopHand(gameState);
    case PlayerDirection.EAST:
      return getRightHand(gameState);
    case PlayerDirection.SOUTH:
      return getBottomHand(gameState);
    case PlayerDirection.WEST:
      return getLeftHand(gameState);
  }
}

export function getBottomHand(gameState: GameState): PlayerHand {
  const userDirection = gameState.base.user_direction;
  const declarerDirection = gameState.bidding.declarer;

  const canPlay = (declarerDirection !== oppositeDirection(userDirection)) && (gameState.base.current_player === userDirection);
  const cardCount = getHandCount(userDirection, gameState);

  const width = getHandWidth(cardCount);
  const cards = [...gameState.game.hand].sort(compareCards).reverse().map((card, index) => {
    const x = -width / 2 + (cardCount - index - 1) * HORIZONTAL_CARD_SPACING + CARD_WIDTH / 2;
    const y = -HORIZONTAL_CARD_Y;
    const z = 0;

    return {
      card,
      position: [x, y, z],
      rotation: [0, 0.03, 0]
    };
  });

  console.log("bottom hand");
  console.log(cardCount);
  console.log(cards);
  console.log(canPlay);


  return {
    cards,
    canPlay,
    direction: userDirection
  };
}


export function getTopHand(gameState: GameState): PlayerHand {
  const userDirection = gameState.base.user_direction;
  const handDirection = oppositeDirection(userDirection);
  const declarerDirection = gameState.bidding.declarer;

  // if its partner's turn, and you are declarer
  const canPlay = (gameState.base.current_player === handDirection) && (declarerDirection === userDirection);
  const cardCount = getHandCount(handDirection, gameState);

  const width = getHandWidth(cardCount);

  // if game started, and declarer is you or your partner, then show dummy cards (if partner is declarer user can see partner's cards but not play game)
  let pregenCards = (declarerDirection != null && (declarerDirection === oppositeDirection(handDirection) || declarerDirection === handDirection))
    ? [...gameState.game.dummy_cards].sort(compareCards).reverse() : Array(cardCount).fill(null);
  const cards = pregenCards.map((card, index) => {
    const x = -width / 2 + index * HORIZONTAL_CARD_SPACING + CARD_WIDTH / 2;
    const y = HORIZONTAL_CARD_Y;
    const z = 0;

    return {
      card,
      position: [x, y, z],
      rotation: [0, card == null ? Math.PI - 0.03 : -0.03, 0]
    };
  });

  console.log("top hand");
  console.log(cardCount);
  console.log(cards);
  console.log(canPlay);

  return {
    cards,
    canPlay,
    direction: handDirection
  };
}


export function getLeftHand(gameState: GameState): PlayerHand {
  const userDirection = gameState.base.user_direction;
  const handDirection = nextDirection(userDirection);
  const declarerDirection = gameState.bidding.declarer;

  const cardCount = getHandCount(handDirection, gameState);
  const height = getHandHeight(cardCount);

  // if game started, and declarer is facing left hand, and played at least one card, then show dummy cards
  let pregenCards = (declarerDirection != null && (declarerDirection === oppositeDirection(handDirection))
    && getHandCount(nextDirection(declarerDirection), gameState) < 13) ? [...gameState.game.dummy_cards].sort(compareCards).reverse() : Array(cardCount).fill(null);
  const cards = pregenCards.map((card, index) => {
    const x = -VERTICAL_CARD_X;
    const y = -height / 2 + index * VERTICAL_CARD_SPACING + CARD_WIDTH / 2;
    const z = 0;

    return {
      card,
      position: [x, y, z],
      rotation: [0.03, Math.PI, -Math.PI / 2]
    };
  });

  console.log("left hand");
  console.log(cardCount);
  console.log(cards);


  return {
    cards,
    canPlay: false,
    direction: handDirection
  };
}


export function getRightHand(gameState: GameState): PlayerHand {
  const userDirection = gameState.base.user_direction;
  const handDirection = prevDirection(userDirection);
  const declarerDirection = gameState.bidding.declarer;

  const cardCount = getHandCount(handDirection, gameState);
  const height = getHandHeight(cardCount);

  // if game started, and declarer is facing left hand, and played at least one card, then show dummy cards
  let pregenCards = (declarerDirection != null && (declarerDirection === oppositeDirection(handDirection))
    && getHandCount(nextDirection(declarerDirection), gameState) < 13) ? [...gameState.game.dummy_cards].sort(compareCards) : Array(cardCount).fill(null);
  const cards = pregenCards.map((card, index) => {
    const x = VERTICAL_CARD_X;
    const y = -height / 2 + (cardCount - index - 1) * VERTICAL_CARD_SPACING + CARD_WIDTH / 2;
    const z = 0;

    return {
      card,
      position: [x, y, z],
      // rotation: [card == null ? Math.PI / 2 - 0.03 : -0.03, Math.PI / 2, -Math.PI / 2]
      rotation: [-0.03, Math.PI, Math.PI / 2]
    };
  });

  console.log("right hand");
  console.log(cardCount);
  console.log(cards);


  return {
    cards,
    canPlay: false,
    direction: handDirection
  };
}


export function getPlayedPosition(direction: PlayerDirection) {
  switch (direction) {
    case PlayerDirection.NORTH:
      return {
        position: [-CARD_WIDTH / 2 - MIDDLE_CARD_SHIFT, CARD_HEIGHT / 2 + MIDDLE_CARD_SHIFT, 0],
        rotation: [0, 0, 0],
      };
    case PlayerDirection.EAST:
      return {
        position: [CARD_HEIGHT / 2 + MIDDLE_CARD_SHIFT, CARD_WIDTH / 2 + MIDDLE_CARD_SHIFT, 0],
        rotation: [0, 0, Math.PI / 2],
      };
    case PlayerDirection.SOUTH:
      return {
        position: [CARD_WIDTH / 2 + MIDDLE_CARD_SHIFT, -CARD_HEIGHT / 2 - MIDDLE_CARD_SHIFT, 0],
        rotation: [0, 0, 0],
      };
    case PlayerDirection.WEST:
      return {
        position: [-CARD_HEIGHT / 2 - MIDDLE_CARD_SHIFT, -CARD_WIDTH / 2 - MIDDLE_CARD_SHIFT, 0],
        rotation: [0, 0, -Math.PI / 2],
      };
  }
}
