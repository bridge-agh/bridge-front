import { Card, GameState, cardToString } from "@/app/game/gameModels";
import { SpringRef, easings, useSpring } from "@react-spring/three";
import { createContext, useCallback, useEffect, useReducer, useState } from "react";
import { HORIZONTAL_CARD_Y, getBottomHand, getLeftHand, getRightHand, getTopHand } from "./logic/cardRenderCalculator";

// Animation constants

const ANIM_TIME = 450;
const ANIM_DELAY = 50;



export const GameContext = createContext<GameControllerContext>(null!);

type SpringApiRef = SpringRef<{
  position: any;
  scale: any;
  rotation: any;
}>

export interface CardContext {
  index: number;
  card: Card | null;
  cardFront: string;
  api: SpringApiRef;
  props: {
    position: any;
    scale: any;
    rotation: any;
  };
}

interface CardState {
  disabled: boolean;
}

export interface GameControllerContext {
  cards: CardContext[];
  onPointerEnter: (springCard: CardContext) => void;
  onPointerLeave: (springCard: CardContext) => void;
  onClick: (springCard: CardContext) => void;
}


const reduceCardState = (state: CardState[], action: { index: number, state: CardState }) => {
  const newState = [...state];
  newState[action.index] = action.state;
  return newState;
};

const reduceCardContext = (state: CardContext[], action: { index: number, state: CardContext }) => {
  const newState = [...state];
  newState[action.index] = action.state;
  return newState;
};

