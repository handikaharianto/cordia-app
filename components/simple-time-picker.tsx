/**
 * Simple Time Picker
 * Check out the live demo at https://shadcn-datetime-picker-pro.vercel.app/
 * Find the latest source code at https://github.com/huybuidac/shadcn-datetime-picker
 */
import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { IconClock, IconChevronDown, IconCheck } from "@tabler/icons-react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  format,
  parse,
  setHours,
  startOfHour,
  endOfHour,
  setMinutes,
  startOfMinute,
  endOfMinute,
  setSeconds,
  startOfDay,
  endOfDay,
  addHours,
  subHours,
} from "date-fns"

interface SimpleTimeOption {
  value: number
  label: string
  disabled?: boolean
}

const AM_VALUE = 0
const PM_VALUE = 1

export function SimpleTimePicker({
  value,
  onChange,
  use12HourFormat,
  min,
  max,
  disabled,
  modal,
}: {
  use12HourFormat?: boolean
  value: Date
  onChange: (date: Date) => void
  min?: Date
  max?: Date
  disabled?: boolean
  className?: string
  modal?: boolean
}) {
  // hours24h = HH
  // hours12h = hh
  const formatStr = useMemo(
    () =>
      use12HourFormat ? "yyyy-MM-dd hh:mm a xxxx" : "yyyy-MM-dd HH:mm xxxx",
    [use12HourFormat]
  )
  const [ampm, setAmpm] = useState(
    format(value, "a") === "AM" ? AM_VALUE : PM_VALUE
  )
  const [hour, setHour] = useState(
    use12HourFormat ? +format(value, "hh") : value.getHours()
  )
  const [minute, setMinute] = useState(value.getMinutes())

  useEffect(() => {
    onChange(
      buildTime({
        use12HourFormat,
        value,
        formatStr,
        hour,
        minute,
        ampm,
      })
    )
  }, [hour, minute, ampm, formatStr, use12HourFormat])

  const _hourIn24h = useMemo(() => {
    return use12HourFormat ? (hour % 12) + ampm * 12 : hour
  }, [hour, use12HourFormat, ampm])

  const hours: SimpleTimeOption[] = useMemo(
    () =>
      Array.from({ length: use12HourFormat ? 12 : 24 }, (_, i) => {
        let disabled = false
        const hourValue = use12HourFormat ? (i === 0 ? 12 : i) : i
        const hDate = setHours(value, use12HourFormat ? i + ampm * 12 : i)
        const hStart = startOfHour(hDate)
        const hEnd = endOfHour(hDate)
        if (min && hEnd < min) disabled = true
        if (max && hStart > max) disabled = true
        return {
          value: hourValue,
          label: hourValue.toString().padStart(2, "0"),
          disabled,
        }
      }),
    [value, min, max, use12HourFormat, ampm]
  )
  const minutes: SimpleTimeOption[] = useMemo(() => {
    const anchorDate = setHours(value, _hourIn24h)
    return Array.from({ length: 60 }, (_, i) => {
      let disabled = false
      const mDate = setMinutes(anchorDate, i)
      const mStart = startOfMinute(mDate)
      const mEnd = endOfMinute(mDate)
      if (min && mEnd < min) disabled = true
      if (max && mStart > max) disabled = true
      return {
        value: i,
        label: i.toString().padStart(2, "0"),
        disabled,
      }
    })
  }, [value, min, max, _hourIn24h])
  const ampmOptions = useMemo(() => {
    const startD = startOfDay(value)
    const endD = endOfDay(value)
    return [
      { value: AM_VALUE, label: "AM" },
      { value: PM_VALUE, label: "PM" },
    ].map((v) => {
      let disabled = false
      const start = addHours(startD, v.value * 12)
      const end = subHours(endD, (1 - v.value) * 12)
      if (min && end < min) disabled = true
      if (max && start > max) disabled = true
      return { ...v, disabled }
    })
  }, [value, min, max])

  const [open, setOpen] = useState(false)

  const hourRef = useRef<HTMLDivElement>(null)
  const minuteRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (open) {
        hourRef.current?.scrollIntoView({ behavior: "auto" })
        minuteRef.current?.scrollIntoView({ behavior: "auto" })
      }
    }, 1)
    return () => clearTimeout(timeoutId)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open])
  const onHourChange = useCallback(
    (v: SimpleTimeOption) => {
      if (min) {
        const newTime = buildTime({
          use12HourFormat,
          value,
          formatStr,
          hour: v.value,
          minute,
          ampm,
        })
        if (newTime < min) {
          setMinute(min.getMinutes())
        }
      }
      if (max) {
        const newTime = buildTime({
          use12HourFormat,
          value,
          formatStr,
          hour: v.value,
          minute,
          ampm,
        })
        if (newTime > max) {
          setMinute(max.getMinutes())
        }
      }
      setHour(v.value)
    },
    [setHour, use12HourFormat, value, formatStr, minute, ampm]
  )

  const onMinuteChange = useCallback(
    (v: SimpleTimeOption) => {
      setMinute(v.value)
    },
    [setMinute]
  )

  const onAmpmChange = useCallback(
    (v: SimpleTimeOption) => {
      if (min) {
        const newTime = buildTime({
          use12HourFormat,
          value,
          formatStr,
          hour,
          minute,
          ampm: v.value,
        })
        if (newTime < min) {
          const minH = min.getHours() % 12
          setHour(minH === 0 ? 12 : minH)
          setMinute(min.getMinutes())
        }
      }
      if (max) {
        const newTime = buildTime({
          use12HourFormat,
          value,
          formatStr,
          hour,
          minute,
          ampm: v.value,
        })
        if (newTime > max) {
          const maxH = max.getHours() % 12
          setHour(maxH === 0 ? 12 : maxH)
          setMinute(max.getMinutes())
        }
      }
      setAmpm(v.value)
    },
    [setAmpm, use12HourFormat, value, formatStr, hour, minute, min, max]
  )

  const display = useMemo(() => {
    return format(value, use12HourFormat ? "hh:mm a" : "HH:mm")
  }, [value, use12HourFormat])

  return (
    <Popover open={open} onOpenChange={setOpen} modal={modal}>
      <PopoverTrigger asChild>
        <div
          role="combobox"
          aria-expanded={open}
          className={cn(
            "flex h-9 cursor-pointer items-center justify-between rounded-3xl border border-transparent bg-input/50 px-3 text-sm font-normal",
            disabled && "cursor-not-allowed opacity-50"
          )}
          tabIndex={0}
        >
          <IconClock className="mr-2 size-4" />
          {display}
          <IconChevronDown className="ml-2 size-4 shrink-0 opacity-50" />
        </div>
      </PopoverTrigger>
      <PopoverContent
        className="w-auto rounded-3xl p-0 shadow-lg ring-1 ring-foreground/5"
        side="top"
      >
        <div className="flex-col gap-2 p-2">
          <div className="flex h-56 w-fit">
            <ScrollArea className="h-full w-16">
              <div className="flex w-16 flex-col items-center overflow-y-auto">
                {hours.map((v) => (
                  <div
                    ref={v.value === hour ? hourRef : undefined}
                    key={v.value}
                    className="w-full"
                  >
                    <TimeItem
                      option={v}
                      selected={v.value === hour}
                      onSelect={onHourChange}
                      disabled={v.disabled}
                      className="h-8 w-full justify-center px-0"
                    />
                  </div>
                ))}
              </div>
            </ScrollArea>
            <ScrollArea className="h-full w-16">
              <div className="flex w-16 flex-col items-center overflow-y-auto">
                {minutes.map((v) => (
                  <div
                    ref={v.value === minute ? minuteRef : undefined}
                    key={v.value}
                    className="w-full"
                  >
                    <TimeItem
                      option={v}
                      selected={v.value === minute}
                      onSelect={onMinuteChange}
                      disabled={v.disabled}
                      className="h-8 w-full justify-center px-0"
                    />
                  </div>
                ))}
              </div>
            </ScrollArea>
            {use12HourFormat && (
              <ScrollArea className="h-full w-16">
                <div className="flex w-16 flex-col items-center overflow-y-auto">
                  {ampmOptions.map((v) => (
                    <TimeItem
                      key={v.value}
                      option={v}
                      selected={v.value === ampm}
                      onSelect={onAmpmChange}
                      className="h-8 w-full justify-center px-0"
                      disabled={v.disabled}
                    />
                  ))}
                </div>
              </ScrollArea>
            )}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}

