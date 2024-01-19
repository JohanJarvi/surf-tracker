import { SurfDay } from "./components/SurfDay";
import { Day, daysSurfed } from "../daysSurfed";
import { DateTime } from "luxon";

type YearlyDaysSurfed = {
  year: number;
  daysSurfed: Day[];
};

export default function Home() {
  const uniqueYears = [
    ...new Set(daysSurfed.map((day) => DateTime.fromISO(day.date).year)),
  ];

  const daySurfedByYear: YearlyDaysSurfed[] = uniqueYears.map((year) => ({
    year: year,
    daysSurfed: daysSurfed.filter(
      (daySurfed) => DateTime.fromISO(daySurfed.date).year === year
    ),
  }));

  return (
    <main>
      {daySurfedByYear.map((year) => (
        <div key={year.year}>
          <div>{year.year}</div>
          <div className="p-10 flex flex-row flex-wrap justify-left gap-4">
            {year.daysSurfed.map((day) => (
              <SurfDay key={day.date} day={day} />
            ))}
          </div>
        </div>
      ))}
    </main>
  );
}
