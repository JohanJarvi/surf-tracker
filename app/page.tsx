import { SurfDaysCalendar } from "./components/client/SurfDaysCalendar";
import { getSurfDays } from "./components/server/getSurfDays";

export default async function Home() {
  const data = await getSurfDays();

  const surfDays = data?.daysSurfed || [];

  return (
    <main>
      <SurfDaysCalendar surfDays={surfDays} />
    </main>
  );
}
