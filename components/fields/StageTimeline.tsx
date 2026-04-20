import { STAGE_CONFIG, FIELD_STAGES } from '@/lib/constants'
import type { FieldStage } from '@/lib/types'
import { cn } from '@/lib/utils'
import { Check } from 'lucide-react'

interface Props { currentStage: FieldStage }

export default function StageTimeline({ currentStage }: Props) {
  const currentStep = STAGE_CONFIG[currentStage].step

  return (
    <div className="flex items-center gap-0">
      {FIELD_STAGES.map((stage, idx) => {
        const cfg  = STAGE_CONFIG[stage]
        const done = cfg.step < currentStep
        const active = stage === currentStage
        const last = idx === FIELD_STAGES.length - 1

        return (
          <div key={stage} className="flex items-center flex-1 last:flex-none">
            <div className="flex flex-col items-center">
              <div className={cn(
                'w-8 h-8 rounded-full flex items-center justify-center text-sm border-2 transition-all',
                done   ? 'bg-emerald-600 border-emerald-600 text-white' :
                active ? 'border-emerald-600 bg-emerald-50 text-emerald-700' :
                         'border-gray-200 bg-white text-gray-400'
              )}>
                {done ? <Check className="w-4 h-4" /> : cfg.icon}
              </div>
              <span className={cn(
                'text-xs mt-1 font-medium whitespace-nowrap',
                active ? 'text-emerald-700' : done ? 'text-emerald-600' : 'text-gray-400'
              )}>
                {cfg.label}
              </span>
            </div>
            {!last && (
              <div className={cn(
                'h-0.5 flex-1 mx-1 mb-5',
                done ? 'bg-emerald-500' : 'bg-gray-200'
              )} />
            )}
          </div>
        )
      })}
    </div>
  )
}