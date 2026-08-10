import * as React from "react"
import { Clock } from "lucide-react"
import { cn } from "@/lib/utils"

export type TimePickerProps = Omit<React.InputHTMLAttributes<HTMLInputElement>, 'value' | 'onChange'> & {
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

export const TimePicker = React.forwardRef<HTMLInputElement, TimePickerProps>(
  ({ className, value = "", onChange, ...props }, ref) => {
    const [hours, setHours] = React.useState(value.split(':')[0] || "");
    const [minutes, setMinutes] = React.useState(value.split(':')[1] || "");

    React.useEffect(() => {
      if (value) {
        setHours(value.split(':')[0] || "");
        setMinutes(value.split(':')[1] || "");
      }
    }, [value]);

    const handleTimeChange = (type: 'h' | 'm', val: string) => {
      if (val !== "") {
        const num = parseInt(val, 10);
        if (isNaN(num)) return;
        if (type === 'h' && (num < 0 || num > 23)) return;
        if (type === 'm' && (num < 0 || num > 59)) return;
      }

      let h = hours;
      let m = minutes;

      if (type === 'h') {
        h = val;
        setHours(val);
      } else {
        m = val;
        setMinutes(val);
      }

      if (onChange) {
        const newTime = `${(h || '00').padStart(2, '0')}:${(m || '00').padStart(2, '0')}`;
        const e = {
          target: { value: newTime, name: props.name },
        } as React.ChangeEvent<HTMLInputElement>;
        onChange(e);
      }
    };

    const handleHourBlur = () => {
      if (!hours) {
        handleTimeChange('h', '00');
        return;
      }
      let h = parseInt(hours, 10);
      if (isNaN(h)) h = 0;
      handleTimeChange('h', h.toString().padStart(2, '0'));
    };

    const handleMinuteBlur = () => {
      if (!minutes) {
        handleTimeChange('m', '00');
        return;
      }
      let m = parseInt(minutes, 10);
      if (isNaN(m)) m = 0;
      handleTimeChange('m', m.toString().padStart(2, '0'));
    };

    return (
      <div className={cn(
        "inline-flex shrink-0 items-center justify-start rounded-lg border bg-clip-padding text-sm font-medium transition-all outline-none focus-within:ring-3 focus-within:ring-ring/50",
        "border-border bg-background hover:bg-muted hover:text-foreground dark:border-input dark:bg-input/30 dark:hover:bg-input/50",
        "h-8 gap-1.5 px-2.5 w-[120px]",
        className
      )}>
        <Clock className="mr-2 h-4 w-4 shrink-0 text-muted-foreground" />
        
        {/* Hidden input to hold actual value for form submission/validation */}
        <input 
          type="hidden" 
          value={value}
          ref={ref}
          {...props} 
        />
        
        <div className="flex items-center space-x-0.5 font-medium w-full">
          <input
            type="number"
            min="0"
            max="23"
            placeholder="00"
            value={hours}
            onChange={(e) => handleTimeChange('h', e.target.value)}
            onBlur={handleHourBlur}
            className="w-7 text-center bg-transparent border-none outline-none focus:ring-0 text-sm p-0 font-normal tabular-nums placeholder:text-muted-foreground"
          />
          <span className="opacity-50 mx-0.5 font-normal">:</span>
          <input
            type="number"
            min="0"
            max="59"
            placeholder="00"
            value={minutes}
            onChange={(e) => handleTimeChange('m', e.target.value)}
            onBlur={handleMinuteBlur}
            className="w-7 text-center bg-transparent border-none outline-none focus:ring-0 text-sm p-0 font-normal tabular-nums placeholder:text-muted-foreground"
          />
        </div>
      </div>
    )
  }
)
TimePicker.displayName = "TimePicker"
