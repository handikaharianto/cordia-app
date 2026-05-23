import ClassroomSearchForm from "@/components/classroom-finder/classroom-search-form"
import { supabase } from "@/lib/supabase"
import type { Building } from "@/types"

type ClassroomFinderPageProps = {
  searchParams: Promise<{ campus?: string }>
}

async function ClassroomFinderPage({ searchParams }: ClassroomFinderPageProps) {
  const { campus } = await searchParams

  const { data: buildings }: { data: Building[] | null } = await supabase
    .from("buildings")
    .select("*")

  const filteredBuildings =
    buildings?.filter((building) => building.location_code === campus) ?? []

  return (
    <div>
      <div className="mb-8 space-y-2">
        <h2 className="text-4xl font-medium">Classroom Finder</h2>
        <p>
          Locate available rooms across campus for study sessions or meetings.
        </p>
      </div>

      <ClassroomSearchForm buildings={filteredBuildings} />
    </div>
  )
}

export default ClassroomFinderPage
