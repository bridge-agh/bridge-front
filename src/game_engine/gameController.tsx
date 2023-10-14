import { Card, GameState } from "@/app/game/gameModels";
import { SpringRef, easings, useSpring } from "@react-spring/three";
import { createContext, useCallback, useEffect, useReducer, useState } from "react";
import { getPlayerHand } from "./logic/cardCalculations";

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

const reductCardContext = (state: CardContext[], action: { index: number, state: CardContext }) => {
  const newState = [...state];
  newState[action.index] = action.state;
  return newState;
};

export default function GameController({ serverGameState, children }: { serverGameState: GameState, children: React.ReactNode }) {
  // ANIMATIONS

  const [isAnimating, setIsAnimating] = useState(true); // true if animation should block interactions

  // state of each card
  const [cardStates, dispatchCardState] = useReducer(reduceCardState, Array(52).fill(null).map(() => ({
    disabled: false
  })));

  // card interactions callbacks
  const onPointerEnter = useCallback((springCard: CardContext) => {
    if (isAnimating || cardStates[springCard.index].disabled) return;
    springCard.api.start({
      scale: 1.0,
      config: { duration: 350 }
    });
  }, [cardStates, isAnimating]);

  const onPointerLeave = useCallback((springCard: CardContext) => {
    if (isAnimating || cardStates[springCard.index].disabled) return;
    springCard.api.start({
      scale: 0.58,
      config: { duration: 350 }
    });
  }, [cardStates, isAnimating]);

  const onClick = useCallback((springCard: CardContext) => {
    if (isAnimating || cardStates[springCard.index].disabled) return;
    setIsAnimating(true);
    dispatchCardState({ index: springCard.index, state: { disabled: true } });
    springCard.api.start({
      position: [0, 2, springCard.props.position.get()[2]],
      rotation: [0, 2 * Math.PI, 0],
      scale: 0.58,
      config: { duration: 1000 }
    });
    setTimeout(() => {
      setIsAnimating(false);
    }, 1000);
  }, [cardStates, isAnimating]);

  const [cardContexts, dispatchCardContext] = useReducer(reductCardContext, Array(52).fill(null).map((_, index) => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [props, api] = useSpring(() => ({
      position: [0, 0, 0],
      rotation: [0, -Math.PI, 0],
      scale: 0.58,
      config: { mass: 3, tension: 400, friction: 500, precision: 0.01, duration: 350, easing: easings.easeInOutCubic },
    }));

    return {
      index,
      card: null,
      cardFront: "BACK",
      api,
      props
    };
  }));

  const [gameContext, setGameContext] = useState<GameControllerContext>(null!);

  useEffect(() => {
    setGameContext({
      cards: cardContexts,
      onPointerEnter,
      onPointerLeave,
      onClick
    });
  }, [cardContexts, onPointerEnter, onPointerLeave, onClick]);

  // GAME LOGIC

  const [localGameState, setLocalGameState] = useState<GameState>(serverGameState); // state that will be diff with server state

  useEffect(() => {
    if (localGameState !== serverGameState) {
      setLocalGameState(serverGameState);
    }
  }, [localGameState, serverGameState]);

  useEffect(() => {
    console.log("run");
    setTimeout(() => {
      console.log("run2");
      const playerHand = getPlayerHand(localGameState);
      playerHand.cards.map((card, index) => {
        setTimeout(() => {
          dispatchCardContext({ index: index, state: { ...cardContexts[index], card: card.card, cardFront: "7S" } });
          cardContexts[index].api.start({
            position: card.position,
            rotation: [0, 0, 0]
          });
        }, 100 * index);
      });

      // cards.map((card) => {
      //   card.api.start({
      //     position: [-2, 0, 0],
      //   });
      // });
      setIsAnimating(false);
    }, 250);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // only run once


  return (
    <GameContext.Provider value={gameContext}>
      {children}
    </GameContext.Provider>
  );
}