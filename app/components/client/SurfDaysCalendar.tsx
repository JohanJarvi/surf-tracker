"use client";

import { DateTime } from "luxon";
import { useEffect, useState } from "react";
import { SurfDay } from "./SurfDay";
import { Day } from "../server/getSurfDays";

type SurfDaysCalendarProps = {
  surfDays: Day[];
};

export const SurfDaysCalendar = ({ surfDays }: SurfDaysCalendarProps) => {
  const filterSurfDays = (daysSurfed: Day[], year: number, month: number) =>
    daysSurfed.filter((day) => {
      const dateTime = DateTime.fromISO(day.date);
      return dateTime.year === year && dateTime.month === month;
    });

  const uniqueYears = [
    ...new Set(surfDays.map((day) => DateTime.fromISO(day.date).year)),
  ];

  const [displayYear, setDisplayYear] = useState(uniqueYears.sort()[0]);
  const [displayMonth, setDisplayMonth] = useState(1);
  const [surfDaysToShow, setSurfDaysToShow] = useState<Day[]>(
    filterSurfDays(surfDays, displayYear, displayMonth)
  );

  const shiftDisplayYear = (forward: boolean): void => {
    let newYear;
    if (forward) {
      newYear = displayYear + 1;
    } else {
      newYear = displayYear - 1;
    }

    const yearToDisplay = uniqueYears.includes(newYear) ? newYear : displayYear;

    setDisplayYear(yearToDisplay);
  };

  const shiftDisplayMonth = (forward: boolean): void => {
    let newMonth: number;
    if (forward) {
      newMonth = displayMonth + 1;
    } else {
      newMonth = displayMonth - 1;
    }

    const monthContainsSurfDays =
      surfDays.filter((day) => DateTime.fromISO(day.date).month === newMonth)
        .length > 0;

    if (monthContainsSurfDays) setDisplayMonth(newMonth);
  };

  useEffect(() => {
    setSurfDaysToShow(filterSurfDays(surfDays, displayYear, displayMonth));
  }, [displayYear, displayMonth]);

  const totalDaysSurfed = surfDaysToShow.filter((day) => day.surfed).length;
  const totalSurfableDays = surfDaysToShow.filter(
    (surfDayToShow) =>
      surfDayToShow.surfed !== undefined &&
      surfDayToShow.sickOrInjured !== undefined
  ).length;

  return (
    <div className="container mx-auto my-4 text-xl font-bold">
      <div className="flex justify-center gap-4">
        <div className="cursor-pointer" onClick={() => shiftDisplayYear(false)}>
          {"<"}
        </div>
        <div>{displayYear}</div>
        <div className="cursor-pointer" onClick={() => shiftDisplayYear(true)}>
          {">"}
        </div>
      </div>
      <div className="flex justify-center gap-4">
        <div
          className="cursor-pointer"
          onClick={() => shiftDisplayMonth(false)}
        >
          {"<"}
        </div>
        <div>{DateTime.fromObject({ month: displayMonth }).monthLong}</div>
        <div className="cursor-pointer" onClick={() => shiftDisplayMonth(true)}>
          {">"}
        </div>
      </div>
      <div className="p-10 flex flex-row flex-wrap justify-center gap-4">
        {surfDaysToShow
          .sort((a, b) =>
            DateTime.fromISO(a.date) > DateTime.fromISO(b.date) ? 1 : -1
          )
          .map((day) => (
            <SurfDay key={day.date} day={day} />
          ))}
      </div>
      <div className="flex justify-center">
        {totalDaysSurfed} / {totalSurfableDays} (
        {Math.ceil((totalDaysSurfed / totalSurfableDays) * 100)}%)
      </div>
    </div>
  );
};
