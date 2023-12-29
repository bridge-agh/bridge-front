import { Player } from "@/api/session";
import { useCallback, useEffect, useState } from "react";
import { BsPersonCircle, BsQuestionCircle } from "react-icons/bs";
import { FaExchangeAlt } from "react-icons/fa";
import { RiVipCrownLine, RiVipCrownFill } from "react-icons/ri";
import { PiMonitorDuotone } from "react-icons/pi";
import { TiDelete } from "react-icons/ti";
import { twMerge } from "tailwind-merge";
import {
  PlayerDirection,
  getPlayerDirectionName,
} from "@/game_engine/gameModels";

export default function PlayerPanel({
  player,
  userId,
  host,
  position,
  addPositionToSwap,
  positionsToSwap,
  promoteHost,
  setAssistant,
  kick
}: {
  player: Player | undefined | null;
  userId: string;
  host: Player | undefined;
  position: PlayerDirection;
  addPositionToSwap: (position: PlayerDirection) => void;
  positionsToSwap: PlayerDirection[];
  promoteHost: (userId: string) => void;
  setAssistant: (direction: PlayerDirection) => void;
  kick: (id: string) => void;
}) {
  const [nameText, setNameText] = useState(player?.id);
  const [isPlayer, setIsPlayer] = useState(false);
  const [isHumanPlayer, setIsHumanPlayer] = useState(false);
  const [animation, setAnimation] = useState("");
  const [exchangeButtonHovered, setExchangeButtonHovered] = useState(false);
  const [kickButtonHovered, setKickButtonHovered] = useState(false);
  const [crownButtonHovered, setCrownButtonHovered] = useState(false);
  const [assistantButtonHovered, setAssistantButtonHovered] = useState(false);
  const changeNameText = useCallback(
    (newName: string) => {
      if (nameText == null) setNameText(newName);
      else if (nameText != newName) {
        setAnimation("animate-fade-in");
        setTimeout(() => {
          setNameText(newName);
          setAnimation("animate-fade-out");
        }, 300);
      }
    },
    [nameText]
  );

  useEffect(() => {
    if (player != null && player != undefined) {
      if (player.isHuman) setIsHumanPlayer(true);
      changeNameText(player.displayName || player.id);
      setIsPlayer(true);
    } else {
      changeNameText("Waiting...");
      setIsPlayer(false);
      setIsHumanPlayer(false);
    }
  }, [player, changeNameText]);

  return (
    <div key={player?.id} className="flex flex-col justify-start items-start items-stretch min-w-[100%] mb-4">
      <div className="mb-1 flex justify-end">
        <div className="w-11 ms:w-14 relative text-accent-content text-center text-sm ms:text-base font-bold mr-auto">
          {isPlayer && player?.id == host?.id && (
            <RiVipCrownFill className="absolute bottom-5 inset-x-1/4 w-[20px] h-[20px] ms:w-[30px] ms:h-[30px] text-yellow-500 animate-fade-out" />
          )}
          <div>{getPlayerDirectionName(position)}</div>
        </div>
        <div
          className={twMerge(
            "tooltip  tooltip-left ms:tooltip-top before:max-w-[6rem] lg:before:max-w-[20rem] before:content-[attr(data-tip)]",
            position == positionsToSwap[0] && !host?.ready
              ? "tooltip-accent"
              : "tooltip-primary"
          )}
          data-tip="Change player's position"
        >
          {userId == host?.id &&
          (isPlayer || (positionsToSwap.length > 0 && !host?.ready)) && (
            <FaExchangeAlt
              className={twMerge(animation, "mr-3 w-[15px] h-[15px] ms:w-[22px] ms:h-[22px] shrink-0", host?.ready ? "opacity-50" : "cursor-pointer")}
              onClick={() => {if (!host?.ready) addPositionToSwap(position);}}
              onMouseEnter={() => {if (!host?.ready) setExchangeButtonHovered(true);}}
              onMouseLeave={() => {if (!host?.ready) setExchangeButtonHovered(false);}}
              onAnimationStart={() => {if (!host?.ready) setExchangeButtonHovered(false);}}
            />
          )}
        </div>
        <div
          className="tooltip  tooltip-warning tooltip-left ms:tooltip-top before:max-w-[6rem] lg:before:max-w-[20rem] before:content-[attr(data-tip)]"
          data-tip="Promote player to a host"
        >
          {isHumanPlayer && player?.id != userId && userId == host?.id && (
            <RiVipCrownLine
              className={twMerge(
                animation,
                "w-[15px] h-[15px] ms:w-[22px] ms:h-[22px] text-yellow-500 mr-3",
                host?.ready ? "opacity-50" : "cursor-pointer"
              )}
              onClick={() => {
                if (!host?.ready && player != null) promoteHost(player.id);
              }}
              onMouseEnter={() => {
                if (!host?.ready) setCrownButtonHovered(true);
              }}
              onMouseLeave={() => {
                if (!host?.ready) setCrownButtonHovered(false);
              }}
            />
          )}
        </div>
        <div
          className="tooltip  tooltip-info tooltip-left ms:tooltip-top before:max-w-[6rem] lg:before:max-w-[20rem] before:content-[attr(data-tip)]"
          data-tip="Assign virtual assistant"
        >
          {!isPlayer && (
            <PiMonitorDuotone
              className={twMerge(
                animation,
                "w-[15px] h-[15px] ms:w-[22px] ms:h-[22px] text-info mr-3",
                host?.ready ? "opacity-50" : "cursor-pointer"
              )}
              onClick={() => setAssistant(position)}
              onMouseEnter={() => {
                if (!host?.ready) setAssistantButtonHovered(true);
              }}
              onMouseLeave={() => {
                if (!host?.ready) setAssistantButtonHovered(false);
              }}
            />
          )}
        </div>
        <div
          className="tooltip  tooltip-error  tooltip-left ms:tooltip-top before:max-w-[6rem] lg:before:max-w-[20rem] before:content-[attr(data-tip)]"
          data-tip="Kick player from the lobby"
        >
          {player?.id != userId && userId == host?.id && isPlayer && (
            <TiDelete
              className={twMerge(
                animation,
                "w-[20px] h-[20px] ms:w-[25px] ms:h-[25px] mr-3 shrink-0 text-error ",
                host?.ready ? "opacity-50" : "cursor-pointer"
              )}
              onClick={() => {if (!host?.ready && player != null) kick(player.id);}}
              onMouseEnter={() => {
                if (!host?.ready) setKickButtonHovered(true);
              }}
              onMouseLeave={() => {
                if (!host?.ready) setKickButtonHovered(false);
              }}
            />
          )}
        </div>
      </div>
      <div
        className={twMerge(
          "flex flex-row pe-2 rounded-full justify-start items-center bg-base-300 w-[100%] transition-all",
          exchangeButtonHovered ? "ring-4 ring-primary" : "",
          position == positionsToSwap[0] && !host?.ready
            ? "ring-4 ring-accent"
            : "",
          kickButtonHovered ? "ring-4 ring-error" : "",
          crownButtonHovered ? "ring-4 ring-yellow-300" : "",
          assistantButtonHovered ? "ring-4 ring-info" : ""
        )}
      >
        <div
          className={`w-11 h-11 ms:w-14 ms:h-14 rounded-full duration-500 ${
            player?.ready ? "bg-green-600" : "bg-blue-600"
          } flex flex-col justify-center items-center relative`}
        >
          {(isPlayer && (
            <BsPersonCircle className="w-11 h-11 ms:w-14 ms:h-14" />
          )) || <BsQuestionCircle className="w-11 h-11 ms:w-14 ms:h-14 " />}
        </div>

        <div
          className={twMerge(
            "ml-2 font-semibold ms:text-lg ms:font-bold truncate hover:break-all hover:whitespace-normal"
          )}
        >
          <span className={twMerge(animation)}>{nameText}</span>
        </div>
      </div>
    </div>
  );
}
