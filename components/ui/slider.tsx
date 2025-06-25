"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

interface SliderProps {
  value: number[]
  onValueChange: (value: number[]) => void
  max: number
  min: number
  step: number
  className?: string
}

const Slider = React.forwardRef<HTMLDivElement, SliderProps>(
  ({ className, value, onValueChange, max, min, step, ...props }, ref) => {
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = parseInt(event.target.value)
      if (event.target.name === 'min') {
        onValueChange([newValue, value[1]])
      } else {
        onValueChange([value[0], newValue])
      }
    }

    return (
      <div ref={ref} className={cn("space-y-2", className)} {...props}>
        <div className="flex gap-2">
          <input
            type="range"
            name="min"
            min={min}
            max={max}
            step={step}
            value={value[0]}
            onChange={handleChange}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
          
        </div>
      </div>
    )
  }
)
Slider.displayName = "Slider"

export { Slider }
