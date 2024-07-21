import { DateTime } from "luxon";
import { useState } from "react";
import { Day } from "../server/getSurfDays";

type SurfDayProps = {
  day: Day;
};

type BackgroundColours =
  | "bg-indigo-200"
  | "bg-lime-200"
  | "bg-orange-200"
  | "bg-red-200"
  | "bg-fuchsia-200"
  | "bg-yellow-200"
  | "bg-slate-200";

type HoverBackgroundColours =
  | "hover:bg-indigo-400"
  | "hover:bg-lime-400"
  | "hover:bg-orange-400"
  | "hover:bg-red-400"
  | "hover:bg-fuchsia-400"
  | "hover:bg-yellow-400"
  | "hover:bg-slate-400";

type TileState = {
  description: string;
  backgroundColour: BackgroundColours;
  hoverBackgroundColour: HoverBackgroundColours;
};

type DayInfo =
  | "surfed"
  | "skipped"
  | "injured"
  | "rest"
  | "travel"
  | "flat"
  | "unknown";

export const SurfDay = ({ day }: SurfDayProps) => {
  const [hovering, setHovering] = useState(false);

  const getDayInfo = (day: Day): DayInfo => {
    if (
      day.surfed === undefined &&
      day.sickOrInjured === undefined &&
      day.restDay === undefined &&
      day.travel === undefined
    )
      return "unknown";

    if (day.surfed) return "surfed";

    if (day.sickOrInjured) return "injured";

    if (day.restDay) return "rest";

    if (day.travel) return "travel";

    if (day.flat) return "flat";

    return "skipped";
  };

  const getTileState = (info: DayInfo): TileState => {
    switch (info) {
      case "surfed":
        return {
          description: "Surfed!!",
          backgroundColour: "bg-lime-200",
          hoverBackgroundColour: "hover:bg-lime-400",
        };

      case "rest":
        return {
          description: "Rest :)",
          backgroundColour: "bg-indigo-200",
          hoverBackgroundColour: "hover:bg-indigo-400",
        };

      case "injured":
        return {
          description: "Oh no :'(",
          backgroundColour: "bg-orange-200",
          hoverBackgroundColour: "hover:bg-orange-400",
        };

      case "skipped":
        return {
          description: "Aww :(",
          backgroundColour: "bg-red-200",
          hoverBackgroundColour: "hover:bg-red-400",
        };

      case "travel":
        return {
          description: "Away...",
          backgroundColour: "bg-fuchsia-200",
          hoverBackgroundColour: "hover:bg-fuchsia-400",
        };

      case "flat":
        return {
          description: "Flat!!",
          backgroundColour: "bg-yellow-200",
          hoverBackgroundColour: "hover:bg-yellow-400",
        };

      case "unknown":
      default:
        return {
          description: "Go surf!",
          backgroundColour: "bg-slate-200",
          hoverBackgroundColour: "hover:bg-slate-400",
        };
    }
  };

  const info = getDayInfo(day);
  const tileState = getTileState(info);

  return (
    <div
      className={`flex justify-center w-28 md:w-44 p-5 md:p-10 ${tileState.backgroundColour} ${tileState.hoverBackgroundColour} rounded-lg text-xs md:text-base lg:text-xl`}
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
    >
      {hovering ? tileState.description : DateTime.fromISO(day.date).day}
    </div>
  );
};
