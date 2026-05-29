"use server"

import { supabase } from "@/lib/supabase"
import { Classroom, GroupedClassroom } from "@/types"

function groupByRoom(classrooms: Classroom[], day: string): GroupedClassroom[] {
  const map = new Map<string, GroupedClassroom>()

  for (const classroom of classrooms) {
    const key = `${classroom.building_code}:${classroom.room}`

    const hasClassOnDay = classroom[day as keyof Classroom]

    const existing = map.get(key)
    if (existing) {
      if (hasClassOnDay) {
        existing.schedules.push({
          class_start_time: classroom.class_start_time,
          class_end_time: classroom.class_end_time,
        })
      }
    } else {
      const { class_start_time, class_end_time, ...rest } = classroom
      map.set(key, {
        ...rest,
        schedules: hasClassOnDay ? [{ class_start_time, class_end_time }] : [],
      })
    }
  }

  return Array.from(map.values())
}

export async function getAvailableClassrooms(params: {
  day: string
  startTime: string
  endTime: string
  location: string
  buildingCode?: string
}): Promise<{ classrooms: GroupedClassroom[]; count: number }> {
  const { day, startTime, endTime, location, buildingCode } = params

  let availableClassroomsQuery = supabase
    .from("classrooms")
    .select("*", { count: "exact" })
    .eq("location_code", location)
    .or(
      `${day}.eq.false,and(${day}.eq.true,class_start_time.gt.${startTime},class_start_time.gt.${endTime})`
    )

  if (buildingCode) {
    availableClassroomsQuery = availableClassroomsQuery.eq(
      "building_code",
      buildingCode
    )
  }

  const { data: availableClassrooms, count } = await availableClassroomsQuery

  const classrooms = groupByRoom(availableClassrooms ?? [], day)

  return {
    classrooms,
    count: count ?? 0,
  }
}
