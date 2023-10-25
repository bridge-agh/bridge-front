import { Card, CardRank, CardSuit, GameStage, GameState, PlayerDirection, nextDirection } from "@/app/game/gameModels";
import { SpringRef, easings, useSpring } from "@react-spring/three";
import { createContext, useCallback, useEffect, useReducer, useState } from "react";
import { ANIM_DELAY, ANIM_TIME, animateCardPlay, animateCleanRound, animateHand, requestTimeout } from "./logic/cardAnimator";
import { HORIZONTAL_CARD_Y, getBottomHand, getHand, getLeftHand, getRightHand, getTopHand } from "./logic/cardRenderCalculator";

// interfaces

export const GameContext = createContext<GameControllerContext>(null!);

type SpringApiRef = SpringRef<{
  position: any;
  scale: any;
  rotation: any;
}>

export interface CardContext {
  index: number;
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

interface CardAssignment {
  card: Card | null;
  index: number;
};

enum AssignmentActionType {
  ASSIGN_BATCH,
  MOVE_TO_PLAYED,
}

interface AssignmentAction {
  direction: PlayerDirection;
  type: AssignmentActionType;
  data: CardAssignment | CardAssignment[];
}

// state reducers

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

const PLAYED_ASSIGNMENTS = 4;
const reduceCardAssignment = (state: (CardAssignment[])[], action: { state: AssignmentAction }) => {
  const newState = [...state];
  switch (action.state.type) {
    case AssignmentActionType.ASSIGN_BATCH:
      newState[action.state.direction] = action.state.data as CardAssignment[];
      return newState;

    // return newState[action.direction] = action.data as CardAssignment;
    case AssignmentActionType.MOVE_TO_PLAYED:
      const card = action.state.data as CardAssignment;
      const index = newState[action.state.direction].findIndex((c) => c === card);
      newState[action.state.direction].splice(index, 1);
      newState[PLAYED_ASSIGNMENTS].push(card);

      return newState;

    // return newState[action.direction].played.push(newState[action.direction].hand.splice(newState[action.direction].hand.findIndex((c) => c === action.data), 1)[0]);
  }
};

function cleanHand(localGameState: GameState, cardContexts: CardContext[]) {
  let winningCard = localGameState.game.round_cards[0];
  let winningPlayerIndex = 0;

  for (let i = 1; i < localGameState.game.round_cards.length; i++) {
    const card = localGameState.game.round_cards[i];

    if (card.suit === winningCard.suit) {
      if (card.rank > winningCard.rank) {
        winningCard = card;
        winningPlayerIndex = i;
      }
    } else if (card.suit.valueOf === localGameState.bidding.bid!.suit.valueOf) {
      winningCard = card;
      winningPlayerIndex = i;
    }
  }

  let winningPlayer = localGameState.game.round_player;
  for (let i = 0; i < winningPlayerIndex; i++) {
    winningPlayer = nextDirection(winningPlayer);
  }

  const trick = {
    round_player: localGameState.game.round_player,
    winner: winningPlayer,
    cards: localGameState.game.round_cards,
  };

  if (winningPlayer === PlayerDirection.NORTH || winningPlayer === PlayerDirection.SOUTH) {
    localGameState.game.tricks.NS.push(trick);
  } else {
    localGameState.game.tricks.EW.push(trick);
  }

  localGameState.game.round_player = winningPlayer;
  localGameState.game.round_cards = [];
  localGameState.base.current_player = winningPlayer;


  animateCleanRound(cardContexts, winningPlayer);

  console.log(winningPlayer);

  return localGameState;
}

export default function GameController({ serverGameState, setGameState, children }: { serverGameState: GameState, setGameState: (state: GameState) => void, children: any }) {
  // animation state
  const [canUserInteract, setCanUserInteract] = useState(false); // true if animation should block interactions

  // state of each card
  const [cardStates, dispatchCardState] = useReducer(reduceCardState, Array(52).fill(null).map(() => ({
    disabled: true
  })));

  // state of game
  const [localGameState, setLocalGameState] = useState<GameState>(serverGameState); // state that will be compared with server state

  const [cardAssignments, dispatchCardAssignments] = useReducer(reduceCardAssignment, Array(5).fill([]) as (CardAssignment[])[]);

  const [cardContexts, dispatchCardContext] = useReducer(reduceCardContext, Array(52).fill(null).map((_, index) => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [props, api] = useSpring(() => ({
      position: [0, 0, -index * 0.002 - 0.7],
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
    if (!canUserInteract || cardStates[springCard.index].disabled) return;

    const isUserCard = localGameState.base.current_player === localGameState.base.user_direction;
    springCard.api.start({
      position: [springCard.props.position.get()[0], (isUserCard ? -1 : 1) * (HORIZONTAL_CARD_Y - .1), springCard.props.position.get()[2]],
      config: { duration: 150, easing: easings.easeOutCubic }
    });
  }, [canUserInteract, cardStates, localGameState.base.current_player, localGameState.base.user_direction]);

  const onPointerLeave = useCallback((springCard: CardContext) => {
    if (!canUserInteract || cardStates[springCard.index].disabled) return;

    const isUserCard = localGameState.base.current_player === localGameState.base.user_direction;
    springCard.api.start({
      position: [springCard.props.position.get()[0], (isUserCard ? -1 : 1) * HORIZONTAL_CARD_Y, springCard.props.position.get()[2]],
      config: { duration: 150, easing: easings.easeOutCubic }
    });
  }, [canUserInteract, cardStates, localGameState.base.current_player, localGameState.base.user_direction]);

  const onClick = useCallback((springCard: CardContext) => {
    if (!canUserInteract || cardStates[springCard.index].disabled) return;

    setCanUserInteract(false);

    const handDirection = localGameState.base.current_player;
    const userDirection = localGameState.base.user_direction;
    const springIndex = springCard.index;

    // join card assignment index with spring index
    const cardAssign = cardAssignments[handDirection].find((cardAssignment) => cardAssignment.index === springIndex)!;

    // move card from hand to round cards (declare new game state)
    let newGameState = { ...localGameState };
    if (handDirection === userDirection) {
      const cardIndex = newGameState.game.hand.findIndex((card) => card === cardAssign.card);
      const card = newGameState.game.hand.splice(cardIndex, 1)[0];
      newGameState.game.round_cards.push(card);
    } else {
      const cardIndex = newGameState.game.dummy_cards.findIndex((card) => card === cardAssign.card);
      const card = newGameState.game.dummy_cards.splice(cardIndex, 1)[0];
      newGameState.game.round_cards.push(card);
    }

    // update card assignment state to played
    dispatchCardAssignments({
      state: {
        direction: handDirection,
        type: AssignmentActionType.MOVE_TO_PLAYED,
        data: cardAssign!,
      }
    });

    // disable all cards on hand and played one
    dispatchCardState({ index: springIndex, state: { disabled: true } });
    cardAssignments[handDirection].forEach((cardAssignment) => {
      dispatchCardState({ index: cardAssignment.index, state: { disabled: true } });
    });

    const hand = getHand(newGameState, handDirection, userDirection)!;

    animateCardPlay(springCard, userDirection === handDirection ? PlayerDirection.SOUTH : PlayerDirection.NORTH);
    animateHand(hand, 0, cardAssignments[handDirection]
      .filter(cardAssignments => cardAssignments !== cardAssign)
      .map(cardAssignment => cardAssignment.index), dispatchCardContext, cardContexts, 0, easings.easeInOutExpo);


    requestTimeout(() => {
      if (newGameState.game.round_cards.length === 4) {
        const assignments = cardAssignments[PLAYED_ASSIGNMENTS].filter((cardAssignment) => newGameState.game.round_cards.includes(cardAssignment.card!));
        assignments.push(cardAssign);

        const contexts = cardContexts.filter((cardContext) => assignments.map(a => a.index).includes(cardContext.index));

        newGameState = cleanHand(newGameState, contexts);
      }

      console.log(newGameState);

      requestTimeout(() => {
        setLocalGameState(newGameState);
        setCanUserInteract(true);
      }, (newGameState.game.round_cards.length === 4) ? ANIM_TIME : 0);
    }, ANIM_TIME);
  }, [canUserInteract, cardStates, localGameState, cardAssignments, cardContexts]);

  useEffect(() => {
    if (!canUserInteract) return;
    if (localGameState !== serverGameState) {
      setLocalGameState(serverGameState);
    }
  }, [canUserInteract, localGameState, serverGameState]);

  useEffect(() => {
    setLocalGameState(serverGameState);

    requestTimeout(() => {

      const userHand = getBottomHand(localGameState);
      const leftHand = getLeftHand(localGameState);
      const topHand = getTopHand(localGameState);
      const rightHand = getRightHand(localGameState);

      let globalIndex = 0;
      [userHand, leftHand, topHand, rightHand].forEach((hand) => {
        dispatchCardAssignments({
          state: {
            direction: hand.direction,
            type: AssignmentActionType.ASSIGN_BATCH,
            data: hand.cards.map((card, index) => ({
              card: card.card,
              index: globalIndex + index,
            }))
          }
        });

        const assignIndexes = hand.cards.map((_, index) => globalIndex + index);

        assignIndexes.forEach(i => dispatchCardState({ index: i, state: { disabled: !hand.canPlay } }));
        animateHand(hand, globalIndex, assignIndexes, dispatchCardContext, cardContexts);

        globalIndex += hand.cards.length;
      });

      requestTimeout(() => {
        setCanUserInteract(true);
      }, ANIM_DELAY * (globalIndex - 1) + ANIM_TIME);
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


  // DEBUG

  const [gameStates] = useState<GameState[]>([
    {
      base: {
        game_stage: GameStage.PLAYING,
        current_player: PlayerDirection.NORTH,
        user_direction: PlayerDirection.EAST,
      },
      bidding: {
        first_dealer: PlayerDirection.WEST,
        bid_history: [],
        bid: null,
        declarer: PlayerDirection.SOUTH,
        multiplier: 1,
      },
      game: {
        round_player: PlayerDirection.WEST,
        round_cards: [
          { suit: CardSuit.SPADES, rank: CardRank.ACE }
        ],
        dummy_cards: [
          { suit: CardSuit.CLUBS, rank: CardRank.ACE },
          { suit: CardSuit.SPADES, rank: CardRank.TWO },
          { suit: CardSuit.CLUBS, rank: CardRank.THREE },
          { suit: CardSuit.DIAMONDS, rank: CardRank.FOUR },
          { suit: CardSuit.DIAMONDS, rank: CardRank.FIVE },
          { suit: CardSuit.CLUBS, rank: CardRank.SIX },
          { suit: CardSuit.SPADES, rank: CardRank.SEVEN },
          { suit: CardSuit.CLUBS, rank: CardRank.EIGHT },
          { suit: CardSuit.DIAMONDS, rank: CardRank.NINE },
          { suit: CardSuit.HEARTS, rank: CardRank.TEN },
          { suit: CardSuit.SPADES, rank: CardRank.JACK },
          { suit: CardSuit.SPADES, rank: CardRank.QUEEN },
          { suit: CardSuit.HEARTS, rank: CardRank.KING },
        ],
        tricks: {
          NS: [],
          EW: [],
        },
        hand: [
          { suit: CardSuit.CLUBS, rank: CardRank.ACE },
          { suit: CardSuit.SPADES, rank: CardRank.TWO },
          { suit: CardSuit.CLUBS, rank: CardRank.THREE },
          { suit: CardSuit.DIAMONDS, rank: CardRank.FOUR },
          { suit: CardSuit.DIAMONDS, rank: CardRank.FIVE },
          { suit: CardSuit.CLUBS, rank: CardRank.SIX },
          { suit: CardSuit.SPADES, rank: CardRank.SEVEN },
          { suit: CardSuit.CLUBS, rank: CardRank.EIGHT },
          { suit: CardSuit.DIAMONDS, rank: CardRank.NINE },
          { suit: CardSuit.HEARTS, rank: CardRank.TEN },
          { suit: CardSuit.SPADES, rank: CardRank.JACK },
          { suit: CardSuit.SPADES, rank: CardRank.QUEEN },
          { suit: CardSuit.HEARTS, rank: CardRank.KING },
        ],
      },
    },
    {
      base: {
        game_stage: GameStage.PLAYING,
        current_player: PlayerDirection.EAST,
        user_direction: PlayerDirection.EAST,
      },
      bidding: {
        first_dealer: PlayerDirection.WEST,
        bid_history: [],
        bid: null,
        declarer: PlayerDirection.SOUTH,
        multiplier: 1,
      },
      game: {
        round_player: PlayerDirection.WEST,
        round_cards: [
          { suit: CardSuit.SPADES, rank: CardRank.ACE },
          { suit: CardSuit.DIAMONDS, rank: CardRank.FOUR }
        ],
        dummy_cards: [
          { suit: CardSuit.CLUBS, rank: CardRank.ACE },
          { suit: CardSuit.SPADES, rank: CardRank.TWO },
          { suit: CardSuit.CLUBS, rank: CardRank.THREE },
          { suit: CardSuit.DIAMONDS, rank: CardRank.FOUR },
          { suit: CardSuit.DIAMONDS, rank: CardRank.FIVE },
          { suit: CardSuit.CLUBS, rank: CardRank.SIX },
          { suit: CardSuit.SPADES, rank: CardRank.SEVEN },
          { suit: CardSuit.CLUBS, rank: CardRank.EIGHT },
          { suit: CardSuit.DIAMONDS, rank: CardRank.NINE },
          { suit: CardSuit.HEARTS, rank: CardRank.TEN },
          { suit: CardSuit.SPADES, rank: CardRank.JACK },
          { suit: CardSuit.SPADES, rank: CardRank.QUEEN },
          { suit: CardSuit.HEARTS, rank: CardRank.KING },
        ],
        tricks: {
          NS: [],
          EW: [],
        },
        hand: [
          { suit: CardSuit.CLUBS, rank: CardRank.ACE },
          { suit: CardSuit.SPADES, rank: CardRank.TWO },
          { suit: CardSuit.CLUBS, rank: CardRank.THREE },
          { suit: CardSuit.DIAMONDS, rank: CardRank.FOUR },
          { suit: CardSuit.DIAMONDS, rank: CardRank.FIVE },
          { suit: CardSuit.CLUBS, rank: CardRank.SIX },
          { suit: CardSuit.SPADES, rank: CardRank.SEVEN },
          { suit: CardSuit.CLUBS, rank: CardRank.EIGHT },
          { suit: CardSuit.DIAMONDS, rank: CardRank.NINE },
          { suit: CardSuit.HEARTS, rank: CardRank.TEN },
          { suit: CardSuit.SPADES, rank: CardRank.JACK },
          { suit: CardSuit.SPADES, rank: CardRank.QUEEN },
          { suit: CardSuit.HEARTS, rank: CardRank.KING },
        ],
      },
    },
    {
      base: {
        game_stage: GameStage.PLAYING,
        current_player: PlayerDirection.SOUTH,
        user_direction: PlayerDirection.EAST,
      },
      bidding: {
        first_dealer: PlayerDirection.WEST,
        bid_history: [],
        bid: null,
        declarer: PlayerDirection.SOUTH,
        multiplier: 1,
      },
      game: {
        round_player: PlayerDirection.WEST,
        round_cards: [
          { suit: CardSuit.SPADES, rank: CardRank.ACE },
          { suit: CardSuit.DIAMONDS, rank: CardRank.FOUR },
          { suit: CardSuit.CLUBS, rank: CardRank.EIGHT }
        ],
        dummy_cards: [
          { suit: CardSuit.CLUBS, rank: CardRank.ACE },
          { suit: CardSuit.SPADES, rank: CardRank.TWO },
          { suit: CardSuit.CLUBS, rank: CardRank.THREE },
          { suit: CardSuit.DIAMONDS, rank: CardRank.FOUR },
          { suit: CardSuit.DIAMONDS, rank: CardRank.FIVE },
          { suit: CardSuit.CLUBS, rank: CardRank.SIX },
          { suit: CardSuit.SPADES, rank: CardRank.SEVEN },
          { suit: CardSuit.CLUBS, rank: CardRank.EIGHT },
          { suit: CardSuit.DIAMONDS, rank: CardRank.NINE },
          { suit: CardSuit.HEARTS, rank: CardRank.TEN },
          { suit: CardSuit.SPADES, rank: CardRank.JACK },
          { suit: CardSuit.SPADES, rank: CardRank.QUEEN },
          { suit: CardSuit.HEARTS, rank: CardRank.KING },
        ],
        tricks: {
          NS: [],
          EW: [],
        },
        hand: [
          { suit: CardSuit.CLUBS, rank: CardRank.ACE },
          { suit: CardSuit.SPADES, rank: CardRank.TWO },
          { suit: CardSuit.CLUBS, rank: CardRank.THREE },
          { suit: CardSuit.DIAMONDS, rank: CardRank.FOUR },
          { suit: CardSuit.DIAMONDS, rank: CardRank.FIVE },
          { suit: CardSuit.CLUBS, rank: CardRank.SIX },
          { suit: CardSuit.SPADES, rank: CardRank.SEVEN },
          { suit: CardSuit.DIAMONDS, rank: CardRank.NINE },
          { suit: CardSuit.HEARTS, rank: CardRank.TEN },
          { suit: CardSuit.SPADES, rank: CardRank.JACK },
          { suit: CardSuit.SPADES, rank: CardRank.QUEEN },
          { suit: CardSuit.HEARTS, rank: CardRank.KING },
        ],
      },
    }
  ]);

  useEffect(() => {
    console.log("server game states changed!!!");
    console.log(serverGameState);
  }, [serverGameState]);

  const updateGameState = useCallback(() => {
    console.log(serverGameState);
    const state = gameStates.shift();
    if (state) {
      const tophand = getTopHand(state);
      animateHand(tophand, 0, cardAssignments[tophand.direction].map(cardAssignment => cardAssignment.index), dispatchCardContext, cardContexts);
      setGameState(state);
    }
    console.log(serverGameState);
  }, [cardAssignments, cardContexts, gameStates, serverGameState, setGameState]);


  return (
    <GameContext.Provider value={gameContext}>
      <div className="absolute z-50 btn btn-primary">
        <button onClick={updateGameState}>Simulate</button>
      </div>
      {children}
    </GameContext.Provider>
  );
}