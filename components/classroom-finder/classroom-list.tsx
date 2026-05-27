import type { GroupedClassroom } from "@/types"
import ClassroomItem from "@/components/classroom-finder/classroom-item"

type ClassroomListProps = {
  classrooms: GroupedClassroom[]
  count: number
}

function ClassroomList({ classrooms, count }: ClassroomListProps) {
  if (classrooms.length === 0) {
    return (
      <div className="mt-6 text-center text-muted-foreground">
        No available rooms found. Try adjusting your search.
      </div>
    )
  }

  return (
    <div className="mt-6">
      <p className="mb-4 text-sm text-muted-foreground">
        {count} available {count === 1 ? "room" : "rooms"} found
      </p>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {classrooms.map((classroom) => (
          <ClassroomItem key={classroom.room_code} classroom={classroom} />
        ))}
      </div>
    </div>
  )
}

export default ClassroomList
