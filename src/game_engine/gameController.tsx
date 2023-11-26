import { usePlay } from "@/api/session/game";
import { BidSuit, BidTricks, Card, CardRank, CardSuit, GameStage, GameState, PlayerDirection, Trick, cardToString, diffDirection, nextDirection, oppositeDirection, playerDirectionToRealDirection } from "@/game_engine/gameModels";
import { logger } from "@/logic/logger";
import { SpringRef, easings, useSpring } from "@react-spring/three";
import _ from "lodash";
import { createContext, useCallback, useEffect, useReducer, useState } from "react";
import { ANIM_DELAY, ANIM_HAND_DELAY, ANIM_POST_DELAY, ANIM_TIME, animateCardPlay, animateCleanRound, animateDummyShowUp, animateHand, requestTimeout } from "./logic/cardAnimator";
import { HORIZONTAL_CARD_Y, compareCards, getBottomHand, getCanPlay, getHand, getHandCount, getLeftHand, getRightHand, getTopHand } from "./logic/cardRenderCalculator";

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
  direction: PlayerDirection | typeof PLAYED_ASSIGNMENTS;
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

    case AssignmentActionType.MOVE_TO_PLAYED:
      const cardAssign = action.state.data as CardAssignment;
      _.remove(newState[action.state.direction], (assign) => assign.index === cardAssign.index);
      newState[PLAYED_ASSIGNMENTS].push(cardAssign);

      return newState;
  }
};

function updateUserInterface(localGameState: GameState, cardAssignments: CardAssignment[][], dispatchCardState: any, setCanUserInteract: any) {
  const currentPlayer = localGameState.base.current_player;

  logger.debug("", cardAssignments);

  if (currentPlayer === localGameState.base.user_direction || // user turn
    currentPlayer === oppositeDirection(localGameState.base.user_direction)) { // partner turn

    if (getCanPlay(localGameState, currentPlayer)) {
      logger.debug("Unlocking user interface.");

      const playerHand = currentPlayer === localGameState.base.user_direction ? localGameState.game.hand : localGameState.game.dummy_cards;

      // calculate cards that can be played
      cardAssignments[currentPlayer].filter((card) => {

        // first card can be any card
        if (localGameState.game.round_player === localGameState.base.current_player)
          return true;

        // card must follow suit
        else if (localGameState.game.round_cards[0].suit === card.card!.suit)
          return true;

        // if player has no cards in the same suit as the first card
        // then any card can be played
        else if (!_.some(playerHand, (c: Card) => c.suit === localGameState.game.round_cards[0].suit))
          return true;

        return false;

      }).forEach((cardAssignment) => {
        dispatchCardState({ index: cardAssignment.index, state: { disabled: false } });
      });

      setCanUserInteract(true);
    }
  }
};

function cleanRound(localGameState: GameState) {
  let winningCard = localGameState.game.round_cards[0];
  let winningPlayerIndex = 0;

  logger.debug("Calculating winner of round.");

  logger.debug(`winning player index: ${winningPlayerIndex} | winning card: ${cardToString(winningCard)}`);

  for (let i = 1; i < localGameState.game.round_cards.length; i++) {
    const card = localGameState.game.round_cards[i];

    if (card.suit === winningCard.suit) {
      if (card.rank > winningCard.rank) {
        winningCard = card;
        winningPlayerIndex = i;
      }
    } else if (card.suit.valueOf() === localGameState.bidding.bid!.suit.valueOf()) {
      winningCard = card;
      winningPlayerIndex = i;
    }

    logger.debug(`winning player index: ${winningPlayerIndex} | winning card: ${cardToString(winningCard)}`);
  }

  let winningDirection = localGameState.game.round_player;
  for (let i = 0; i < winningPlayerIndex; i++) {
    winningDirection = nextDirection(winningDirection);
  }

  const trick = {
    round_player: localGameState.game.round_player,
    winner: winningDirection,
    cards: localGameState.game.round_cards,
  };

  if (winningDirection === PlayerDirection.NORTH || winningDirection === PlayerDirection.SOUTH) {
    localGameState.game.tricks.NS.push(trick);
  } else {
    localGameState.game.tricks.EW.push(trick);
  }

  localGameState.game.round_player = winningDirection;
  localGameState.game.round_cards = [];
  localGameState.base.current_player = winningDirection;

  return localGameState;
}


