import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { GroupedClassroom } from "@/types"
import { IconCircleCheck, IconClock } from "@tabler/icons-react"

type ClassroomItemProps = {
  classroom: GroupedClassroom
}

function ClassroomItem({ classroom }: ClassroomItemProps) {
  const {
    location_code,
    location_description,
    building_code,
    room,
    schedules,
  } = classroom

  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle className="text-2xl font-semibold">
          {building_code} {room}
        </CardTitle>
        <CardDescription>
          {location_description} ({location_code})
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-2">
        {schedules.length === 0 && (
          <Badge className="bg-green-50 p-4 text-sm text-green-700 dark:bg-green-950 dark:text-green-300">
            <IconCircleCheck />
            Available All Day
          </Badge>
        )}
        {schedules.length > 0 && (
          <>
            <div className="flex items-center gap-x-1">
              <IconClock size={16} />
              <h3 className="text-xs font-semibold">NEXT SCHEDULED CLASSES</h3>
            </div>
            <div className="flex flex-col gap-y-2">
              {schedules.map(({ class_start_time, class_end_time }) => (
                <Badge
                  key={`${class_start_time}-${class_end_time}`}
                  variant="secondary"
                  className="p-4 text-sm"
                >
                  {class_start_time} - {class_end_time}
                </Badge>
              ))}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}

export default ClassroomItem