const TimeItem = ({
  option,
  selected,
  onSelect,
  className,
  disabled,
}: {
  option: SimpleTimeOption
  selected: boolean
  onSelect: (option: SimpleTimeOption) => void
  className?: string
  disabled?: boolean
}) => {
  return (
    <Button
      variant="ghost"
      className={cn(
        "flex h-8 w-full cursor-pointer items-center justify-center rounded-2xl px-0 text-sm font-medium",
        className
      )}
      onClick={() => onSelect(option)}
      disabled={disabled}
    >
      <div className="w-4">
        {selected && <IconCheck className="my-auto size-4" />}
      </div>
      <span className="ms-2">{option.label}</span>
    </Button>
  )
}

interface BuildTimeOptions {
  use12HourFormat?: boolean
  value: Date
  formatStr: string
  hour: number
  minute: number
  ampm: number
}

function buildTime(options: BuildTimeOptions) {
  const { use12HourFormat, value, formatStr, hour, minute, ampm } = options
  let date: Date
  if (use12HourFormat) {
    const dateStrRaw = format(value, formatStr)
    // yyyy-MM-dd hh:mm a zzzz
    // 2024-10-14 01:20 AM GMT+00:00
    let dateStr =
      dateStrRaw.slice(0, 11) +
      hour.toString().padStart(2, "0") +
      dateStrRaw.slice(13)
    dateStr =
      dateStr.slice(0, 14) +
      minute.toString().padStart(2, "0") +
      dateStr.slice(16)
    dateStr =
      dateStr.slice(0, 20) +
      (ampm == AM_VALUE ? "AM" : "PM") +
      dateStr.slice(22)
    date = setSeconds(parse(dateStr, formatStr, value), 0)
  } else {
    date = setSeconds(setMinutes(setHours(value, hour), minute), 0)
  }
  return date
}
