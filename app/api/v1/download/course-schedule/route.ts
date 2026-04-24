import { NextResponse } from "next/server"
import { parse } from "csv-parse/sync"
import fs from "fs"
import { parseDate } from "@/lib/date"

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
  })

  const courseSchedules = records
    .filter((row: any) => {
      const buildingCode = row["Building Code"] as string

      const startDate = parseDate(row["Start Date (DD/MM/YYYY)"])
      const endDate = parseDate(row["End Date (DD/MM/YYYY)"])
      const currentDate = new Date()

      const hasBuildingCode = buildingCode !== ""
      const isWithinRange = currentDate >= startDate && currentDate <= endDate

      return isWithinRange && hasBuildingCode
    })
    .map((row: any) => {
      return {
        courseId: row["Course ID"],
        termCode: row["Term Code"],
        termDescription: row["Term Descr"],
        sessionCode: row["Session"],
        subject: row["Subject"],
        catalogNumber: row["Catalog Nbr"],
        section: row["Section"],
        componentCode: row["Component Code"],
        componentDescription: row["Component Descr"],
        classNumber: row["Class Nbr"],
        classAssociation: row["Class Association"],
        courseTitle: row["Course Title"],
        topicID: row["Topic ID"],
        topicDescription: row["Topic Descr"],
        combinedSectionID: row["Combined Section ID"],
        classStatus: row["Class Status"],
        locationCode: row["Location Code"],
        locationDescription: row["Location Descr"],
        instructionModeCode: row["Instruction Mode code"],
        instructionModeDescription: row["Instruction Mode Descr"],
        meetingPatternNumber: row["Meeting Pattern Nbr"],
        roomCode: row["Room Code"],
        buildingCode: row["Building Code"],
        room: row["Room"],
        classStartTime: row["Class Start Time"],
        classEndTime: row["Class End Time"],
        monday: row["Mon"],
        tuesday: row["Tues"],
        wednesday: row["Wed"],
        thursday: row["Thurs"],
        friday: row["Fri"],
        saturday: row["Sat"],
        sunday: row["Sun"],
        startDate: row["Start Date (DD/MM/YYYY)"],
        endDate: row["End Date (DD/MM/YYYY)"],
        career: row["Career"],
        departmentCode: row["Dept. Code"],
        departmentDescription: row["Dept. Descr"],
        facultyCode: row["Faculty Code"],
        facultyDescription: row["Faculty Descr"],
        enrollmentCapacity: row["Enrollment Capacity"],
        currentEnrollment: row["Current Enrollment"],
        waitlistCapacity: row["Waitlist Capacity"],
        currentWaitlistTotal: row["Current Waitlist Total"],
        allSeatsReserved: row["Has some/all seats reserved?"],
      }
    })

  /**
   * Seed data into a database
   */

  return NextResponse.json({
    count: courseSchedules.length,
    data: courseSchedules,
  })
}
