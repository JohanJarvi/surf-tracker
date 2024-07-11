import { SurfDaysCalendar } from "./components/client/SurfDaysCalendar";
import { getSurfDays } from "./components/server/getSurfDays";

export const revalidate = 3600; // revalidate the data at most every hour

export default async function Home() {
  const data = await getSurfDays();

  const surfDays = data?.daysSurfed || [];

  return (
    <main>
      <SurfDaysCalendar surfDays={surfDays} />
    </main>
  );
}
