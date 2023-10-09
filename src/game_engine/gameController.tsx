import { GameState } from "@/app/game/gameModels";
import { SpringRef, easings, useSpring } from "@react-spring/three";
import { createContext, useCallback, useEffect, useReducer, useState } from "react";

export const GameContext = createContext<GameControllerContext>(null!);

type SpringApiRef = SpringRef<{
  position: any;
  scale: any;
  rotation: any;
}>

export interface SpringCard {
  index: number;
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
  cards: SpringCard[];
  onPointerEnter: (springCard: SpringCard) => void;
  onPointerLeave: (springCard: SpringCard) => void;
  onClick: (springCard: SpringCard) => void;
}


const reduce = (state: CardState[], action: { index: number, state: CardState }) => {
  const newState = [...state];
  newState[action.index] = action.state;
  return newState;
};

export default function GameController({ serverGameState, children }: { serverGameState: GameState, children: React.ReactNode }) {
  const [isAnimating, setIsAnimating] = useState(false);

  const [cardStates, dispatchCardState] = useReducer(reduce, Array(52).fill(null).map(() => ({
    disabled: false
  })));

  const onPointerEnter = useCallback((springCard: SpringCard) => {
    if (isAnimating || cardStates[springCard.index].disabled) return;
    springCard.api.start({
      scale: 1.0,
      config: { duration: 350 }
    });
  }, [cardStates, isAnimating]);

  const onPointerLeave = useCallback((springCard: SpringCard) => {
    if (isAnimating || cardStates[springCard.index].disabled) return;
    springCard.api.start({
      scale: 0.58,
      config: { duration: 350 }
    });
  }, [cardStates, isAnimating]);

  const onClick = useCallback((springCard: SpringCard) => {
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


  const cards = Array(52).fill(null).map((_, index) => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [props, api] = useSpring(() => ({
      position: [0, 0, 0.1 * index],
      rotation: [0, 0, 0],
      scale: 0.58,
      config: { mass: 3, tension: 400, friction: 500, precision: 0.01, duration: 350, easing: easings.easeInOutCubic },
    }));

    return {
      index,
      api,
      props
    };
  });


  const [localGameState, setLocalGameState] = useState(serverGameState);

  useEffect(() => {
    if (localGameState !== serverGameState) {
      setLocalGameState(serverGameState);
    }
  }, [localGameState, serverGameState]);

  return (
    <GameContext.Provider value={{
      cards,
      onPointerEnter,
      onPointerLeave,
      onClick
    }}>
      {children}
    </GameContext.Provider>
  );
}