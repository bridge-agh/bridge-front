import { PlayerDirection, cardToString } from "@/game_engine/gameModels";
import { easings } from "@react-spring/three";
import { CardContext } from "../gameTypes";
import { PlayerHand, getCleanRoundPosition, getDummyShowUpPosition, getPlayedPosition } from "./cardRenderCalculator";

// animation constants
export const ANIM_TIME = 800;
export const ANIM_DELAY = 30;
export const ANIM_HAND_DELAY = 150;
export const ANIM_POST_DELAY = 200;

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

export function animateCleanRound(cardContexts: CardContext[], direction: PlayerDirection) {
  const playedPosition = getCleanRoundPosition(direction);

  cardContexts.forEach((cardContext) => {
    cardContext.api.start({
      position: playedPosition.position,
      rotation: playedPosition.rotation,
      scale: 0,
      config: { duration: ANIM_TIME, easing: easings.easeOutCubic }
    });
  });
}

export function animateDummyShowUp(cardContexts: CardContext[], direction: PlayerDirection) {
  const playedPosition = getDummyShowUpPosition(direction);

  cardContexts.forEach((cardContext) => {
    cardContext.api.start({
      rotation: [cardContext.props.rotation.get()[0] + playedPosition.rotation[0], cardContext.props.rotation.get()[1] + playedPosition.rotation[1], cardContext.props.rotation.get()[2]],
      config: { duration: ANIM_TIME, easing: easings.easeInOutCubic }
    });
  });

}