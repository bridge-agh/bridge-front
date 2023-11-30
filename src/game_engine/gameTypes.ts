import { SpringRef } from "@react-spring/three";
import { BiddingObservation, Card, PlayerDirection } from "./gameModels";

// cards context

export type SpringCardApiRef = SpringRef<{
    position: any;
    scale: any;
    rotation: any;
}>

export interface CardContext {
    index: number;
    cardFront: string;
    api: SpringCardApiRef;
    props: {
        position: any;
        scale: any;
        rotation: any;
    };
}

export interface CardState {
    disabled: boolean;
}


// assignments context

export interface CardAssignment {
    card: Card | null;
    index: number;
};

export enum AssignmentActionType {
    ASSIGN_BATCH,
    MOVE_TO_PLAYED,
}

export interface AssignmentAction {
    direction: PlayerDirection | typeof PLAYED_ASSIGNMENTS;
    type: AssignmentActionType;
    data: CardAssignment | CardAssignment[];
}

export const PLAYED_ASSIGNMENTS = 4;


// positions context

export type SpringPositionsApiRef = SpringRef<{
    opacity: any;
}>

export interface PositionContext {
    direction: PlayerDirection;
    position: number[];
    scale: number;
    visible: boolean;
    selected: boolean;
}

// game controller context

export type BiddingState = {
    currentPlayer: PlayerDirection;
    userDirection: PlayerDirection;
    observation: BiddingObservation;
}

export interface GameControllerContext {
    cards: CardContext[];
    onPointerEnter: (springCard: CardContext) => void;
    onPointerLeave: (springCard: CardContext) => void;
    onClick: (springCard: CardContext) => void;
    positions: PositionContext[];
    bidding: BiddingState
}