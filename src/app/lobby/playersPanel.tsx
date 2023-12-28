import { Player } from "@/api/session";
import { PlayerDirection } from "@/game_engine/gameModels";
import PlayerPanel from "./playerPanel";
import { useForceSwap, usePromoteHost, useSetAssistant, useKick } from "@/api/session/lobby";
import { useCallback, useEffect, useState } from "react";

export default function PlayersPanel({
  players,
  userId,
  host,
}: {
  players: Player[];
  userId: string;
  host: Player | undefined;
}) {
  const promoteHost = usePromoteHost();
  const forceSwap = useForceSwap();
  const [positionsToSwap, setPositionsToSwap] = useState<PlayerDirection[]>([]);
  const setAssistant = useSetAssistant();
  const kick = useKick();

  const handleForceSwap = useCallback(() => {
    if (forceSwap.loading || positionsToSwap.length != 2) return;
    forceSwap.trigger({ first: positionsToSwap[0], second: positionsToSwap[1] });
  }, [forceSwap, positionsToSwap]);

  const addPositionToSwap = useCallback((position: PlayerDirection) => {
    setPositionsToSwap((positions) => {
      const newPositions = [...positions];
      if (newPositions.length < 2) newPositions.push(position);
      return newPositions;
    });
  }, []);

  const handleSetHost = useCallback((userId: string) => {
    if (promoteHost.loading) return;
    promoteHost.trigger({ userId: userId });
  }, [promoteHost]);

  const handleSetAssistant = useCallback((direction: PlayerDirection) => {
    if (setAssistant.loading) return;
    setAssistant.trigger({direction: direction});
  }, [setAssistant]);
  
  const handleKick = useCallback((id: string) => {
    if (kick.loading) return;
    kick.trigger({id: id});
  }, [kick]);

  useEffect(() => {
    if (positionsToSwap.length == 2) {
      if (positionsToSwap[0] != positionsToSwap[1]) handleForceSwap();
      setPositionsToSwap([]);
    }
  }, [positionsToSwap, handleForceSwap]);

  const directionToPlayer = useCallback((direction: PlayerDirection, key: number) => {
    const player = players.find((p) => p.position == direction);
    return (
      <PlayerPanel
        key={key}
        player={player}
        userId={userId}
        host={host}
        position={direction}
        addPositionToSwap={addPositionToSwap}
        positionsToSwap={positionsToSwap}
        promoteHost={handleSetHost}
        setAssistant={handleSetAssistant}
        kick={handleKick}
      />
    );
  }, [addPositionToSwap, handleKick, handleSetAssistant, handleSetHost, host, players, positionsToSwap, userId]);

  return (
    <div className="flex flex-col gap-4 md:flex-row justify-between items-center mb-3">
      <div className="flex w-[90%] sm:w-[70%] md:w-[43%] flex-col justify-start items-stretch gap-4">
        {[PlayerDirection.NORTH, PlayerDirection.SOUTH].map((direction, i) => directionToPlayer(direction, i))}
      </div>
      <div className="flex w-[90%] sm:w-[70%] md:w-[43%] flex-col justify-start items-stretch gap-4">
        {[PlayerDirection.EAST, PlayerDirection.WEST].map((direction, i) => directionToPlayer(direction, i))}
      </div>
    </div>
  );
}
