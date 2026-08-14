import * as React from "react"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { Calendar as CalendarIcon, Clock } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface DateTimePickerProps {
  value?: string
  onChange?: (isoString: string) => void
  placeholder?: string
  className?: string
}

export function DateTimePicker({
  value,
  onChange,
  placeholder = "Seleccionar fecha y hora",
  className,
}: DateTimePickerProps) {
  const [date, setDate] = React.useState<Date | undefined>(
    value ? new Date(value) : undefined
  )
  const [isOpen, setIsOpen] = React.useState(false)

  const [prevValue, setPrevValue] = React.useState(value)

  if (value !== prevValue) {
    setPrevValue(value)
    if (value) {
      const parsedDate = new Date(value)
      if (!isNaN(parsedDate.getTime())) {
        setDate(parsedDate)
      }
    } else {
      setDate(undefined)
    }
  }

  const handleDateSelect = (selectedDate: Date | undefined) => {
    if (!selectedDate) {
      setDate(undefined)
      return
    }
    
    const newDate = date ? new Date(date) : new Date()
    newDate.setFullYear(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate())
    setDate(newDate)
    
    if (onChange) {
      onChange(newDate.toISOString())
    }
  }

  const handleTimeChange = (type: "hour" | "minute", timeValue: string) => {
    if (!date) return

    const newDate = new Date(date)
    if (type === "hour") {
      newDate.setHours(parseInt(timeValue, 10))
    } else if (type === "minute") {
      newDate.setMinutes(parseInt(timeValue, 10))
    }

    setDate(newDate)
    
    if (onChange) {
      onChange(newDate.toISOString())
    }
  }

  // Generate options for hours (0-23)
  const hours = Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, "0"))
  // Generate options for minutes (0-59)
  const minutes = Array.from({ length: 60 }, (_, i) => i.toString().padStart(2, "0"))

  const selectedHour = date ? date.getHours().toString().padStart(2, "0") : undefined
  const selectedMinute = date ? date.getMinutes().toString().padStart(2, "0") : undefined

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-full justify-start text-left font-normal",
            !date && "text-muted-foreground",
            className
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4 shrink-0" />
          <span className="truncate">
            {date ? format(date, "PPP p", { locale: es }) : placeholder}
          </span>
        </Button>
      </PopoverTrigger>
      <PopoverContent 
        className="w-auto p-0 bg-popover text-popover-foreground border-border shadow-md z-[100] max-h-[var(--radix-popover-content-available-height)] overflow-y-auto" 
        align="center" 
        collisionPadding={10}
        onWheel={(e) => e.stopPropagation()}
        onTouchMove={(e) => e.stopPropagation()}
      >
        <Calendar
          mode="single"
          selected={date}
          onSelect={handleDateSelect}
          locale={es}
        />
        <div className="p-3 border-t border-border flex items-center gap-2">
          <Clock className="h-4 w-4 text-muted-foreground shrink-0" />
          <div className="flex flex-1 gap-2">
            <Select
              disabled={!date}
              value={selectedHour}
              onValueChange={(v) => handleTimeChange("hour", v)}
            >
              <SelectTrigger className="w-full h-8 text-xs focus:ring-1 focus:ring-ring">
                <SelectValue placeholder="HH" />
              </SelectTrigger>
              <SelectContent position="popper" className="max-h-[200px] z-[110]">
                {hours.map((hour) => (
                  <SelectItem key={hour} value={hour} className="text-xs">
                    {hour}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <span className="flex items-center text-muted-foreground">:</span>
            <Select
              disabled={!date}
              value={selectedMinute}
              onValueChange={(v) => handleTimeChange("minute", v)}
            >
              <SelectTrigger className="w-full h-8 text-xs focus:ring-1 focus:ring-ring">
                <SelectValue placeholder="MM" />
              </SelectTrigger>
              <SelectContent position="popper" className="max-h-[200px] z-[110]">
                {minutes.map((minute) => (
                  <SelectItem key={minute} value={minute} className="text-xs">
                    {minute}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}
