// Copyright 2026 Caleb Maina
import { Skeleton } from '@/components/ui/skeleton'
import { Card, CardContent } from '@/components/ui/card'

export default function FieldsLoading() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <Skeleton className="h-8 w-32 mb-2" />
          <Skeleton className="h-4 w-48" />
        </div>
        <Skeleton className="h-10 w-28" />
      </div>

      {/* Filter Bar */}
      <div className="space-y-3">
        <Skeleton className="h-10 w-full max-w-sm" />
        <div className="flex gap-2 flex-wrap">
          <Skeleton className="h-8 w-14" /> 
          <Skeleton className="h-8 w-24 rounded-full" />
          <Skeleton className="h-8 w-24 rounded-full" />
          <Skeleton className="h-8 w-24 rounded-full" />
          <Skeleton className="h-8 w-14 ml-2" /> 
          <Skeleton className="h-8 w-20 rounded-full" />
          <Skeleton className="h-8 w-20 rounded-full" />
        </div>
      </div>

      {/* Grid of Field Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <Card key={i} className="overflow-hidden border-border h-full">
            {/* Color accent strip */}
            <div className="h-1 w-full bg-muted" />
            <CardContent className="p-5">
              {/* Card Header */}
              <div className="flex justify-between items-start mb-3">
                <div className="space-y-2">
                  <Skeleton className="h-5 w-32" />
                  <Skeleton className="h-4 w-20" />
                </div>
                <Skeleton className="h-6 w-16 rounded-full" />
              </div>

              {/* Stage Pill */}
              <Skeleton className="h-6 w-24 rounded-full mb-4" />

              {/* Progress Bar Area */}
              <div className="mb-4 space-y-2">
                <div className="flex justify-between">
                  <Skeleton className="h-3 w-12" />
                  <Skeleton className="h-3 w-8" />
                </div>
                <Skeleton className="h-1.5 w-full rounded-full" />
              </div>

              {/* Meta Rows */}
              <div className="space-y-2.5">
                <Skeleton className="h-3 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
                <Skeleton className="h-3 w-2/3" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}