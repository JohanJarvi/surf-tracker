import { Day } from "@/daysSurfed";
import { DateTime } from "luxon";

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

  return (
    <div
      className={`flex justify-center w-80 p-10 text-xl font-bold ${getBackgroundString(
        true,
        day.surfed,
        day.sickOrInjured
      )} ${getBackgroundString(false, day.surfed, day.sickOrInjured)}`}
    >
      {DateTime.fromISO(day.date).day}
    </div>
  );
};
