import type { Metadata } from "next"
import { getAvailableClassrooms } from "@/app/actions/classroom"
import ClassroomList from "@/components/classroom-finder/classroom-list"
import ClassroomSearchForm from "@/components/classroom-finder/classroom-search-form"
import { supabase } from "@/lib/supabase"
import type { Building, GroupedClassroom } from "@/types"

/** Map short day names from the form to Supabase column names */
const DAY_TO_COLUMN: Record<string, string> = {
  Mon: "monday",
  Tue: "tuesday",
  Wed: "wednesday",
  Thu: "thursday",
  Fri: "friday",
  Sat: "saturday",
  Sun: "sunday",
}

type ClassroomFinderPageProps = {
  searchParams: Promise<{
    campus?: string
    building?: string
    day?: string
    timeFrom?: string
    timeTo?: string
  }>
}

export async function generateMetadata({
  searchParams,
}: ClassroomFinderPageProps): Promise<Metadata> {
  const { campus, building, day, timeFrom, timeTo } = await searchParams

  // Build a dynamic description based on search params
  const searchParts: string[] = []
  if (campus === "SGW") searchParts.push("Sir George Williams Campus")
  else if (campus === "LOY") searchParts.push("Loyola Campus")
  if (building) searchParts.push(`Building ${building}`)
  if (day) searchParts.push(day)
  if (timeFrom && timeTo) searchParts.push(`${timeFrom} - ${timeTo}`)

  const description = searchParts.length
    ? `Available classrooms at ${searchParts.join(", ")}`
    : "Find available classrooms and study rooms at Concordia University. Search by campus, building, day, and time."

  const title = searchParts.length
    ? `Classrooms at ${searchParts.join(", ")}`
    : "Classroom Finder"

  return {
    title,
    description,
    openGraph: {
      title,
      description,
    },
  }
}

async function ClassroomFinderPage({ searchParams }: ClassroomFinderPageProps) {
  const { campus, building, day, timeFrom, timeTo } = await searchParams

  const { data: buildings }: { data: Building[] | null } = await supabase
    .from("buildings")
    .select("*")

  let classrooms: GroupedClassroom[] = []
  let count = 0

  // check if the search params exist
  if (campus && day && timeFrom && timeTo) {
    const dayColumn = DAY_TO_COLUMN[day]
    if (dayColumn) {
      const result = await getAvailableClassrooms({
        day: dayColumn,
        startTime: timeFrom,
        endTime: timeTo,
        location: campus,
        buildingCode: building || undefined,
      })
      classrooms = result.classrooms
      count = result.count
    }
  }

  return (
    <div className="px-4">
      <div className="my-8 space-y-2">
        <h2 className="text-4xl font-medium">Classroom Finder</h2>
        <p>
          Locate available rooms across campus for study sessions or meetings.
        </p>
      </div>

      <ClassroomSearchForm buildings={buildings ?? []} />
      <ClassroomList classrooms={classrooms} count={count} />
    </div>
  )
}

export default ClassroomFinderPage
