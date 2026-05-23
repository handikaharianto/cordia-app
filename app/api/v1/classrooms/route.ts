import { supabase } from "@/lib/supabase"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)

  const day = searchParams.get("day")
  const startTime = searchParams.get("startTime")
  const endTime = searchParams.get("endTime")
  const location = searchParams.get("location")
  const buildingCode = searchParams.get("buildingCode")

  if (!day || !startTime || !endTime || !location) {
    return NextResponse.json(
      {
        error: "Missing required parameters: day, startTime, endTime, location",
      },
      { status: 400 }
    )
  }

  /**
   * find rooms that are occupied during the specified time on the given day
   *
   * A room is occupied if:
   * 1. It has a class scheduled on the requested day (day column = 'Y')
   * 2. The class time overlaps with the requested time window (existing class starts before requested ends AND existing class ends after requested starts)
   */
  let occupiedQuery = supabase
    .from("classrooms")
    .select("room_code")
    .eq(day, "Y")
    .eq("location_code", location)
    .lt("class_start_time", endTime)
    .gt("class_end_time", startTime)

  // add filter by `building_code`
  if (buildingCode) {
    occupiedQuery = occupiedQuery.eq("building_code", buildingCode)
  }

  const { data: occupiedRooms } = await occupiedQuery

  // If there are occupied rooms, exclude them from the result
  // Otherwise, return all classrooms at the location
  let query = supabase
    .from("classrooms")
    .select("*", { count: "exact" })
    .eq("location_code", location)

  // add filter by `building_code`
  if (buildingCode) {
    query = query.eq("building_code", buildingCode)
  }

  if (occupiedRooms && occupiedRooms.length > 0) {
    const occupiedRoomCodes = occupiedRooms.map((room) => room.room_code)
    // Return only classrooms that are NOT in the occupied list
    query = query.not("room_code", "in", `(${occupiedRoomCodes.join(",")})`)
  }

  const { data: availableRooms, count } = await query

  return NextResponse.json({
    count,
    data: availableRooms,
  })
}
