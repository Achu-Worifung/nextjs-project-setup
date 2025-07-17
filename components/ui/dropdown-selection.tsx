import React from "react";

type DropdownProps = {
  label: string;
  value: string;
  options: { value: string; label: string; className?: string }[];
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  className?: string;
};

export function Dropdown({
  label,
  value,
  options,
  onChange,
  className = "",
}: DropdownProps) {
  return (
    <div className={`flex items-center rounded-lg px-4 py-2  ${className}`}>
      <span className="text-sm font-medium mr-3 text-brand-gray-700 dark:text-brand-gray-300">
        {label}
      </span>
      <div className="relative">
        <select
          value={value}
          onChange={onChange}
          className="bg-white dark:bg-[rgb(25,30,36)] border border-brand-gray-200 dark:border-brand-gray-600 rounded-md px-3 py-1.5 text-sm font-medium text-pink-600 dark:text-pink-400 focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-none appearance-none pr-8 min-w-[120px] shadow-sm dark:shadow-brand-dark transition-all duration-200"
        >
          {options.map((option) => (
            <option
              key={option.value}
              value={option.value}
              className={option.className || "dark:bg-[rgb(25,30,36)] dark:text-white"}
            >
              {option.label}
            </option>
          ))}
        </select>
        {/* Custom dropdown arrow */}
        <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none">
          <svg
            className="w-4 h-4 text-pink-500 dark:text-pink-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>
      </div>
    </div>
  );
}