import { Calendar } from "lucide-react";
import { Label } from "@/components/ui/label";
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import React from "react";


type CustomCalendarsProps = {
  label?: string;
  value?: Date | undefined;
  onChange?: (date: Date | undefined) => void;
  error?: { isError: boolean; message: string };
  id?: string;
  minDate?: Date;
  className?: string;
};



export function CustomCalendars({
  label = "Departure date",
  value,
  onChange,
  error = { isError: false, message: "" },
  id = "departure",
  minDate,
  className = "",
}: CustomCalendarsProps) {
  return (
    <div className={className}>
      <Label htmlFor={id} className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
        <Calendar className="h-4 w-4 text-pink-500" />
        <span className="text-sm font-medium text-gray-700 whitespace-nowrap">{label}</span>
      </Label>
      <div className="flex items-center gap-2">
        <TooltipProvider>
          <Tooltip open={error.isError}>
            <TooltipTrigger asChild>
              <input
                type="date"
                id={id}
                value={value ? value.toISOString().split("T")[0] : ""}
                onChange={(e) => {
                  if (onChange) {
                    onChange(e.target.value ? new Date(e.target.value) : undefined);
                  }
                }}
                min={minDate ? minDate.toISOString().split("T")[0] : new Date().toISOString().split("T")[0]}
                className="w-32 h-8 px-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent text-sm"
              />
            </TooltipTrigger>
            <TooltipContent side="bottom">
              <p className="text-sm text-red-500">{error.message}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
       
      </div>
    </div>
  );
}