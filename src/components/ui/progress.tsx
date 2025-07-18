import React from "react";

interface ProgressProps {
  value?: number;
  max?: number;
  className?: string;
}

const Progress: React.FC<ProgressProps> = ({
  value = 0,
  max = 100,
  className = "",
}) => {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

  return (
    <div
      className={`w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2 ${className}`}
    >
      <div
        className="bg-primary h-2 rounded-full transition-all duration-300 ease-in-out"
        style={{ width: `${percentage}%` }}
      />
    </div>
  );
};

export { Progress };
