type PercentagePillProps = {
  percentage: number;
};

export const PercentagePill = ({ percentage }: PercentagePillProps) => {
  const getBackgroundColor = () => {
    switch (true) {
      case percentage >= 72:
        return "bg-lime-200";
      case percentage >= 50:
        return "bg-orange-200";
      default:
        return "bg-red-200";
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
