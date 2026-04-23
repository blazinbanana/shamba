import { Skeleton } from '@/components/ui/skeleton'
import { Card, CardContent } from '@/components/ui/card'

export default function LoadingProfilePage() {
  return (
    <div className="max-w-lg space-y-6 animate-pulse">
      {/* Header */}
      <div className="space-y-2">
        <Skeleton className="h-6 w-40" />
        <Skeleton className="h-4 w-72" />
      </div>

      {/* Form Card */}
      <Card>
        <CardContent className="p-6 space-y-4">
          {/* Avatar */}
          <div className="flex items-center gap-4">
            <Skeleton className="w-14 h-14 rounded-full" />
            <Skeleton className="h-4 w-32" />
          </div>

          {/* Inputs */}
          <div className="space-y-3">
            <Skeleton className="h-10 w-full rounded-md" />
            <Skeleton className="h-10 w-full rounded-md" />
            <Skeleton className="h-10 w-full rounded-md" />
          </div>

          {/* Button */}
          <Skeleton className="h-10 w-32 rounded-md" />
        </CardContent>
      </Card>
    </div>
  )
}