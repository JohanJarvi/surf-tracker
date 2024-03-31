"use client";

import { DateTime } from "luxon";
import { useEffect, useState } from "react";
import { SurfDay } from "./SurfDay";
import { Day } from "../server/getSurfDays";
import { Ratio } from "./Ratio";

type SurfDaysCalendarProps = {
  surfDays: Day[];
};

export const SurfDaysCalendar = ({ surfDays }: SurfDaysCalendarProps) => {
  const filterSurfDays = (daysSurfed: Day[], year: number, month: number) =>
    daysSurfed.filter((day) => {
      const dateTime = DateTime.fromISO(day.date);
      return dateTime.year === year && dateTime.month === month;
    });

  const dateTimeNow = DateTime.now();
  const [displayYear, setDisplayYear] = useState(dateTimeNow.year);
  const [displayMonth, setDisplayMonth] = useState(dateTimeNow.month.valueOf());
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
    surfDaysToShow.filter((surfDayToShow) => surfDayToShow.surfed !== undefined)
      .length || 0;

  return (
    <div className="container mx-auto my-4 text-xl font-bold">
      <div className="flex justify-center">
        <div className="flex justify-between w-40">
          <div
            className="cursor-pointer select-none"
            onClick={() => setDisplayYear(displayYear - 1)}
          >
            {"<"}
          </div>
          <div>{displayYear}</div>
          <div
            className="cursor-pointer select-none"
            onClick={() => setDisplayYear(displayYear + 1)}
          >
            {">"}
          </div>
        </div>
      </div>
      <div className="flex justify-center">
        <div className="flex justify-between w-40">
          <div
            className="cursor-pointer select-none"
            onClick={() => handleMonthDecrements(displayMonth)}
          >
            {"<"}
          </div>
          <div>{DateTime.fromObject({ month: displayMonth }).monthLong}</div>
          <div
            className="cursor-pointer select-none"
            onClick={() => handleMonthIncrements(displayMonth)}
          >
            {">"}
          </div>
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
      {totalSurfableDays > 0 && (
        <Ratio
          label="Month"
          numerator={totalDaysSurfed}
          denominator={totalSurfableDays}
        />
      )}
    </div>
  );
};
