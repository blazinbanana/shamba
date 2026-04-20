'use client'

import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import { useCallback } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Search, X } from 'lucide-react'
import { FIELD_STAGES, STAGE_CONFIG } from '@/lib/constants'

export default function FieldsFilter() {
  const router       = useRouter()
  const pathname     = usePathname()
  const searchParams = useSearchParams()

  const update = useCallback((key: string, value: string | null) => {
    const params = new URLSearchParams(searchParams.toString())
    if (value) {params.set(key, value)} else {params.delete(key)}
    router.push(`${pathname}?${params.toString()}`)
  }, [pathname, router, searchParams])

  const activeStage  = searchParams.get('stage')
  const activeStatus = searchParams.get('status')
  const search       = searchParams.get('search') ?? ''
  const hasFilters   = !!(activeStage || activeStatus || search)

  return (
    <div className="space-y-3">
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search fields…"
          value={search}
          onChange={e => update('search', e.target.value || null)}
          className="pl-9"
        />
      </div>

      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-sm text-muted-foreground font-medium">Stage:</span>
        {FIELD_STAGES.map(stage => (
          <button
            key={stage}
            onClick={() => update('stage', activeStage === stage ? null : stage)}
            className={`text-xs px-3 py-1.5 rounded-full border font-medium transition-all ${
              activeStage === stage
                ? `${STAGE_CONFIG[stage].bg} ${STAGE_CONFIG[stage].color} ${STAGE_CONFIG[stage].border}`
                : 'bg-white border-border text-muted-foreground hover:border-emerald-300'
            }`}
          >
            {STAGE_CONFIG[stage].icon} {STAGE_CONFIG[stage].label}
          </button>
        ))}

        <span className="text-sm text-muted-foreground font-medium ml-2">Status:</span>
        {(['active', 'at_risk', 'completed'] as const).map(s => (
          <button
            key={s}
            onClick={() => update('status', activeStatus === s ? null : s)}
            className={`text-xs px-3 py-1.5 rounded-full border font-medium transition-all capitalize ${
              activeStatus === s
                ? s === 'active' ? 'bg-emerald-100 text-emerald-700 border-emerald-300'
                : s === 'at_risk' ? 'bg-amber-100 text-amber-700 border-amber-300'
                : 'bg-slate-100 text-slate-600 border-slate-300'
                : 'bg-white border-border text-muted-foreground hover:border-emerald-300'
            }`}
          >
            {s.replace('_', ' ')}
          </button>
        ))}

        {hasFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push(pathname)}
            className="gap-1 text-muted-foreground"
          >
            <X className="w-3.5 h-3.5" /> Clear
          </Button>
        )}
      </div>
    </div>
  )
}