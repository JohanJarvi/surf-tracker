import { SurfDaysCalendar } from "./components/client/SurfDaysCalendar";
import { getSurfDays } from "./components/server/getSurfDays";

export default function Home() {
  const data = getSurfDays();

  return (
    <main>
      <SurfDaysCalendar surfDays={data.daysSurfed} />
    </main>
  );
}
