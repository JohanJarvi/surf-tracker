"use client";

import { DateTime } from "luxon";
import { useEffect, useState } from "react";
import { SurfDay } from "./SurfDay";
import { Day } from "../server/getSurfDays";
import { Ratio } from "./Ratio";

type SurfDaysCalendarProps = {
  surfDays: Day[];
};

type CalendarSegment = {
  month: number | undefined;
  year: number | undefined;
}

type DisplaySegments = {
  previous: CalendarSegment;
  next: CalendarSegment;
}

export const SurfDaysCalendar = ({ surfDays }: SurfDaysCalendarProps) => {
  const filterSurfDays = (daysSurfed: Day[], year: number, month: number) =>
    daysSurfed.filter((day) => {
      const dateTime = DateTime.fromISO(day.date);
      return dateTime.year === year && dateTime.month === month;
    });

  const surfDayDateTimes = surfDays.map((surfDay) => DateTime.fromISO(surfDay.date));
  const latestDate = DateTime.max(...surfDayDateTimes);

  const [displayYear, setDisplayYear] = useState(latestDate.year);
  const [displayMonth, setDisplayMonth] = useState(latestDate.month);
  const [surfDaysToShow, setSurfDaysToShow] = useState<Day[]>(
    filterSurfDays(surfDays, displayYear, displayMonth),
  );
  const [displaySegments, setDisplaySegments] = useState<DisplaySegments>();

  const findPreviousAndFutureCalendarSegments = (currentMonth: number, currentYear: number): void => {
    const onlyFutureDates = surfDayDateTimes.filter((dateTime) => (dateTime.month > currentMonth && dateTime.year === currentYear) || (dateTime.year > currentYear))
    const onlyPastDates = surfDayDateTimes.filter((dateTime) => (dateTime.month < currentMonth && dateTime.year === currentYear) || (dateTime.month > currentMonth && dateTime.year < currentYear))

    const nextDateTime = DateTime.min(...onlyFutureDates);
    const previousDateTime = DateTime.max(...onlyPastDates);

    setDisplaySegments({
      previous: {
        month: previousDateTime?.month,
        year: previousDateTime?.year
      },
      next: {
        month: nextDateTime?.month,
        year: nextDateTime?.year
      }
    });
  }

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
      displayMonth,
    );

    const mappedSurfDays = allPotentialSurfDaysInMonth.map(
      (potentialSurfDay) => {
        return (
          filteredSurfDays.find(
            (filteredSurfDay) => filteredSurfDay.date === potentialSurfDay.date,
          ) || potentialSurfDay
        );
      },
    );

    setSurfDaysToShow(mappedSurfDays);

    findPreviousAndFutureCalendarSegments(displayMonth, displayYear);
  }, [displayYear, displayMonth]);

  const handleSegmentIncrement = (): void => {
    if (displaySegments?.next?.month && displaySegments?.next?.year) {
      setDisplayMonth(displaySegments.next.month);
      setDisplayYear(displaySegments.next.year);
    }
  }

  const handleSegmentDecrement = (): void => {
    if (displaySegments?.previous?.month && displaySegments?.previous?.year) {
      setDisplayMonth(displaySegments.previous.month);
      setDisplayYear(displaySegments.previous.year);
    }
  }

  const isDaySurfable = (day: Day): boolean => {
    return (
      day.surfed !== undefined && !day.sickOrInjured && !day.travel && !day.flat
    );
  };

  const doesDayContainData = (day: Day): boolean => {
    return (
      day.surfed !== undefined ||
      day.sickOrInjured !== undefined ||
      day.restDay !== undefined ||
      day.travel !== undefined ||
      day.flat !== undefined
    );
  };

  const surfDaysForYear = surfDays.filter((day) => DateTime.fromISO(day.date).year === displayYear);

  const totalDaysSurfed = surfDaysForYear.filter((day) => day.surfed).length || 0;
  const totalSurfableDays =
    surfDaysForYear.filter((surfDay) => isDaySurfable(surfDay)).length || 0;

  const totalDaysSurfedMonth =
    surfDaysToShow.filter((day) => day.surfed).length || 0;
  const totalSurfableDaysMonth =
    surfDaysToShow.filter((surfDaysToShow) => isDaySurfable(surfDaysToShow))
      .length || 0;

  const totalDaysInMonthWithData =
    surfDaysToShow.filter((dayToShow) => doesDayContainData(dayToShow))
      .length || 0;

  surfDays.sort((a, b) =>
    DateTime.fromISO(a.date) > DateTime.fromISO(b.date) ? 1 : -1,
  );

  let streak = 0;
  surfDays
    .forEach((surfDay) => {
      surfDay.surfed ? streak++ : (streak = 0);
    });

  return (
    <div className="container mx-auto my-4 text-xl font-bold">
      <div className="flex justify-center items-center gap-5">
        <div
          className="cursor-pointer select-none text-2xl"
          onClick={handleSegmentDecrement}
        >
          {"<"}
        </div>
        <div className="flex flex-col items-center w-36 select-none">
          <div>{displayYear}</div>
          <div>{DateTime.fromObject({ month: displayMonth }).monthLong}</div>
        </div>
        <div
          className="cursor-pointer select-none text-2xl"
          onClick={handleSegmentIncrement}
        >
          {">"}
        </div>
      </div>
      <div className="p-10 flex flex-row flex-wrap justify-center gap-5">
        {surfDaysToShow
          .sort((a, b) =>
            DateTime.fromISO(a.date) > DateTime.fromISO(b.date) ? 1 : -1,
          )
          .map((day) => (
            <SurfDay key={day.date} day={day} />
          ))}
      </div>
      <div className="flex flex-col gap-4 items-center mb-4">
        <Ratio
          label="Month (surfable days)"
          numerator={totalDaysSurfedMonth}
          denominator={totalSurfableDaysMonth}
        />
        <Ratio
          label="Month (all days)"
          numerator={totalDaysSurfedMonth}
          denominator={totalDaysInMonthWithData}
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
            denominator={surfDaysForYear.length}
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
