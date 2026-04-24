import ClassroomSearchForm from "@/components/classroom-finder/classroom-search-form"

function ClassroomFinderPage() {
  return (
    <div>
      <div className="mb-8 space-y-2">
        <h2 className="text-4xl font-medium">Classroom Finder</h2>
        <p>
          Locate available rooms across campus for study sessions or meetings.
        </p>
      </div>

      <ClassroomSearchForm />
    </div>
  )
}

export default ClassroomFinderPage
