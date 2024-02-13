import { DateTime } from "luxon";

type PercentagePillProps = {
  percentage: number;
};

export const PercentagePill = ({ percentage }: PercentagePillProps) => {
  const getBackgroundColor = () => {
    const daysInYear = DateTime.now().daysInYear;

    const oneDayAWeek = 52 * 1;
    const twoDaysAWeek = 52 * 2;
    const threeDaysAWeek = 52 * 3;
    const fourDaysAWeek = 52 * 4;
    const fiveDaysAWeek = 52 * 5;
    const sixDaysAWeek = 52 * 6;
    const sevenDaysAWeek = 52 * 7;

    switch (true) {
      case percentage >= (sevenDaysAWeek / daysInYear) * 100:
        return "bg-indigo-400";
      case percentage >= (sixDaysAWeek / daysInYear) * 100:
        return "bg-indigo-200";
      case percentage >= (fiveDaysAWeek / daysInYear) * 100:
        return "bg-lime-400";
      case percentage >= (fourDaysAWeek / daysInYear) * 100:
        return "bg-lime-200";
      case percentage >= (threeDaysAWeek / daysInYear) * 100:
        return "bg-orange-200";
      case percentage >= (twoDaysAWeek / daysInYear) * 100:
        return "bg-orange-400";
      case percentage >= (oneDayAWeek / daysInYear) * 100:
        return "bg-red-200";
      default:
        return "bg-red-400";
    }
  };

  return (
    <span
      className={`${getBackgroundColor()} p-1 rounded-lg text-sm font-bold`}
    >
      {percentage}%
    </span>
  );
};
