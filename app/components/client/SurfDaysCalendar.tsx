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

  useEffect(() => {
    const daysInMonth =
      DateTime.fromObject({ year: displayYear, month: displayMonth })
        .daysInMonth || 28;

    const allPotentialSurfDaysInMonth: Day[] = [
      ...Array(daysInMonth).keys(),
    ].map((key) => ({
      date:
        DateTime.fromObject({
          year: displayYear,
          month: displayMonth,
          day: key + 1,
        }).toISODate() || "",
    }));

    const filteredSurfDays = filterSurfDays(
      surfDays,
      displayYear,
      displayMonth
    );

    const mappedSurfDays = allPotentialSurfDaysInMonth.map(
      (potentialSurfDay) => {
        return (
          filteredSurfDays.find(
            (filteredSurfDay) => filteredSurfDay.date === potentialSurfDay.date
          ) || potentialSurfDay
        );
      }
    );

    setSurfDaysToShow(mappedSurfDays);
  }, [displayYear, displayMonth]);

  const handleMonthIncrements = (currentMonth: number): void => {
    if (currentMonth + 1 === 13) {
      setDisplayMonth(1);
      setDisplayYear(displayYear + 1);
    } else {
      setDisplayMonth(currentMonth + 1);
    }
  };

  const handleMonthDecrements = (currentMonth: number): void => {
    if (currentMonth - 1 === 0) {
      setDisplayMonth(12);
      setDisplayYear(displayYear - 1);
    } else {
      setDisplayMonth(currentMonth - 1);
    }
  };

  const totalDaysSurfed =
    surfDaysToShow.filter((day) => day.surfed).length || 0;
  const totalSurfableDays =
    surfDaysToShow.filter(
      (surfDayToShow) =>
        surfDayToShow.surfed !== undefined &&
        surfDayToShow.sickOrInjured !== undefined &&
        surfDayToShow.sickOrInjured !== true
    ).length || 0;

  return (
    <div className="container mx-auto my-4 text-xl font-bold">
      <div className="flex justify-center gap-4">
        <div
          className="cursor-pointer"
          onClick={() => setDisplayYear(displayYear - 1)}
        >
          {"<"}
        </div>
        <div>{displayYear}</div>
        <div
          className="cursor-pointer"
          onClick={() => setDisplayYear(displayYear + 1)}
        >
          {">"}
        </div>
      </div>
      <div className="flex justify-center gap-4">
        <div
          className="cursor-pointer"
          onClick={() => handleMonthDecrements(displayMonth)}
        >
          {"<"}
        </div>
        <div>{DateTime.fromObject({ month: displayMonth }).monthLong}</div>
        <div
          className="cursor-pointer"
          onClick={() => handleMonthIncrements(displayMonth)}
        >
          {">"}
        </div>
      </div>
      <div className="p-10 flex flex-row flex-wrap justify-center gap-5">
        {surfDaysToShow
          .sort((a, b) =>
            DateTime.fromISO(a.date) > DateTime.fromISO(b.date) ? 1 : -1
          )
          .map((day) => (
            <SurfDay key={day.date} day={day} />
          ))}
      </div>
      <div className="flex justify-center gap-1">
        <span>
          Month: {totalDaysSurfed} / {totalSurfableDays}
        </span>
        {totalSurfableDays !== 0 && (
          <span>
            ({Math.ceil((totalDaysSurfed / totalSurfableDays) * 100)}%)
          </span>
        )}
      </div>
    </div>
  );
};
