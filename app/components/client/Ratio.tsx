import { PercentagePill } from "../server/percentagePill";

type RatioProps = {
  label: string;
  numerator: number;
  denominator: number;
  small?: boolean;
};

export const Ratio = ({ label, numerator, denominator }: RatioProps) => {
  return (
    denominator > 0 && (
      <div className="flex justify-center gap-1 items-center">
        <span>
          {label}: {numerator} / {denominator}
        </span>
        <PercentagePill
          percentage={Math.ceil((numerator / denominator) * 100)}
        />
      </div>
    )
  );
};
