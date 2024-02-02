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

  let streak = 0;
  surfDays
    .map((daySurfed) => daySurfed.surfed)
    .forEach((surfBoolean) => {
      surfBoolean ? streak++ : (streak = 0);
    });

  return (
    <main>
      <SurfDaysCalendar surfDays={surfDays} />
      <div className="flex flex-col gap-4 items-center mb-4">
        <div>
          Current surf streak is {streak} days
          {"!".repeat(Math.ceil(streak / 5))}
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
