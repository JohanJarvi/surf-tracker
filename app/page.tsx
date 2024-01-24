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

  return (
    <main>
      <SurfDaysCalendar surfDays={data?.daysSurfed || []} />
      <div className="flex justify-center">
        Total: {totalDaysSurfed} / {totalSurfableDays} (
        {Math.ceil((totalDaysSurfed / totalSurfableDays) * 100)}%)
      </div>
      <br />
      <div className="flex justify-center text-sm">
        Total percentage target is {((300 / 360) * 100).toFixed(2)}%
      </div>
    </main>
  );
}
