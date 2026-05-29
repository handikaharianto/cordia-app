"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm, Controller, type Resolver } from "react-hook-form"
import { useEffect, useMemo, useRef, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import {
  Field,
  FieldError,
  FieldLabel,
  FieldLegend,
  FieldSet,
  FieldTitle,
} from "@/components/ui/field"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { IconSearch } from "@tabler/icons-react"
import { SimpleTimePicker } from "@/components/simple-time-picker"
import { Building } from "@/types"

function formatTime(date: Date): string {
  return date.toTimeString().slice(0, 5) // e.g. "14:30"
}

/** Parse a "HH:mm" string into a Date (today with that time) */
function parseTime(time: string): Date | null {
  const match = time.match(/^(\d{2}):(\d{2})$/)
  if (!match) return null
  const d = new Date()
  d.setHours(Number(match[1]), Number(match[2]), 0, 0)
  return d
}

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"] as const

const CAMPUS_OPTIONS = [
  { value: "SGW", label: "Sir George Williams" },
  { value: "LOY", label: "Loyola Campus" },
]

const formSchema = z
  .object({
    day: z.enum(["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"], {
      message: "Please select a day",
    }),
    timeFrom: z.date("Please select a start time"),
    timeTo: z.date("Please select an end time"),
    campus: z.string({ message: "Please select a campus" }),
    building: z.string().optional(),
  })
  .refine((data) => data.timeFrom.getTime() < data.timeTo.getTime(), {
    message: "End time must be after start time",
    path: ["timeTo"],
  })

type FormValues = z.infer<typeof formSchema>

const DAY_MAP: Record<number, FormValues["day"]> = {
  0: "Sun",
  1: "Mon",
  2: "Tue",
  3: "Wed",
  4: "Thu",
  5: "Fri",
  6: "Sat",
}

type ClassroomSearchFormProps = {
  buildings: Building[]
}

export default function ClassroomSearchForm({
  buildings,
}: ClassroomSearchFormProps) {
  const [availableBuildings, setAvailableBuildings] = useState(buildings)

  const router = useRouter()
  const searchParams = useSearchParams()

  const paramCampus = searchParams.get("campus")
  const paramBuilding = searchParams.get("building")
  const paramDay = searchParams.get("day") as FormValues["day"] | null
  const paramTimeFrom = searchParams.get("timeFrom")
  const paramTimeTo = searchParams.get("timeTo")

  const defaultValues = useMemo<FormValues>(() => {
    const now = new Date()

    const parsedTimeFrom = paramTimeFrom ? parseTime(paramTimeFrom) : null
    const parsedTimeTo = paramTimeTo ? parseTime(paramTimeTo) : null

    return {
      day: paramDay ?? DAY_MAP[now.getDay()],
      campus: paramCampus ?? CAMPUS_OPTIONS[0].value,
      building: paramBuilding ?? "",
      timeFrom: parsedTimeFrom ?? now,
      timeTo: parsedTimeTo ?? new Date(now.getTime() + 60 * 60 * 1000),
    }
  }, [searchParams])

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema) as Resolver<FormValues>,
    defaultValues,
  })

  function onSubmit(values: FormValues) {
    const params = new URLSearchParams()

    if (values.campus) params.set("campus", values.campus)
    if (values.building) params.set("building", values.building)
    if (values.day) params.set("day", values.day)
    params.set("timeFrom", formatTime(values.timeFrom))
    params.set("timeTo", formatTime(values.timeTo))

    router.push(`?${params.toString()}`, { scroll: false })
  }

  const campus = form.watch("campus")
  const prevCampus = useRef(campus)

  useEffect(() => {
    // update building value and list of buildings when 'campus' has changed
    if (prevCampus.current !== campus) {
      form.setValue("building", "")
      setAvailableBuildings(
        buildings.filter((building) => building.location_code === campus)
      )
    }
    prevCampus.current = campus
  }, [campus, form, router, buildings])

  useEffect(() => {
    if (!paramCampus || !paramDay || !paramTimeFrom || !paramTimeTo) {
      const params = new URLSearchParams()
      params.set("campus", defaultValues.campus)
      params.set("day", defaultValues.day)
      params.set("timeFrom", formatTime(defaultValues.timeFrom))
      params.set("timeTo", formatTime(defaultValues.timeTo))
      router.replace(`?${params.toString()}`, { scroll: false })
    }
    setAvailableBuildings(
      buildings.filter((building) => building.location_code === campus)
    )
  }, []) // runs only once on mount

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <Card>
        <CardContent className="gap-4 lg:flex">
          {/* Campus */}
          <Controller
            name="campus"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field orientation="vertical" className="max-w-md!">
                <FieldLabel htmlFor="campus">Campus</FieldLabel>
                <Select
                  value={field.value}
                  onValueChange={field.onChange}
                  onOpenChange={(open) => {
                    if (!open) field.onBlur()
                  }}
                >
                  <SelectTrigger id="campus" aria-invalid={fieldState.invalid}>
                    <SelectValue placeholder="Select campus" />
                  </SelectTrigger>
                  <SelectContent className="p-1.5">
                    {CAMPUS_OPTIONS.map((campus) => (
                      <SelectItem key={campus.value} value={campus.value}>
                        {campus.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          {/* Building */}
          <Controller
            name="building"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field orientation="vertical" className="max-w-md!">
                <FieldLabel htmlFor="building">Building</FieldLabel>
                <Select
                  value={field.value || ""}
                  onValueChange={field.onChange}
                  onOpenChange={(open) => {
                    if (!open) field.onBlur()
                  }}
                >
                  <SelectTrigger
                    id="building"
                    aria-invalid={fieldState.invalid}
                  >
                    <SelectValue placeholder="Select building (optional)" />
                  </SelectTrigger>
                  <SelectContent className="p-1.5">
                    {availableBuildings.map((building) => (
                      <SelectItem
                        key={building.building_code}
                        value={building.building_code}
                      >
                        {building.building_code}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          {/* Day */}
          <FieldSet>
            <FieldLegend>
              <FieldTitle>Day</FieldTitle>
            </FieldLegend>
            <Controller
              name="day"
              control={form.control}
              render={({ field }) => (
                <ToggleGroup
                  type="single"
                  variant="outline"
                  value={field.value}
                  onValueChange={(val) => {
                    if (val) field.onChange(val)
                  }}
                  className="justify-start"
                >
                  {DAYS.map((day) => (
                    <ToggleGroupItem key={day} value={day} aria-label={day}>
                      {day}
                    </ToggleGroupItem>
                  ))}
                </ToggleGroup>
              )}
            />
            {form.formState.errors.day && (
              <FieldError errors={[form.formState.errors.day]} />
            )}
          </FieldSet>
          <div className="flex flex-col gap-x-4 md:flex-row">
            <Controller
              name="timeFrom"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field>
                  <FieldLabel>From</FieldLabel>
                  <SimpleTimePicker
                    onChange={field.onChange}
                    value={field.value}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <Controller
              name="timeTo"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field>
                  <FieldLabel>To</FieldLabel>
                  <SimpleTimePicker
                    onChange={field.onChange}
                    value={field.value}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" className="ml-auto">
            <IconSearch />
            Find Rooms
          </Button>
        </CardFooter>
      </Card>
    </form>
  )
}
