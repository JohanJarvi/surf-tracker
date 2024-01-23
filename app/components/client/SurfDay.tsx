import { DateTime } from "luxon";
import { useState } from "react";
import { Day } from "../server/getSurfDays";

type SurfDayProps = {
  day: Day;
};

type BackgroundColours =
  | "bg-lime-200"
  | "bg-orange-200"
  | "bg-red-200"
  | "bg-slate-200";

type HoverBackgroundColours =
  | "hover:bg-lime-400"
  | "hover:bg-orange-400"
  | "hover:bg-red-400"
  | "hover:bg-slate-400";

export const SurfDay = ({ day }: SurfDayProps) => {
  const [hovering, setHovering] = useState(false);

  const getBackgroundString = (
    hover?: boolean,
    surfed?: boolean,
    sickOrInjured?: boolean
  ): BackgroundColours | HoverBackgroundColours => {
    if (surfed === undefined && sickOrInjured === undefined)
      return hover ? "hover:bg-slate-400" : "bg-slate-200";

    if (surfed) return hover ? "hover:bg-lime-400" : "bg-lime-200";

    if (sickOrInjured) return hover ? "hover:bg-orange-400" : "bg-orange-200";

    return hover ? "hover:bg-red-400" : "bg-red-200";
  };

  const getDescriptiveString = (day: Day): string => {
    if (day.surfed === undefined && day.sickOrInjured === undefined)
      return "Go surf!";

    if (day.surfed) return "Surfed!!";

    if (day.sickOrInjured) return "Injured :'(";

    return "No surf :(";
  };

  return (
    <div
      className={`flex justify-center w-44 p-10 ${getBackgroundString(
        true,
        day.surfed,
        day.sickOrInjured
      )} ${getBackgroundString(
        false,
        day.surfed,
        day.sickOrInjured
      )} rounded-lg`}
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
    >
      {hovering ? getDescriptiveString(day) : DateTime.fromISO(day.date).day}
    </div>
  );
};
