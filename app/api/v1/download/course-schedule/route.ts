import { NextResponse } from "next/server"
import { parse } from "csv-parse/sync"
import { parseDate } from "@/lib/date"
import { formatDate, formatTime } from "@/lib/utils"
import { Classroom, CourseSchedule } from "@/types"
import { supabase } from "@/lib/supabase"

const BATCH_SIZE = 1000

const cleanDatabase = async () => {
  await supabase
    .from("classrooms")
    .delete()
    .neq("id", "00000000-0000-0000-0000-000000000000")
  await supabase
    .from("buildings")
    .delete()
    .neq("id", "00000000-0000-0000-0000-000000000000")
}

const seedClassroomData = async (data: Classroom[]) => {
  const { error } = await supabase.from("classrooms").insert(data)
  if (error) throw error
}

const seedBuildingCodeData = async (data: Classroom[]) => {
  // Get unique building_code + location_code combinations
  const buildingCodes = [
    ...new Map(
      data.map((classroom) => [
        `${classroom.building_code}-${classroom.location_code}`,
        {
          building_code: classroom.building_code,
          location_code: classroom.location_code,
        },
      ])
    ).values(),
  ]

  const { error } = await supabase.from("buildings").upsert(buildingCodes, {
    onConflict: "building_code",
    ignoreDuplicates: true,
  })
  if (error) throw error
}

export async function GET(request: Request) {
  // check cron secret
  const authHeader = request.headers.get("Authorization")
  if (authHeader !== `Bearer ${process.env.NEXT_PUBLIC_CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  /**
   * clean up database
   */
  await cleanDatabase()

  const URL =
    "https://opendata.concordia.ca/datasets/sis/CU_SR_OPEN_DATA_SCHED.csv"

  const response = await fetch(URL)
  const buffer = await response.arrayBuffer()
  const csvText = new TextDecoder("utf-16le").decode(buffer)

  const records = parse(csvText, {
    columns: true,
    skip_empty_lines: true,
    trim: true,
    bom: true,
  }) as CourseSchedule[]

  const classrooms = records
    .filter((row) => {
      const buildingCode = row["Building Code"] as string
      const room = row["Room"] as string

      const startDate = parseDate(row["Start Date (DD/MM/YYYY)"])
      const endDate = parseDate(row["End Date (DD/MM/YYYY)"])
      const currentDate = new Date()
      currentDate.setHours(0, 0, 0, 0)

      const hasBuildingCode = buildingCode !== ""
      const hasRoom = !room.toLowerCase().includes("tba")
      const isWithinRange = startDate <= currentDate && currentDate <= endDate

      return isWithinRange && hasBuildingCode && hasRoom
    })
    .map((row) => {
      return {
        location_code: row["Location Code"],
        location_description: row["Location Descr"],
        room_code: row["Room Code"],
        building_code: row["Building Code"],
        room: row["Room"],
        class_start_time: formatTime(row["Class Start Time"]),
        class_end_time: formatTime(row["Class End Time"]),
        monday: row["Mon"],
        tuesday: row["Tues"],
        wednesday: row["Wed"],
        thursday: row["Thurs"],
        friday: row["Fri"],
        saturday: row["Sat"],
        sunday: row["Sun"],
        start_date: formatDate(row["Start Date (DD/MM/YYYY)"]),
        end_date: formatDate(row["End Date (DD/MM/YYYY)"]),
        faculty_code: row["Faculty Code"],
        faculty_description: row["Faculty Descr"],
      }
    }) as Classroom[]

  /**
   * Seed data into a database
   */
  const totalBatches = Math.ceil(classrooms.length / BATCH_SIZE)
  let insertedCount = 0

  for (let i = 0; i < totalBatches; i++) {
    const batch = classrooms.slice(i * BATCH_SIZE, (i + 1) * BATCH_SIZE)
    await seedClassroomData(batch)
    insertedCount += batch.length

    console.log(`Inserted ${insertedCount}/${classrooms.length} rows`)
  }

  await seedBuildingCodeData(classrooms)

  return NextResponse.json({
    count: classrooms.length,
    message: "Data has been seeded successfully!",
  })
}
