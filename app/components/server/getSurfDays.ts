import { Day, SurfDays } from "@/daysSurfed";

type SurfDaysData = {
  daysSurfed: Day[];
};
export const getSurfDays = (): SurfDaysData => {
  return { daysSurfed: SurfDays };
};

