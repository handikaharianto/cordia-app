"use server"

import { supabase } from "@/lib/supabase"
import { Classroom, GroupedClassroom } from "@/types"

function groupByRoom(
  classrooms: Classroom[],
  startTime: string,
  endTime: string
): GroupedClassroom[] {
  const map = new Map<string, GroupedClassroom>()

  for (const classroom of classrooms) {
    // Only include if the class time is before the next class schedule
    const isClassroomAvailable =
      startTime < classroom.class_start_time &&
      endTime < classroom.class_start_time

    if (!isClassroomAvailable) continue

    const key = `${classroom.building_code}:${classroom.room}`

    const existing = map.get(key)
    if (existing) {
      // check if the same start and end times of the next class schedules have been added
      const alreadyExists = existing.schedules.some(
        (s) =>
          s.class_start_time === classroom.class_start_time &&
          s.class_end_time === classroom.class_end_time
      )
      // if it doesn't exist, then add it
      if (!alreadyExists) {
        existing.schedules.push({
          class_start_time: classroom.class_start_time,
          class_end_time: classroom.class_end_time,
        })
      }
    } else {
      const { class_start_time, class_end_time, ...rest } = classroom
      map.set(key, {
        ...rest,
        schedules: [{ class_start_time, class_end_time }],
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

  // Find rooms that are occupied during the specified time on the given day
  let occupiedQuery = supabase
    .from("classrooms")
    .select("room_code")
    .eq(day, "Y")
    .eq("location_code", location)
    .lt("class_start_time", endTime)
    .gt("class_end_time", startTime)

  if (buildingCode) {
    occupiedQuery = occupiedQuery.eq("building_code", buildingCode)
  }

  const { data: occupiedRooms } = await occupiedQuery

  // Get all classrooms at the location, excluding occupied ones
  let query = supabase
    .from("classrooms")
    .select("*", { count: "exact" })
    .eq("location_code", location)

  if (buildingCode) {
    query = query.eq("building_code", buildingCode)
  }

  if (occupiedRooms && occupiedRooms.length > 0) {
    const occupiedRoomCodes = occupiedRooms.map((room) => room.room_code)
    query = query.not("room_code", "in", `(${occupiedRoomCodes.join(",")})`)
  }

  const { data, count } = await query

  const classrooms = groupByRoom(data ?? [], startTime, endTime)

  return {
    classrooms,
    count: count ?? 0,
  }
}
