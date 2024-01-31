import { DateTime } from "luxon";
import { SurfDaysCalendar } from "./components/client/SurfDaysCalendar";
import { getSurfDays } from "./components/server/getSurfDays";

export default async function Home() {
  const data = await getSurfDays();

  const totalDaysSurfed =
    data?.daysSurfed.filter((daySurfed) => daySurfed.surfed).length || 0;
  const totalSurfableDays =
    data?.daysSurfed.filter(
      (daySurfed) =>
        daySurfed.surfed !== undefined &&
        daySurfed.sickOrInjured !== undefined &&
        daySurfed.sickOrInjured !== true
    ).length || 0;

  const surfDays = data?.daysSurfed || [];

  surfDays.sort((a, b) =>
    DateTime.fromISO(a.date) > DateTime.fromISO(b.date) ? 1 : -1
  );

  let currentStreak = 0;
  let longestStreak = 0;
  surfDays
    .map((daySurfed) => daySurfed.surfed)
    .forEach((surfBoolean) => {
      if (currentStreak > longestStreak) {
        longestStreak = currentStreak;
      }

      surfBoolean ? currentStreak++ : (currentStreak = 0);
    });

  const maxSurfStreak =
    currentStreak > longestStreak ? currentStreak : longestStreak;

  return (
    <main>
      <SurfDaysCalendar surfDays={surfDays} />
      <div className="flex flex-col gap-4 items-center mb-4">
        <div>
          Current surf streak is {maxSurfStreak} days
          {"!".repeat(Math.ceil(maxSurfStreak / 5))}
        </div>
        <div>
          Total: {totalDaysSurfed} / {totalSurfableDays} (
          {Math.ceil((totalDaysSurfed / totalSurfableDays) * 100)}%)
        </div>
        <div className="text-sm">
          Total percentage target is {((300 / 360) * 100).toFixed(2)}%
        </div>
      </div>
    </main>
  );
}
