"use client";

import { SurfDay } from "./components/SurfDay";
import { Day, daysSurfed } from "../daysSurfed";
import { DateTime } from "luxon";
import { useEffect, useState } from "react";

export default function Home() {
  const filterSurfDays = (daysSurfed: Day[], year: number, month: number) =>
    daysSurfed.filter((day) => {
      const dateTime = DateTime.fromISO(day.date);
      return dateTime.year === year && dateTime.month === month;
    });

  const uniqueYears = [
    ...new Set(daysSurfed.map((day) => DateTime.fromISO(day.date).year)),
  ];

  const [displayYear, setDisplayYear] = useState(uniqueYears.sort()[0]);
  const [displayMonth, setDisplayMonth] = useState(1);
  const [surfDaysToShow, setSurfDaysToShow] = useState<Day[]>(
    filterSurfDays(daysSurfed, displayYear, displayMonth)
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
      daysSurfed.filter((day) => DateTime.fromISO(day.date).month === newMonth)
        .length > 0;

    if (monthContainsSurfDays) setDisplayMonth(newMonth);
  };

  useEffect(() => {
    setSurfDaysToShow(filterSurfDays(daysSurfed, displayYear, displayMonth));
  }, [displayYear, displayMonth]);

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
        {surfDaysToShow.map((day) => (
          <SurfDay key={day.date} day={day} />
        ))}
      </div>
    </div>
  );
}
