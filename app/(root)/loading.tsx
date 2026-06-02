import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

function ClassroomCardSkeleton() {
  return (
    <Card className="shadow-sm">
      <CardHeaderSkeleton />
      <CardContent className="space-y-2">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
      </CardContent>
    </Card>
  )
}

function CardHeaderSkeleton() {
  return (
    <div className="space-y-2 px-6 pt-6">
      <Skeleton className="h-7 w-32" />
      <Skeleton className="h-4 w-48" />
    </div>
  )
}

function SearchFormSkeleton() {
  return (
    <Card>
      <CardContent className="flex flex-col gap-4 lg:flex-row">
        <div className="flex grow flex-col gap-2">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-9" />
        </div>
        <div className="flex grow flex-col gap-2">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-9" />
        </div>
        <div className="flex flex-col gap-2">
          <Skeleton className="h-4 w-8" />
          <div className="flex gap-1">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-9 w-12" />
            ))}
          </div>
        </div>
        <div className="flex flex-col gap-2 md:flex-row">
          <div className="flex flex-col gap-2">
            <Skeleton className="h-4 w-10" />
            <Skeleton className="h-9 md:w-28" />
          </div>
          <div className="flex flex-col gap-2">
            <Skeleton className="h-4 w-6" />
            <Skeleton className="h-9 md:w-28" />
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Skeleton className="ml-auto h-9 w-32" />
      </CardFooter>
    </Card>
  )
}

function Loading() {
  return (
    <div className="px-4">
      <div className="my-8 space-y-2">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-5 w-96 max-w-full" />
      </div>

      <SearchFormSkeleton />

      <div className="mt-6">
        <Skeleton className="mb-4 h-4 w-40" />
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <ClassroomCardSkeleton key={i} />
          ))}
        </div>
      </div>
    </div>
  )
}

export default Loading
