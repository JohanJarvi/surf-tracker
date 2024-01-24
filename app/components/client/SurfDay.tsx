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
  | "bg-slate-200";

type HoverBackgroundColours =
  | "bg-indigo-400"
  | "bg-lime-400"
  | "bg-orange-400"
  | "bg-red-400"
  | "bg-slate-400";

type TileState = {
  description: string;
  backgroundColour: BackgroundColours;
  hoverBackgroundColour: HoverBackgroundColours;
};

type DayInfo = "surfed" | "skipped" | "injured" | "rest" | "unknown";

export const SurfDay = ({ day }: SurfDayProps) => {
  const [hovering, setHovering] = useState(false);

  const getDayInfo = (day: Day): DayInfo => {
    if (
      day.surfed === undefined &&
      day.sickOrInjured === undefined &&
      day.restDay === undefined
    )
      return "unknown";

    if (day.surfed) return "surfed";

    if (day.sickOrInjured) return "injured";

    if (day.restDay) return "rest";

    return "skipped";
  };

  const getTileState = (info: DayInfo): TileState => {
    switch (info) {
      case "surfed":
        return {
          description: "Surfed!!",
          backgroundColour: "bg-lime-200",
          hoverBackgroundColour: "bg-lime-400",
        };

      case "rest":
        return {
          description: "Rest :)",
          backgroundColour: "bg-indigo-200",
          hoverBackgroundColour: "bg-indigo-400",
        };

      case "injured":
        return {
          description: "Oh no :'(",
          backgroundColour: "bg-orange-200",
          hoverBackgroundColour: "bg-orange-400",
        };

      case "skipped":
        return {
          description: "Lazy :(",
          backgroundColour: "bg-red-200",
          hoverBackgroundColour: "bg-red-400",
        };

      case "unknown":
      default:
        return {
          description: "Go surf!",
          backgroundColour: "bg-slate-200",
          hoverBackgroundColour: "bg-slate-400",
        };
    }
  };

  const info = getDayInfo(day);
  const tileState = getTileState(info);

  return (
    <div
      className={`flex justify-center w-44 p-10 ${tileState.backgroundColour} hover:${tileState.hoverBackgroundColour} rounded-lg`}
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
    >
      {hovering ? tileState.description : DateTime.fromISO(day.date).day}
    </div>
  );
};
