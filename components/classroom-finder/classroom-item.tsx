import { Card, CardContent } from "@/components/ui/card"
import type { GroupedClassroom } from "@/types"

type ClassroomItemProps = {
  classroom: GroupedClassroom
}

function ClassroomItem({ classroom }: ClassroomItemProps) {
  return (
    <Card>
      <CardContent>
        <p className="font-medium">{classroom.room_code}</p>
        <p className="text-sm text-muted-foreground">
          {classroom.building_code} — {classroom.room}
        </p>
        <ul className="mt-2 space-y-1">
          {classroom.schedules.map((schedule, i) => (
            <li key={i} className="text-xs text-muted-foreground">
              {schedule.class_start_time} – {schedule.class_end_time}
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  )
}

export default ClassroomItem
