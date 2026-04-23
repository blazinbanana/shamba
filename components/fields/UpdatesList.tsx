// Copyright 2026 Caleb Maina
import { formatDistanceToNow, format } from 'date-fns'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { STAGE_CONFIG } from '@/lib/constants'
import type { FieldUpdate } from '@/lib/types'
import { Clock } from 'lucide-react'

interface Props { updates: FieldUpdate[] }

export default function UpdatesList({ updates }: Props) {
  if (updates.length === 0) {
    return (
      <Card>
        <CardContent className="py-8 text-center text-muted-foreground text-sm">
          No updates yet. Field agents will log observations here.
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader className="pb-4">
        <CardTitle className="font-display text-base text-emerald-950 flex items-center gap-2">
          <Clock className="w-4 h-4 text-emerald-600" />
          Update History
        </CardTitle>
      </CardHeader>
      <CardContent className="divide-y divide-border">
        {updates.map(update => {
          const cfg      = STAGE_CONFIG[update.stage]
          
          const Icon     = cfg.icon
          
          const initials = update.agent?.full_name
            ? update.agent.full_name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
            : '?'

          return (
            <div key={update.id} className="py-4 first:pt-0 last:pb-0">
              <div className="flex items-start gap-3">
                <Avatar className="w-8 h-8 mt-0.5 shrink-0">
                  <AvatarFallback className="bg-emerald-100 text-emerald-700 text-xs font-bold">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <span className="text-sm font-medium text-foreground">
                      {update.agent?.full_name ?? update.agent?.email ?? 'Unknown agent'}
                    </span>
                    
                    <span className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full font-medium ${cfg.bg} ${cfg.color}`}>
                      <Icon className="w-3 h-3 shrink-0" /> {cfg.label}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground mb-1">{update.notes}</p>
                  <time
                    className="text-xs text-muted-foreground/70"
                    title={format(new Date(update.created_at), 'PPpp')}
                  >
                    {formatDistanceToNow(new Date(update.created_at), { addSuffix: true })}
                  </time>
                </div>
              </div>
            </div>
          )
        })}
      </CardContent>
    </Card>
  )
}