'use client'

import Link from 'next/link'
import { formatDistanceToNow } from 'date-fns'
import { MapPin, Calendar, Maximize2, User } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import FieldStatusBadge from './FieldStatusBadge'
import { STAGE_CONFIG } from '@/lib/constants'
import { getStageProgress } from '@/lib/field-utils'
import type { Field } from '@/lib/types'

interface Props {
  field: Field
  showAgent?: boolean
}

export default function FieldCard({ field, showAgent = false }: Props) {
  const stage = STAGE_CONFIG[field.current_stage]
  const progress = getStageProgress(field.current_stage)

  return (
    <Link href={`/fields/${field.id}`}>
      <Card className="group hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 border-border overflow-hidden cursor-pointer h-full">
        {/* Colour accent strip */}
        <div className={`h-1 w-full ${
          field.status === 'at_risk' ? 'bg-amber-400' :
          field.status === 'completed' ? 'bg-slate-400' :
          'bg-emerald-500'
        }`} />

        <CardContent className="p-5">
          {/* Header */}
          <div className="flex items-start justify-between mb-3">
            <div className="min-w-0 flex-1">
              <h3 className="font-display font-semibold text-base text-emerald-950 group-hover:text-emerald-700 transition-colors truncate pr-2">
                {field.name}
              </h3>
              <p className="text-sm text-muted-foreground mt-0.5">{field.crop_type}</p>
            </div>
            {field.status && <FieldStatusBadge status={field.status} size="sm" />}
          </div>

          {/* Stage */}
          <div className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full border ${stage.bg} ${stage.color} ${stage.border} mb-4`}>
            <span>{stage.icon}</span>
            {stage.label}
          </div>

          {/* Progress bar */}
          <div className="mb-4">
            <div className="flex justify-between text-xs text-muted-foreground mb-1">
              <span>Progress</span>
              <span>{progress}%</span>
            </div>
            <div className="h-1.5 bg-muted rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all ${
                  field.status === 'at_risk' ? 'bg-amber-400' :
                  field.status === 'completed' ? 'bg-slate-400' :
                  'bg-emerald-500'
                }`}
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Meta */}
          <div className="space-y-1.5 text-xs text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 shrink-0" />
              <span>Planted {formatDistanceToNow(new Date(field.planting_date), { addSuffix: true })}</span>
            </div>
            {field.location && (
              <div className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 shrink-0" />
                <span className="truncate">{field.location}</span>
              </div>
            )}
            {field.area_hectares && (
              <div className="flex items-center gap-1.5">
                <Maximize2 className="w-3.5 h-3.5 shrink-0" />
                <span>{field.area_hectares} ha</span>
              </div>
            )}
            {showAgent && field.assigned_agent && (
              <div className="flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 shrink-0" />
                <span className="truncate">{field.assigned_agent.full_name ?? field.assigned_agent.email}</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}