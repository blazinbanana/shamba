// Copyright 2026 Caleb Maina
import { Card, CardContent } from '@/components/ui/card'
import type { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Props {
  title: string
  value: string | number
  subtitle?: string
  icon: LucideIcon
  variant?: 'default' | 'emerald' | 'amber' | 'red' | 'slate'
}

const variants = {
  default:  { card: 'bg-white',         icon: 'bg-emerald-50 text-emerald-600',  value: 'text-emerald-950' },
  emerald:  { card: 'bg-emerald-600',   icon: 'bg-white/20 text-white',          value: 'text-white' },
  amber:    { card: 'bg-white',         icon: 'bg-amber-50 text-amber-600',      value: 'text-amber-900'   },
  red:      { card: 'bg-white',         icon: 'bg-red-50 text-red-600',          value: 'text-red-900'     },
  slate:    { card: 'bg-white',         icon: 'bg-slate-50 text-slate-600',      value: 'text-slate-700'   },
}

export default function StatsCard({ title, value, subtitle, icon: Icon, variant = 'default' }: Props) {
  const v = variants[variant]

  return (
    <Card className={cn('border-border', v.card)}>
      <CardContent className="p-5">
        <div className="flex items-start justify-between">
          <div>
            <p className={cn('text-sm font-medium mb-1', variant === 'emerald' ? 'text-emerald-100' : 'text-muted-foreground')}>
              {title}
            </p>
            <p className={cn('text-3xl font-display font-bold', v.value)}>{value}</p>
            {subtitle && (
              <p className={cn('text-xs mt-1', variant === 'emerald' ? 'text-emerald-200' : 'text-muted-foreground')}>
                {subtitle}
              </p>
            )}
          </div>
          <div className={cn('w-11 h-11 rounded-xl flex items-center justify-center shrink-0', v.icon)}>
            <Icon className="w-5 h-5" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}