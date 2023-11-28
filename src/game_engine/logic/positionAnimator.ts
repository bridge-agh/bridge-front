import { PlayerDirection } from "../gameModels";
import { PositionContext } from "../gameTypes";

export function showPositions(positionContexts: PositionContext[], dispatchPositionContext: any) {
  positionContexts.forEach((positionContext, index) => {
    dispatchPositionContext({ index: index, state: { ...positionContext, visible: true } });
  });
}

export function setSelectedPosition(positionContexts: PositionContext[], dispatchPositionContext: any, direction: PlayerDirection) {
  positionContexts.forEach((positionContext, index) => {
    dispatchPositionContext({ index: index, state: { ...positionContext, selected: positionContext.direction === direction } });
  });
}