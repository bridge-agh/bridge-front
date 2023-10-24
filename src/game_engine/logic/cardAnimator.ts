import { PlayerDirection, cardToString } from "@/app/game/gameModels";
import { easings } from "@react-spring/three";
import { CardContext } from "../gameController";
import { PlayerHand, getPlayedPosition } from "./cardRenderCalculator";

// animation constants
export const ANIM_TIME = 250;
export const ANIM_DELAY = 30;

// setTimeout but for animations
export const requestTimeout = (fn: () => void, delay: number) => {
  const start = new Date().getTime();

  const loop = () => {
    const delta = new Date().getTime() - start;

    if (delta >= delay) {
      fn();
      return;
    }

    const raf = requestAnimationFrame(loop);
  };

  const raf = requestAnimationFrame(loop);
};

export function animateHand(hand: PlayerHand, delayIndex: number, contextIndexes: number[], dispatchCardContext: any, cardContexts: CardContext[], animDelay: number = ANIM_DELAY, animEasing: (t: number) => number = easings.easeInOutCubic) {
  hand.cards.forEach((card, index) => {
    const tIndex = contextIndexes.shift()!;
    requestTimeout(() => {
      dispatchCardContext({ index: tIndex, state: { ...cardContexts[tIndex], cardFront: cardToString(card.card) } });

      cardContexts[tIndex].api.start({
        position: card.position,
        rotation: card.rotation,
        config: { duration: ANIM_TIME, easing: animEasing }
      });
    }, animDelay * (index + delayIndex));
  });
}

export function animateCardPlay(cardContext: CardContext, direction: PlayerDirection) {
  const playedPosition = getPlayedPosition(direction);

  cardContext.api.start({
    position: playedPosition.position,
    rotation: playedPosition.rotation,
    config: { duration: ANIM_TIME, easing: easings.easeInOutCubic }
  });
}