export default function GameController({ serverGameState, children }: { serverGameState: GameState, children: any }) {
  const { trigger: playCardAction } = usePlay();
  // const passAction = usePass();
  // const doubleAction = useDouble();


  // initial state
  const [isGameInitialized, setIsGameInitialized] = useState(false); // true if game is initialized

  // animation state
  const [isAnimating, setIsAnimating] = useState(true); // true if animation is running

  // interface state
  const [canUserInteract, setCanUserInteract] = useState(false); // true if user can interact with cards

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
      position: [0, 0, -index * 0.002 - 2],
      rotation: [0, Math.PI, 0],
      scale: 1,
      config: { mass: 3, tension: 400, friction: 500, precision: 0.01, duration: ANIM_TIME, easing: easings.easeInOutCubic },
    }));

    return {
      index,
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

    // block interaction; will be unlocked by server state parser
    setIsAnimating(true);
    setCanUserInteract(false);

    logger.debug("Locking user interface.");

    const handDirection = localGameState.base.current_player;
    const userDirection = localGameState.base.user_direction;
    const springIndex = springCard.index;

    const cardAssign = cardAssignments[handDirection].find((cardAssignment) => cardAssignment.index === springIndex)!;

    if (handDirection === userDirection) { // user played owned card
      const cardIndex = localGameState.game.hand.findIndex((card) => _.isEqual(card, cardAssign.card));
      const card = localGameState.game.hand.splice(cardIndex, 1)[0];
      localGameState.game.round_cards.push(card);
    } else { // user played dummy card
      const cardIndex = localGameState.game.dummy_cards.findIndex((card) => _.isEqual(card, cardAssign.card));
      const card = localGameState.game.dummy_cards.splice(cardIndex, 1)[0];
      localGameState.game.round_cards.push(card);
    }

    // disable all cards on hand and played one
    cardAssignments[handDirection].forEach((cardAssignment) => {
      dispatchCardState({ index: cardAssignment.index, state: { disabled: true } });
    });

    // update card assignment state to played
    dispatchCardAssignments({
      state: {
        direction: handDirection,
        type: AssignmentActionType.MOVE_TO_PLAYED,
        data: cardAssign!,
      }
    });

    const realDirection = playerDirectionToRealDirection(handDirection, userDirection);
    const hand = getHand(localGameState, realDirection);

    // play card to middle
    playCardAction(cardAssign.card!);
    animateCardPlay(springCard, realDirection);

    // center hand
    setTimeout(() => {
      animateHand(hand, 0, cardAssignments[handDirection]
        .filter(assign => !_.isEqual(assign, cardAssign))
        .map(assign => assign.index), dispatchCardContext, cardContexts, 0, easings.easeInOutExpo);
    }, ANIM_HAND_DELAY);

    logger.debug(`Played card ${cardToString(cardAssign.card!)} by ${PlayerDirection[handDirection]}`);

    requestTimeout(() => {
      localGameState.base.current_player = nextDirection(localGameState.base.current_player);

      logger.debug("State after play: ", _.cloneDeep(localGameState));

      setLocalGameState(localGameState);
      setIsAnimating(false);
    }, ANIM_TIME + ANIM_HAND_DELAY + ANIM_POST_DELAY);
  }, [canUserInteract, cardStates, localGameState, cardAssignments, playCardAction, cardContexts]);



  const processDifference = useCallback((serverGameState: GameState, localGameState: GameState) => {
    let cardAssignmentsCopy = _.cloneDeep(cardAssignments);
    let cardContextsCopy = _.cloneDeep(cardContexts.map((c) => ({ ...c, api: undefined })));
    let animTimeCount = 0;
    let loop = 0;

    logger.info("Parsing difference...");

    while (!_.isEqual(serverGameState, localGameState)) {
      loop++;
      if (loop > 100) {
        logger.error("Loop limit reached in parsing process!");
        logger.error("server state: ", _.cloneDeep(serverGameState));
        logger.error("local state: ", _.cloneDeep(localGameState));
        break;
      }

      let serverCardsToCompare = null;
      if (serverGameState.game.tricks.NS.length === localGameState.game.tricks.NS.length &&
        serverGameState.game.tricks.EW.length === localGameState.game.tricks.EW.length) { // comparing same trick
        serverCardsToCompare = serverGameState.game.round_cards;
      } else { // server is in the next trick, we need to compare with last won trick
        // backward tricks analysis

        let trick: Trick = { round_player: serverGameState.game.round_player, cards: [] as Card[], winner: serverGameState.game.round_player };
        let NSTricks = [...serverGameState.game.tricks.NS];
        let EWTricks = [...serverGameState.game.tricks.EW];

        while (localGameState.game.tricks.NS.length + localGameState.game.tricks.EW.length < NSTricks.length + EWTricks.length) {
          if ([PlayerDirection.NORTH, PlayerDirection.SOUTH].includes(trick.round_player)) {
            trick = NSTricks.pop()!;
          } else {
            trick = EWTricks.pop()!;
          }
        }

        serverCardsToCompare = trick.cards;
      }

      const localCardCount = localGameState.game.round_cards.length + 4 * (localGameState.game.tricks.NS.length + localGameState.game.tricks.EW.length);
      const serverCardCount = serverGameState.game.round_cards.length + 4 * (serverGameState.game.tricks.NS.length + serverGameState.game.tricks.EW.length);

      // case 1 - local > server
      if (localCardCount > serverCardCount) {
        // retry sending request to server
        logger.debug(`localCardCount: ${localCardCount} | serverCardCount: ${serverCardCount}`);
        logger.warn("State not synchronized. User's state is ahead of server's state. Retry sending move request to server or request updated state from server.");
        setIsAnimating(false);
        return;
      }

      if (!_.isEqual(localGameState.game.round_cards[localGameState.game.round_cards.length - 1], serverCardsToCompare[localGameState.game.round_cards.length - 1])) {
        const localLastCard = localGameState.game.round_cards[localGameState.game.round_cards.length - 1];
        const serverLastCard = serverCardsToCompare[localGameState.game.round_cards.length - 1];
        logger.debug(`localLastCard: ${localLastCard ? cardToString(localLastCard) : "not played"} | serverLastCard: ${serverLastCard ? cardToString(serverLastCard) : "not played"}`);

        logger.error("Desync detected! Card played by user is not the same on the server.");
        return;
      }

      // case 2 - dummy cards
      if (localGameState.game.tricks.NS.length + localGameState.game.tricks.EW.length <= 1 && localGameState.game.dummy_cards.length === 0 && localGameState.game.round_cards.length > 0) {
        logger.debug("Dummy cards case fired.");

        const dummyDirection = oppositeDirection(localGameState.bidding.declarer!) === localGameState.base.user_direction ? localGameState.bidding.declarer! : oppositeDirection(localGameState.bidding.declarer!);

        // backwards dummy solver
        localGameState.game.dummy_cards = [...serverGameState.game.dummy_cards];

        // combine above foreach into single stream
        [...serverGameState.game.tricks.NS, ...serverGameState.game.tricks.EW].forEach((trick) => {
          const dummyIndex = diffDirection(trick.round_player, dummyDirection);
          localGameState.game.dummy_cards.push(trick.cards[dummyIndex]);
        });

        if (localGameState.game.dummy_cards.length !== 13) {
          localGameState.game.dummy_cards.push(serverCardsToCompare[1]);

          if (serverCardsToCompare.length === 4 &&
            serverGameState.game.round_player === oppositeDirection(localGameState.bidding.declarer!) &&
            serverGameState.game.round_cards.length > 0) {
            localGameState.game.dummy_cards.push(serverGameState.game.round_cards[0]);
          }
        }

        const dummy_cards = [...localGameState.game.dummy_cards.sort(compareCards)].reverse();


        const contexts = cardContextsCopy.filter((context) => cardAssignmentsCopy[dummyDirection].map(assign => assign.index).includes(context.index));

        // update card context and assignment state
        cardAssignmentsCopy[dummyDirection].forEach((assign, index) => {
          assign.card = dummy_cards[index];
          cardContextsCopy[assign.index].cardFront = cardToString(assign.card!);
        });

        const assigns = [...cardAssignmentsCopy[dummyDirection]];

        setTimeout(() => {

          logger.debug("Showing dummy cards.");

          // update real card context state
          contexts.forEach((context) => {
            dispatchCardContext({
              index: context.index, state: { ...cardContexts[context.index], cardFront: cardContextsCopy[context.index].cardFront }
            });
          });

          // update real card assignment state
          dispatchCardAssignments({
            state: {
              direction: dummyDirection,
              type: AssignmentActionType.ASSIGN_BATCH,
              data: assigns,
            }
          });

          // animate dummy cards
          animateDummyShowUp(cardContexts.filter((context) => assigns.map(a => a.index).includes(context.index)),
            playerDirectionToRealDirection(dummyDirection, localGameState.base.user_direction));
        }, animTimeCount);

        animTimeCount += (ANIM_TIME + ANIM_POST_DELAY);

        logger.debug("State after dummy showcase: ", _.cloneDeep(localGameState));
      }

      // case 3 - local < server
      if (localGameState.game.round_cards.length < serverCardsToCompare.length) {
        logger.debug("local < server case fired");

        // next card played by server
        const card = serverCardsToCompare[localGameState.game.round_cards.length];
        const handDirection = localGameState.base.current_player; // after user plays, current player is updated to the next
        const userDirection = localGameState.base.user_direction;
        let cardAssign: CardAssignment = null!;


        if (handDirection === userDirection) { // card played from user's hand
          cardAssign = _.find(cardAssignmentsCopy[handDirection], (assign) => _.isEqual(assign.card, card))!;

          _.remove(localGameState.game.hand, (card) => _.isEqual(card, cardAssign!.card));

          logger.debug(`playing card from user's hand: ${cardToString(cardAssign!.card!)}`);
        } else if (oppositeDirection(handDirection) === localGameState.bidding.declarer || // not user's partner plays from dummy's hand
          (oppositeDirection(userDirection) === localGameState.bidding.declarer && handDirection === localGameState.bidding.declarer)) { // user's partner plays from its hand
          cardAssign = _.find(cardAssignmentsCopy[handDirection], (assign) => _.isEqual(assign.card, card))!;

          _.remove(localGameState.game.dummy_cards, (card) => _.isEqual(card, cardAssign!.card));

          console.log(cardAssign);
          logger.debug(`playing card from dummy's (or partner's if user is declarer) hand: ${cardToString(cardAssign!.card!)}`);
        } else { // random card from hand
          const randomIndex = Math.floor(Math.random() * getHandCount(handDirection, localGameState));
          cardAssign = cardAssignmentsCopy[handDirection][randomIndex];
          cardAssign.card = card;

          logger.debug(`playing card from ${PlayerDirection[handDirection]} hand (hidden card): ${cardToString(cardAssign!.card!)}`);
        }

        localGameState.game.round_cards.push(cardAssign!.card!);

        // update card and assignment context
        cardContextsCopy[cardAssign!.index].cardFront = cardToString(cardAssign!.card!);
        _.remove(cardAssignmentsCopy[handDirection], (assign) => assign.index === cardAssign!.index);
        cardAssignmentsCopy[PLAYED_ASSIGNMENTS].push(cardAssign!);

        const realDirection = playerDirectionToRealDirection(handDirection, userDirection);
        const hand = getHand(localGameState, realDirection)!;
        const assigns = [...cardAssignmentsCopy[handDirection]];

        requestTimeout(() => {
          logger.debug(`Played card ${cardToString(cardAssign!.card!)} by ${PlayerDirection[handDirection]}`);

          // update real card context state
          dispatchCardContext({
            index: cardAssign!.index, state: { ...cardContexts[cardAssign!.index], cardFront: cardContextsCopy[cardAssign!.index].cardFront }
          });

          // update real card assignment state
          dispatchCardAssignments({
            state: {
              direction: handDirection,
              type: AssignmentActionType.MOVE_TO_PLAYED,
              data: cardAssign!,
            }
          });

          // play card to middle
          animateCardPlay(cardContexts[cardAssign!.index], realDirection);

          // center hand
          setTimeout(() => {
            animateHand(hand, 0, assigns.map(assign => assign.index), dispatchCardContext, cardContexts, 0, easings.easeInOutExpo);
          }, ANIM_HAND_DELAY);

        }, animTimeCount);

        animTimeCount += (ANIM_TIME + ANIM_HAND_DELAY + ANIM_POST_DELAY);

        // update next player
        localGameState.base.current_player = nextDirection(localGameState.base.current_player);

        logger.debug(`State after ${PlayerDirection[handDirection]}'s play: `, _.cloneDeep(localGameState));
      }

      // case 4 - 4 cards
      if (localGameState.game.round_cards.length === 4 && localGameState.game.round_cards.length === serverCardsToCompare.length) {
        logger.debug("4 cards case fired");

        const assigns = cardAssignmentsCopy[PLAYED_ASSIGNMENTS].filter((assign) => _.some(localGameState.game.round_cards, (card) => _.isEqual(card, assign.card!)));
        const contexts = cardContexts.filter((context) => assigns.map(a => a.index).includes(context.index));

        localGameState = cleanRound(localGameState);

        const winningDirection = localGameState.game.round_player;


        requestTimeout(() => {
          logger.info(`Round finished. Winner of round is ${PlayerDirection[winningDirection]}`);

          animateCleanRound(contexts, playerDirectionToRealDirection(winningDirection, localGameState.base.user_direction));
        }, animTimeCount);

        animTimeCount += (ANIM_TIME + ANIM_POST_DELAY);

        logger.debug(`State after ${PlayerDirection[winningDirection]} winning the round: `, _.cloneDeep(localGameState));
      }
    }

    requestTimeout(() => {
      logger.info("State synchronization finished.");

      setLocalGameState(localGameState);

      setIsAnimating(false);

      updateUserInterface(localGameState, cardAssignmentsCopy, dispatchCardState, setCanUserInteract);
    }, animTimeCount);
  }, [cardAssignments, cardContexts]);

  useEffect(() => {
    if (canUserInteract || isAnimating) return;

    if (!_.isEqual(serverGameState, localGameState)) {
      logger.info("Detetected difference between server and local game state.");
      logger.debug("server state: ", _.cloneDeep(serverGameState));
      logger.debug("local state: ", _.cloneDeep(localGameState));

      setIsAnimating(true);
      processDifference(serverGameState, localGameState);
    }
  }, [canUserInteract, isAnimating, localGameState, processDifference, serverGameState]);

  // initial game state
  useEffect(() => {
    if (isGameInitialized) return;
    setIsGameInitialized(true);

    setLocalGameState(serverGameState);

    logger.info("Initializing game...");

    const cardAssignmentsCopy = _.cloneDeep(cardAssignments);

    requestTimeout(() => {

      // play hands
      const userHand = getBottomHand(localGameState);
      const leftHand = getLeftHand(localGameState);
      const topHand = getTopHand(localGameState);
      const rightHand = getRightHand(localGameState);

      let globalIndex = 0;
      [userHand, leftHand, topHand, rightHand].forEach((hand) => {

        logger.debug(`Assigning hand ${PlayerDirection[hand.direction]} with ${hand.cards.length} cards | ${hand.cards.map(o => cardToString(o.card)).join(", ")}`);

        cardAssignmentsCopy[hand.direction] = hand.cards.map((card, index) => ({
          card: card.card,
          index: globalIndex + index,
        }));

        dispatchCardAssignments({
          state: {
            direction: hand.direction,
            type: AssignmentActionType.ASSIGN_BATCH,
            data: cardAssignmentsCopy[hand.direction],
          }
        });

        const assignIndexes = hand.cards.map((_, index) => globalIndex + index);

        assignIndexes.forEach(i => dispatchCardState({ index: i, state: { disabled: true } }));
        animateHand(hand, globalIndex, assignIndexes, dispatchCardContext, cardContexts);

        globalIndex += hand.cards.length;
      });


      let assigns: CardAssignment[] = [];

      // play round cards
      let direction = localGameState.game.round_player;
      logger.debug(`Assigning round cards ${localGameState.game.round_cards.map(cardToString).join(", ")}`);
      localGameState.game.round_cards.forEach((card, index) => {
        const assign = {
          card: card,
          index: globalIndex + index,
        };
        assigns.push(assign);

        dispatchCardContext({
          index: assign.index, state: { ...cardContexts[assign.index], cardFront: cardToString(assign.card!) }
        });

        const realDirection = playerDirectionToRealDirection(direction, localGameState.base.user_direction);

        requestTimeout(() => {
          animateCardPlay(cardContexts[assign.index], realDirection);
        }, ANIM_DELAY * (globalIndex - 1));

        direction = nextDirection(direction);
      });

      globalIndex += localGameState.game.round_cards.length;


      // remove played tricks from view
      const hideTrick = (trick: Trick) => {

        logger.debug(`Removing ${PlayerDirection[trick.winner]}'s trick of ${trick.cards.map(cardToString).join(", ")} from view`);

        trick.cards.forEach((card, index) => {
          const assign = {
            card: card,
            index: globalIndex + index,
          };
          assigns.push(assign);

          cardContexts[assign.index].api.start({
            scale: 0,
            config: { duration: 0 }
          });
        });

        globalIndex += trick.cards.length;
      };
      localGameState.game.tricks.NS.forEach(hideTrick);
      localGameState.game.tricks.EW.forEach(hideTrick);


      cardAssignmentsCopy[PLAYED_ASSIGNMENTS] = assigns;

      dispatchCardAssignments({
        state: {
          direction: PLAYED_ASSIGNMENTS,
          type: AssignmentActionType.ASSIGN_BATCH,
          data: assigns,
        }
      });


      requestTimeout(() => {
        updateUserInterface(localGameState, cardAssignmentsCopy, dispatchCardState, setCanUserInteract);

        setIsAnimating(false);

        logger.info("Game initialized");
        logger.info("Current game state: ", localGameState);
      }, ANIM_DELAY * (globalIndex - 1) + ANIM_TIME);
    }, 250);
  }, [cardAssignments, cardContexts, isGameInitialized, localGameState, serverGameState]);


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

  const [gameStates, setGameStates] = useState<GameState[]>([
    {
      base: {
        game_stage: GameStage.PLAYING,
        current_player: PlayerDirection.SOUTH,
        user_direction: PlayerDirection.EAST,
      },
      bidding: {
        first_dealer: PlayerDirection.WEST,
        bid_history: [],
        bid: {
          suit: BidSuit.SPADES,
          tricks: BidTricks.THREE,
        },
        declarer: PlayerDirection.WEST,
        multiplier: 1,
      },
      game: {
        round_player: PlayerDirection.SOUTH,
        round_cards: [
        ],
        dummy_cards: [
        ],
        tricks: {
          NS: [
            {
              round_player: PlayerDirection.WEST,
              winner: PlayerDirection.NORTH,
              cards: [
                { suit: CardSuit.SPADES, rank: CardRank.JACK },
                { suit: CardSuit.SPADES, rank: CardRank.QUEEN },
                { suit: CardSuit.HEARTS, rank: CardRank.KING },
                { suit: CardSuit.HEARTS, rank: CardRank.FIVE },
              ]
            },
            {
              round_player: PlayerDirection.NORTH,
              winner: PlayerDirection.NORTH,
              cards: [
                { suit: CardSuit.SPADES, rank: CardRank.ACE },
                { suit: CardSuit.SPADES, rank: CardRank.SEVEN },
                { suit: CardSuit.CLUBS, rank: CardRank.FOUR },
                { suit: CardSuit.HEARTS, rank: CardRank.FIVE },
              ]
            },
            {
              round_player: PlayerDirection.WEST,
              winner: PlayerDirection.NORTH,
              cards: [
                { suit: CardSuit.DIAMONDS, rank: CardRank.FOUR },
                { suit: CardSuit.DIAMONDS, rank: CardRank.SIX },
                { suit: CardSuit.DIAMONDS, rank: CardRank.FIVE },
                { suit: CardSuit.DIAMONDS, rank: CardRank.TWO },
              ]
            },
            {
              round_player: PlayerDirection.EAST,
              winner: PlayerDirection.SOUTH,
              cards: [
                { suit: CardSuit.CLUBS, rank: CardRank.ACE },
                { suit: CardSuit.SPADES, rank: CardRank.ACE },
                { suit: CardSuit.CLUBS, rank: CardRank.THREE },
                { suit: CardSuit.CLUBS, rank: CardRank.FIVE },
              ]
            },
            {
              round_player: PlayerDirection.SOUTH,
              winner: PlayerDirection.SOUTH,
              cards: [
                { suit: CardSuit.DIAMONDS, rank: CardRank.ACE },
                { suit: CardSuit.DIAMONDS, rank: CardRank.FIVE },
                { suit: CardSuit.DIAMONDS, rank: CardRank.EIGHT },
                { suit: CardSuit.DIAMONDS, rank: CardRank.FOUR },
              ]
            },
            {
              round_player: PlayerDirection.SOUTH,
              winner: PlayerDirection.NORTH,
              cards: [
                { suit: CardSuit.DIAMONDS, rank: CardRank.QUEEN },
                { suit: CardSuit.CLUBS, rank: CardRank.ACE },
                { suit: CardSuit.SPADES, rank: CardRank.TEN },
                { suit: CardSuit.HEARTS, rank: CardRank.TEN },
              ]
            },
            {
              round_player: PlayerDirection.NORTH,
              winner: PlayerDirection.SOUTH,
              cards: [
                { suit: CardSuit.CLUBS, rank: CardRank.SEVEN },
                { suit: CardSuit.CLUBS, rank: CardRank.EIGHT },
                { suit: CardSuit.CLUBS, rank: CardRank.JACK },
                { suit: CardSuit.CLUBS, rank: CardRank.EIGHT },
              ]
            },
          ],
          EW: [
            {
              round_player: PlayerDirection.NORTH,
              winner: PlayerDirection.EAST,
              cards: [
                { suit: CardSuit.DIAMONDS, rank: CardRank.TWO },
                { suit: CardSuit.CLUBS, rank: CardRank.THREE },
                { suit: CardSuit.DIAMONDS, rank: CardRank.QUEEN },
                { suit: CardSuit.HEARTS, rank: CardRank.TEN },
              ]
            },
            {
              round_player: PlayerDirection.EAST,
              winner: PlayerDirection.WEST,
              cards: [
                { suit: CardSuit.DIAMONDS, rank: CardRank.NINE },
                { suit: CardSuit.SPADES, rank: CardRank.FOUR },
                { suit: CardSuit.SPADES, rank: CardRank.QUEEN },
                { suit: CardSuit.HEARTS, rank: CardRank.TWO },
              ]
            },
            {
              round_player: PlayerDirection.NORTH,
              winner: PlayerDirection.WEST,
              cards: [
                { suit: CardSuit.HEARTS, rank: CardRank.FIVE },
                { suit: CardSuit.HEARTS, rank: CardRank.FIVE },
                { suit: CardSuit.CLUBS, rank: CardRank.FOUR },
                { suit: CardSuit.HEARTS, rank: CardRank.KING },
              ]
            },
            {
              round_player: PlayerDirection.NORTH,
              winner: PlayerDirection.EAST,
              cards: [
                { suit: CardSuit.HEARTS, rank: CardRank.JACK },
                { suit: CardSuit.SPADES, rank: CardRank.TWO },
                { suit: CardSuit.CLUBS, rank: CardRank.THREE },
                { suit: CardSuit.DIAMONDS, rank: CardRank.NINE },
              ]
            },
            {
              round_player: PlayerDirection.EAST,
              winner: PlayerDirection.EAST,
              cards: [
                { suit: CardSuit.SPADES, rank: CardRank.JACK },
                { suit: CardSuit.SPADES, rank: CardRank.THREE },
                { suit: CardSuit.SPADES, rank: CardRank.TWO },
                { suit: CardSuit.SPADES, rank: CardRank.FOUR },
              ]
            },
            {
              round_player: PlayerDirection.EAST,
              winner: PlayerDirection.EAST,
              cards: [
                { suit: CardSuit.SPADES, rank: CardRank.QUEEN },
                { suit: CardSuit.DIAMONDS, rank: CardRank.TWO },
                { suit: CardSuit.SPADES, rank: CardRank.SEVEN },
                { suit: CardSuit.SPADES, rank: CardRank.FIVE },
              ]
            },
          ],
        },
        hand: [
        ],
      },
    },
  ]);

  return (
    <GameContext.Provider value={gameContext}>
      <div className="absolute z-50 btn btn-primary">
        Hello :D
      </div>
      {children}
    </GameContext.Provider>
  );
}