"use server"

import { supabase } from "@/lib/supabase"
import { Classroom } from "@/types"

export async function getAvailableClassrooms(params: {
  day: string
  startTime: string
  endTime: string
  location: string
  buildingCode?: string
}): Promise<{ classrooms: Classroom[]; count: number }> {
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

  return {
    classrooms: data ?? [],
    count: count ?? 0,
  }
}
