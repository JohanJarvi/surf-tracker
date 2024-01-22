import { SurfDaysCalendar } from "./components/client/SurfDaysCalendar";
import { getSurfDays } from "./components/server/getSurfDays";

export default async function Home() {
  const data = await getSurfDays();

  return (
    <main>
      <SurfDaysCalendar surfDays={data?.daysSurfed || []} />
    </main>
  );
}
