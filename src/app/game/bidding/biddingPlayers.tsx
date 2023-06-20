import { PlayerDirection } from "@/app/game/gameModels";

function BiddingPlayers({
  current_player,
}: {
  current_player: PlayerDirection;
}) {

  
  return (
    <div className="flex flex-row justify-center gap-4">
      {Object.keys(PlayerDirection)
        .filter((key) => isNaN(Number(key)))
        .map((directionValue) => {
          const playerDirection: PlayerDirection = PlayerDirection[
            directionValue as keyof typeof PlayerDirection
          ];
          return (
            <div
              key={playerDirection}
              className={
                "avatar placeholder transition ease-in-out ring-primary rounded-full " +
                (playerDirection.valueOf() === current_player.valueOf()
                  ? "scale-125 ring-2"
                  : "scale-100 ring-0")
              }
            >
              <div className="bg-neutral-focus text-neutral-content rounded-full w-12">
                <span className="text-xl">{directionValue[0]}</span>
              </div>
            </div>
          );
        })}
    </div>
  );
}

export default BiddingPlayers;
