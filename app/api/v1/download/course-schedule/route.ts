import { NextResponse } from "next/server"
import { parse } from "csv-parse/sync"
import fs from "fs"
import { parseDate } from "@/lib/date"
import { formatDate, formatTime } from "@/lib/utils"
import { Classroom, CourseSchedule } from "@/types"

export async function GET() {
  // const URL =
  //   "https://opendata.concordia.ca/datasets/sis/CU_SR_OPEN_DATA_SCHED.csv"

  // const response = await fetch(URL)
  // const buffer = await response.arrayBuffer()
  // const csvText = new TextDecoder("utf-16le").decode(buffer)

  // TODO: parse from CSV file
  const PATH = "/Users/handikaharianto/Downloads/CU_SR_OPEN_DATA_SCHED.csv"

  const csvText = fs.readFileSync(PATH, "utf-16le")
  // TODO: REPLACE THE ABOVE CODE

  const records = parse(csvText, {
    columns: true,
    skip_empty_lines: true,
    trim: true,
    bom: true,
  }) as CourseSchedule[]

  const classrooms = records
    .filter((row) => {
      const buildingCode = row.buildingCode as string

      const startDate = parseDate(row.startDate)
      const endDate = parseDate(row.endDate)
      const currentDate = new Date()

      const hasBuildingCode = buildingCode !== ""
      const isWithinRange = currentDate >= startDate && currentDate <= endDate

      return isWithinRange && hasBuildingCode
    })
    .map((row) => {
      return {
        locationCode: row.locationCode,
        locationDescription: row.locationDescription,
        roomCode: row.roomCode,
        buildingCode: row.buildingCode,
        room: row.room,
        classStartTime: formatTime(row.classStartTime),
        classEndTime: formatTime(row.classEndTime),
        monday: row.monday,
        tuesday: row.tuesday,
        wednesday: row.wednesday,
        thursday: row.thursday,
        friday: row.friday,
        saturday: row.saturday,
        sunday: row.sunday,
        startDate: formatDate(row.startDate),
        endDate: formatDate(row.endDate),
        facultyCode: row.facultyCode,
        facultyDescription: row.facultyDescription,
      }
    }) as Classroom[]

  /**
   * Seed data into a database
   */

  return NextResponse.json({
    count: classrooms.length,
    data: classrooms,
  })
}
