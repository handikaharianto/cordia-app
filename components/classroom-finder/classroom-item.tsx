import { Card, CardContent } from "@/components/ui/card"
import type { Classroom } from "@/types"

type ClassroomItemProps = {
  classroom: Classroom
}

function ClassroomItem({ classroom }: ClassroomItemProps) {
  return (
    <Card>
      <CardContent>
        <p className="font-medium">{classroom.room_code}</p>
        <p className="text-sm text-muted-foreground">
          {classroom.building_code} — {classroom.room}
        </p>
      </CardContent>
    </Card>
  )
}

export default ClassroomItem
