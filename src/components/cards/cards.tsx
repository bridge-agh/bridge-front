import { Card, CardRank, CardSuit } from "@/app/game/gameModels";
import TwoClubs from "./cards/TwoClubs";
import ThreeClubs from "./cards/ThreeClubs";
import FourClubs from "./cards/FourClubs";
import FiveClubs from "./cards/FiveClubs";
import SixClubs from "./cards/SixClubs";
import SevenClubs from "./cards/SevenCLubs";
import EightClubs from "./cards/EightClubs";
import NineClubs from "./cards/NineClubs";
import TenClubs from "./cards/TenClubs";
import JackClubs from "./cards/JackClubs";
import QueenClubs from "./cards/QueenClubs";
import KingClubs from "./cards/KingClubs";
import AceClubs from "./cards/AceClubs";
import TwoDiamonds from "./cards/TwoDiamonds";
import ThreeDiamonds from "./cards/ThreeDiamonds";
import FourDiamonds from "./cards/FourDiamonds";
import FiveDiamonds from "./cards/FiveDiamonds";
import SixDiamonds from "./cards/SixDiamonds";
import SevenDiamonds from "./cards/SevenDiamonds";
import EightDiamonds from "./cards/EightDiamonds";
import NineDiamonds from "./cards/NineDiamonds";
import TenDiamonds from "./cards/TenDiamonds";
import JackDiamonds from "./cards/JackDiamonds";
import QueenDiamonds from "./cards/QueenDiamonds";
import KingDiamonds from "./cards/KingDiamonds";
import AceDiamonds from "./cards/AceDiamonds";
import TwoHearts from "./cards/TwoHearts";
import ThreeHearts from "./cards/ThreeHearts";
import FourHearts from "./cards/FourHearts";
import FiveHearts from "./cards/FiveHearts";
import SixHearts from "./cards/SixHearts";
import SevenHearts from "./cards/SevenHearts";
import EightHearts from "./cards/EightHearts";
import NineHearts from "./cards/NineHearts";
import TenHearts from "./cards/TenHearts";
import JackHearts from "./cards/JackHearts";
import QueenHearts from "./cards/QueenHearts";
import KingHearts from "./cards/KingHearts";
import AceHearts from "./cards/AceHearts";
import TwoSpades from "./cards/TwoSpades";
import ThreeSpades from "./cards/ThreeSpades";
import FourSpades from "./cards/FourSpades";
import FiveSpades from "./cards/FiveSpades";
import SixSpades from "./cards/SixSpades";
import SevenSpades from "./cards/SevenSpades";
import EightSpades from "./cards/EightSpades";
import NineSpades from "./cards/NineSpades";
import TenSpades from "./cards/TenSpades";
import JackSpades from "./cards/JackSpades";
import QueenSpades from "./cards/QueenSpades";
import AceSpades from "./cards/AceSpades";
import KingSpades from "./cards/KingSpades";

const cardToComponentMap = new Map<
  string,
  React.FC<{ className?: string; background: string; fill: string }>
>([
  [CardSuit.CLUBS + CardRank.TWO, TwoClubs],
  [CardSuit.CLUBS + CardRank.THREE, ThreeClubs],
  [CardSuit.CLUBS + CardRank.FOUR, FourClubs],
  [CardSuit.CLUBS + CardRank.FIVE, FiveClubs],
  [CardSuit.CLUBS + CardRank.SIX, SixClubs],
  [CardSuit.CLUBS + CardRank.SEVEN, SevenClubs],
  [CardSuit.CLUBS + CardRank.EIGHT, EightClubs],
  [CardSuit.CLUBS + CardRank.NINE, NineClubs],
  [CardSuit.CLUBS + CardRank.TEN, TenClubs],
  [CardSuit.CLUBS + CardRank.JACK, JackClubs],
  [CardSuit.CLUBS + CardRank.QUEEN, QueenClubs],
  [CardSuit.CLUBS + CardRank.KING, KingClubs],
  [CardSuit.CLUBS + CardRank.ACE, AceClubs],
  [CardSuit.DIAMONDS + CardRank.TWO, TwoDiamonds],
  [CardSuit.DIAMONDS + CardRank.THREE, ThreeDiamonds],
  [CardSuit.DIAMONDS + CardRank.FOUR, FourDiamonds],
  [CardSuit.DIAMONDS + CardRank.FIVE, FiveDiamonds],
  [CardSuit.DIAMONDS + CardRank.SIX, SixDiamonds],
  [CardSuit.DIAMONDS + CardRank.SEVEN, SevenDiamonds],
  [CardSuit.DIAMONDS + CardRank.EIGHT, EightDiamonds],
  [CardSuit.DIAMONDS + CardRank.NINE, NineDiamonds],
  [CardSuit.DIAMONDS + CardRank.TEN, TenDiamonds],
  [CardSuit.DIAMONDS + CardRank.JACK, JackDiamonds],
  [CardSuit.DIAMONDS + CardRank.QUEEN, QueenDiamonds],
  [CardSuit.DIAMONDS + CardRank.KING, KingDiamonds],
  [CardSuit.DIAMONDS + CardRank.ACE, AceDiamonds],
  [CardSuit.HEARTS + CardRank.TWO, TwoHearts],
  [CardSuit.HEARTS + CardRank.THREE, ThreeHearts],
  [CardSuit.HEARTS + CardRank.FOUR, FourHearts],
  [CardSuit.HEARTS + CardRank.FIVE, FiveHearts],
  [CardSuit.HEARTS + CardRank.SIX, SixHearts],
  [CardSuit.HEARTS + CardRank.SEVEN, SevenHearts],
  [CardSuit.HEARTS + CardRank.EIGHT, EightHearts],
  [CardSuit.HEARTS + CardRank.NINE, NineHearts],
  [CardSuit.HEARTS + CardRank.TEN, TenHearts],
  [CardSuit.HEARTS + CardRank.JACK, JackHearts],
  [CardSuit.HEARTS + CardRank.QUEEN, QueenHearts],
  [CardSuit.HEARTS + CardRank.KING, KingHearts],
  [CardSuit.HEARTS + CardRank.ACE, AceHearts],
  [CardSuit.SPADES + CardRank.TWO, TwoSpades],
  [CardSuit.SPADES + CardRank.THREE, ThreeSpades],
  [CardSuit.SPADES + CardRank.FOUR, FourSpades],
  [CardSuit.SPADES + CardRank.FIVE, FiveSpades],
  [CardSuit.SPADES + CardRank.SIX, SixSpades],
  [CardSuit.SPADES + CardRank.SEVEN, SevenSpades],
  [CardSuit.SPADES + CardRank.EIGHT, EightSpades],
  [CardSuit.SPADES + CardRank.NINE, NineSpades],
  [CardSuit.SPADES + CardRank.TEN, TenSpades],
  [CardSuit.SPADES + CardRank.JACK, JackSpades],
  [CardSuit.SPADES + CardRank.QUEEN, QueenSpades],
  [CardSuit.SPADES + CardRank.KING, KingSpades],
  [CardSuit.SPADES + CardRank.ACE, AceSpades],
]);

function cardToComponent(card: Card) {
  if (card) return cardToComponentMap.get(card.suit + card.rank);
  return undefined;
}

export default cardToComponent;
