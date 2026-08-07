import * as React from "react"
import { Clock } from "lucide-react"
import { cn } from "@/lib/utils"

export type TimePickerProps = React.InputHTMLAttributes<HTMLInputElement>;

export const TimePicker = React.forwardRef<HTMLInputElement, TimePickerProps>(
  ({ className, ...props }, ref) => {
    return (
      <div className={cn(
        "relative inline-flex items-center h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background transition-colors",
        "focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2",
        "hover:bg-accent hover:text-accent-foreground",
        className
      )}>
        <Clock className="mr-2 h-4 w-4 opacity-70 flex-shrink-0" />
        <input
          type="time"
          className={cn(
            "flex w-full bg-transparent p-0 border-none outline-none focus:ring-0 text-sm font-normal",
            "[&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:right-0 [&::-webkit-calendar-picker-indicator]:w-full [&::-webkit-calendar-picker-indicator]:h-full [&::-webkit-calendar-picker-indicator]:cursor-pointer"
          )}
          ref={ref}
          {...props}
        />
      </div>
    )
  }
)
TimePicker.displayName = "TimePicker"
