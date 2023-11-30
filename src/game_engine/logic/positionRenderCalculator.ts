import { CARD_HEIGHT } from "../components/gameCard";
import { PlayerDirection } from "../gameModels";
import { HORIZONTAL_CARD_SPACING, HORIZONTAL_CARD_Y, VERTICAL_CARD_SPACING, VERTICAL_CARD_X } from "./cardRenderCalculator";

const VERTICAL_DECK_SHIFT = -0.32;
const HORIZONTAL_DECK_SHIFT = -0.05;
const Z_SHIFT = -1;

export function getPosition(realDirection: PlayerDirection): number[] {
  switch (realDirection) {
    case PlayerDirection.NORTH:
      return [-(15 * HORIZONTAL_CARD_SPACING) / 2, HORIZONTAL_CARD_Y - (CARD_HEIGHT / 2 + HORIZONTAL_DECK_SHIFT), Z_SHIFT];
    case PlayerDirection.EAST:
      return [VERTICAL_CARD_X - (CARD_HEIGHT / 2 + VERTICAL_DECK_SHIFT), (7 * VERTICAL_CARD_SPACING) / 2, Z_SHIFT];
    case PlayerDirection.SOUTH:
      return [(15 * HORIZONTAL_CARD_SPACING) / 2, -HORIZONTAL_CARD_Y + (CARD_HEIGHT / 2 + HORIZONTAL_DECK_SHIFT), Z_SHIFT];
    case PlayerDirection.WEST:
      return [-VERTICAL_CARD_X + (CARD_HEIGHT / 2 + VERTICAL_DECK_SHIFT), - (7 * VERTICAL_CARD_SPACING) / 2, Z_SHIFT];
  }
}