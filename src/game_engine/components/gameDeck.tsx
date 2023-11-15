// import { PlayerDirection } from "@/app/game/gameModels";
// import { Vector3 } from "three";
// import { GameCard } from "./gameCard";

// export default function GameDeck({
//   direction,
//   count,
// }: {
//   direction: PlayerDirection;
//   count: number;
// }) {
//   var x = 0;
//   var y = 0;
//   var z = 0;
//   var rotation: number;

//   const x_rotated = 2;
//   const y_non_rotated = 1.3;

//   switch (direction) {
//     case PlayerDirection.NORTH:
//       x = 0;
//       y = y_non_rotated;
//       rotation = 0;
//       break;
//     case PlayerDirection.SOUTH:
//       x = 0;
//       y = -y_non_rotated;
//       rotation = 0;
//       break;
//     case PlayerDirection.EAST:
//       x = x_rotated;
//       y = 0;
//       rotation = -Math.PI / 2;
//       break;
//     case PlayerDirection.WEST:
//       x = -x_rotated;
//       y = 0;
//       rotation = Math.PI / 2;
//       break;
//   }

//   var scale = 0.58;

//   const cardWidth = 0.57 * scale;
//   const cardSpacing = -.1;
//   const cardXOffset = cardWidth + cardSpacing;

//   var cardX = x - (cardXOffset * count) / 2 + cardXOffset / 2;
//   var cardY = y - (cardXOffset * count) / 2 + cardXOffset / 2;

//   return (
//     <>
//       {Array.from(Array(count).keys()).map((i) => {
//         return (
//           <GameCard
//             cardFront="7S"
//             position={new Vector3(
//               rotation ? x : cardX + cardXOffset * i,
//               rotation ? cardY + cardXOffset * i : y,
//               z + 0.001 * i
//             )}
//             rotation={new Vector3(0, 0.08, rotation)}
//             key={i}
//             scale={scale}
//           />
//         );
//       })}
//     </>
//   );
// }
