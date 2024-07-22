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

  const isDaySurfable = (day: Day): boolean => {
    return (
      day.surfed !== undefined && !day.sickOrInjured && !day.travel && !day.flat
    );
  };

  const totalDaysSurfed = surfDays.filter((day) => day.surfed).length || 0;
  const totalSurfableDays =
    surfDays.filter((surfDay) => isDaySurfable(surfDay)).length || 0;

  const totalDaysSurfedMonth =
    surfDaysToShow.filter((day) => day.surfed).length || 0;
  const totalSurfableDaysMonth =
    surfDaysToShow.filter((surfDaysToShow) => isDaySurfable(surfDaysToShow))
      .length || 0;

  surfDays.sort((a, b) =>
    DateTime.fromISO(a.date) > DateTime.fromISO(b.date) ? 1 : -1
  );

  let streak = 0;
  surfDays
    .map((daySurfed) => daySurfed.surfed)
    .forEach((surfBoolean) => {
      surfBoolean ? streak++ : (streak = 0);
    });

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
      <div className="flex flex-col gap-4 items-center mb-4">
        <Ratio
          label="Month"
          numerator={totalDaysSurfedMonth}
          denominator={totalSurfableDaysMonth}
        />
        <div className="text-base">
          <Ratio
            label="Total (surfable days)"
            numerator={totalDaysSurfed}
            denominator={totalSurfableDays}
          />
        </div>
        <div className="text-base">
          <Ratio
            label="Total (all days)"
            numerator={totalDaysSurfed}
            denominator={surfDays.length}
          />
        </div>
        <div className="font-normal text-sm">
          Current surf streak is {streak} days
          {"!".repeat(Math.ceil(streak / 5))}
        </div>
      </div>
    </div>
  );
};
