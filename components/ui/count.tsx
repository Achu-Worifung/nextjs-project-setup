import React from "react";

type CountProps = {
  count: number;
  classNames?: string;
  icon?: React.JSX.Element;
  text?: string;
  onDecrement?: () => void;
  onIncrement?: () => void;
  min?: number;
  max?: number;
};

export function Count({
  count,
  classNames = "",
  icon,
  text = "Passengers:",
  onDecrement,
  onIncrement,
  min = 1,
  max = 10,
}: CountProps) {
  return (
    <div className={`flex items-center rounded-lg px-4 py-2 ${classNames}`}>
      {icon}
      <span className="text-sm font-medium mr-3">{text}</span>
      <div className="flex items-center space-x-2">
        <button
          onClick={onDecrement}
          disabled={count <= min}
          className="w-6 h-6 rounded-full bg-white dark:bg-[rgb(25,30,36)] border border-brand-gray-300 dark:border-brand-gray-600 flex items-center justify-center text-xs hover:bg-brand-gray-100 dark:hover:bg-[rgb(35,42,49)] disabled:opacity-50 text-brand-gray-700 dark:text-brand-gray-300 transition-all duration-200 shadow-sm dark:shadow-brand-dark"
        >
          −
        </button>
        <span className="text-sm font-medium px-2 text-brand-gray-700 dark:text-brand-gray-300">
          {count}
        </span>
        <button
          onClick={onIncrement}
          disabled={count >= max}
          className="w-6 h-6 rounded-full bg-white dark:bg-[rgb(25,30,36)] border border-brand-gray-300 dark:border-brand-gray-600 flex items-center justify-center text-xs hover:bg-brand-gray-100 dark:hover:bg-[rgb(35,42,49)] text-brand-gray-700 dark:text-brand-gray-300 transition-all duration-200 shadow-sm dark:shadow-brand-dark"
        >
          +
        </button>
      </div>

    </div>
  );
}