// Copyright 2026 Caleb Maina
import { cn } from '@/lib/utils'
import { STATUS_CONFIG } from '@/lib/constants'
import type { FieldStatus } from '@/lib/types'

interface Props {
  status: FieldStatus
  size?: 'sm' | 'md'
}

export default function FieldStatusBadge({ status, size = 'md' }: Props) {
  const cfg = STATUS_CONFIG[status]
  return (
    <span className={cn(
      'inline-flex items-center gap-1.5 font-medium rounded-full',
      cfg.bg, cfg.color,
      size === 'sm' ? 'text-xs px-2 py-0.5' : 'text-xs px-2.5 py-1'
    )}>
      <span className={cn('rounded-full shrink-0', cfg.dot, size === 'sm' ? 'w-1.5 h-1.5' : 'w-2 h-2')} />
      {cfg.label}
    </span>
  )
}