const requestTimeout = (fn: () => void, delay: number) => {
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

export default function GameController({ serverGameState, children }: { serverGameState: GameState, children: React.ReactNode }) {
  // ANIMATIONS

  const [isAnimating, setIsAnimating] = useState(true); // true if animation should block interactions

  // state of each card
  const [cardStates, dispatchCardState] = useReducer(reduceCardState, Array(52).fill(null).map(() => ({
    disabled: true
  })));

  const [cardContexts, dispatchCardContext] = useReducer(reduceCardContext, Array(52).fill(null).map((_, index) => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [props, api] = useSpring(() => ({
      position: [0, 0, -index * 0.002 + 0.2],
      rotation: [0, Math.PI, 0],
      scale: 1,
      config: { mass: 3, tension: 400, friction: 500, precision: 0.01, duration: ANIM_TIME, easing: easings.easeInOutCubic },
    }));

    return {
      index,
      card: null,
      cardFront: "BACK",
      api,
      props
    };
  }));

  // card interactions callbacks
  const onPointerEnter = useCallback((springCard: CardContext) => {
    if (isAnimating || cardStates[springCard.index].disabled) return;
    springCard.api.start({
      position: [springCard.props.position.get()[0], -HORIZONTAL_CARD_Y + .1, springCard.props.position.get()[2]],
      config: { duration: 150, easing: easings.easeOutCubic }
    });
  }, [cardStates, isAnimating]);

  const onPointerLeave = useCallback((springCard: CardContext) => {
    if (isAnimating || cardStates[springCard.index].disabled) return;
    springCard.api.start({
      position: [springCard.props.position.get()[0], -HORIZONTAL_CARD_Y, springCard.props.position.get()[2]],
      config: { duration: 150, easing: easings.easeOutCubic }
    });
  }, [cardStates, isAnimating]);

  const onClick = useCallback((springCard: CardContext) => {
    if (isAnimating || cardStates[springCard.index].disabled) return;

    setIsAnimating(true);

    dispatchCardState({ index: springCard.index, state: { disabled: true } });
    springCard.api.start({
      position: [0, 0, 0],
      rotation: [0, 0, 0],
      scale: 1,
      config: { duration: 1000, easing: easings.easeInOutCubic }
    });

    // const hand = getBottomHand(serverGameState);
    // const card = hand.cards[springCard.index];
    // const index = hand.cards.findIndex((c) => c.card === card.card);
    // hand.cards.splice(index, 1);
    // hand.cards.forEach((card, index) => {
    //   dispatchCardState({ index: index, state: { disabled: false } });
    //   dispatchCardContext({ index: index, state: { ...cardContexts[index], card: card.card, cardFront: cardToString(card.card) } });
    //   cardContexts[index].api.start({
    //     position: card.position,
    //     rotation: [0, 0, 0]
    //   });
    // });
    // // to animate each card must have its position in table

    setTimeout(() => {
      setIsAnimating(false);
    }, 1000);
  }, [cardStates, isAnimating]);

  // GAME LOGIC

  const [localGameState, setLocalGameState] = useState<GameState>(serverGameState); // state that will be compared with server state

  useEffect(() => {
    if (localGameState !== serverGameState) {
      setLocalGameState(serverGameState);
    }
  }, [localGameState, serverGameState]);

  useEffect(() => {
    console.log("run");

    setIsAnimating(true);
    requestTimeout(() => {
      console.log("run2");

      const playerHand = getBottomHand(localGameState);
      const leftHand = getLeftHand(localGameState);
      const topHand = getTopHand(localGameState);
      const rightHand = getRightHand(localGameState);

      playerHand.cards.forEach((card, index) => {
        requestTimeout(() => {
          dispatchCardState({ index: index, state: { disabled: false } });
          dispatchCardContext({ index: index, state: { ...cardContexts[index], card: card.card, cardFront: cardToString(card.card) } });
          cardContexts[index].api.start({
            position: card.position,
            rotation: [0, 0.03, 0]
          });
        }, ANIM_DELAY * index);
      });

      rightHand.cards.forEach((card, index) => {
        const tIndex = 13 + index;
        requestTimeout(() => {
          dispatchCardState({ index: tIndex, state: { disabled: true } });
          dispatchCardContext({ index: tIndex, state: { ...cardContexts[tIndex], card: card.card, cardFront: cardToString(card.card) } });
          cardContexts[tIndex].api.start({
            position: card.position,
            rotation: [-0.03, 0, Math.PI / 2]
          });
        }, ANIM_DELAY * (index + playerHand.cards.length));
      });

      topHand.cards.forEach((card, index) => {
        const tIndex = 26 + index;
        requestTimeout(() => {
          dispatchCardState({ index: tIndex, state: { disabled: true } });
          dispatchCardContext({ index: tIndex, state: { ...cardContexts[tIndex], card: card.card, cardFront: cardToString(card.card) } });
          cardContexts[tIndex].api.start({
            position: card.position,
            rotation: [0, -0.03, 0]
          });
        }, ANIM_DELAY * (index + playerHand.cards.length + rightHand.cards.length));
      });

      leftHand.cards.forEach((card, index) => {
        const tIndex = 39 + index;
        requestTimeout(() => {
          dispatchCardState({ index: tIndex, state: { disabled: true } });
          dispatchCardContext({ index: tIndex, state: { ...cardContexts[tIndex], card: card.card, cardFront: cardToString(card.card) } });
          cardContexts[tIndex].api.start({
            position: card.position,
            rotation: [0.03, 0, -Math.PI / 2]
          });
        }, ANIM_DELAY * (index + playerHand.cards.length + rightHand.cards.length + topHand.cards.length));
      });

      requestTimeout(() => {
        setIsAnimating(false);
      }, ANIM_DELAY * (playerHand.cards.length + leftHand.cards.length + topHand.cards.length + rightHand.cards.length - 1) + ANIM_TIME);
    }, 250);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [gameContext, setGameContext] = useState<GameControllerContext>({
    cards: cardContexts,
    onPointerEnter,
    onPointerLeave,
    onClick,
  });

  useEffect(() => {
    setGameContext({
      cards: cardContexts,
      onPointerEnter,
      onPointerLeave,
      onClick,
    });
  }, [cardContexts, onPointerEnter, onPointerLeave, onClick]);


  return (
    <GameContext.Provider value={gameContext}>
      {children}
    </GameContext.Provider>
  );
}