import { Card, GameState, PlayerDirection } from "@/app/game/gameModels";
import { CARD_WIDTH } from "../components/gameCard";

export interface PlayerHandState {
  cards: {
    card: Card;
    position: [number, number, number];
  },
  canPlay: boolean;
}

const CARD_SPACING = .5 * CARD_WIDTH; // TODO: calculate for mobile
const HORIZONTAL_CARD_Y = 1.3; // TODO: calculate for mobile
const VERTICAL_CARD_X = 2; // TODO: calculate for mobile

export function getPlayerHand(gameState: GameState) {
  const canPlay = gameState.base.current_player === PlayerDirection.SOUTH;
  const cardCount = gameState.game.hand.length;

  const width = CARD_WIDTH + (cardCount - 1) * CARD_SPACING;
  const cards = gameState.game.hand.sort((a, b) => {
    if (a.suit === b.suit) {
      return a.rank < b.rank ? -1 : 1;
    } else {
      return a.suit < b.suit ? -1 : 1;
    }
  }).map((card, index) => {
    const x = -width / 2 + (index + 1) * CARD_SPACING;
    const y = -HORIZONTAL_CARD_Y;
    const z = 0.001 * index;

    return {
      card,
      position: [x, y, z]
    };
  });

  return {
    cards,
    canPlay
  };
}