"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm, Controller, type Resolver } from "react-hook-form"
import { useEffect } from "react"
import { useRouter } from "next/navigation"
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

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"] as const

const CAMPUS_OPTIONS = [
  { value: "SGW", label: "Sir George Williams" },
  { value: "LOY", label: "Loyola Campus" },
]

const formSchema = z
  .object({
    day: z.enum(["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"], {
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

type ClassroomSearchFormProps = {
  buildings: Building[]
}

export default function ClassroomSearchForm({
  buildings,
}: ClassroomSearchFormProps) {
  const router = useRouter()

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema) as Resolver<FormValues>,
    defaultValues: {
      day: undefined,
      timeFrom: new Date(),
      timeTo: new Date(new Date().getTime() + 60 * 60 * 1000),
      campus: CAMPUS_OPTIONS[0].value,
      building: "",
    },
  })

  function onSubmit(values: FormValues) {
    console.log("Form submitted:", values)
  }

  const campus = form.watch("campus")
  const building = form.watch("building")
  const day = form.watch("day")

  // Reset building when campus changes
  useEffect(() => {
    form.setValue("building", "")
  }, [campus, form])

  // Update URL when form values change
  useEffect(() => {
    const params = new URLSearchParams()

    if (campus) params.set("campus", campus)
    if (building) params.set("building", building)
    if (day) params.set("day", day)

    router.push(`?${params.toString()}`, { scroll: false })
  }, [building, campus, day, router, form])

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
                    {buildings.map((building) => (
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

          {/* Time From / To */}
          {/* TODO:
                1. remove seconds from the time picker
                2. fix the styling so it matches the other select components
            */}
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
