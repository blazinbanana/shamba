'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Loader2, Plus } from 'lucide-react'
import { STAGE_CONFIG, FIELD_STAGES } from '@/lib/constants'
import type { FieldStage } from '@/lib/types'

interface Props {
  fieldId: string
  currentStage: FieldStage
  agentId: string
}

export default function UpdateForm({ fieldId, currentStage, agentId }: Props) {
  const router   = useRouter()
  const supabase = createClient()
  const [loading, setLoading] = useState(false)
  const [stage, setStage]     = useState<FieldStage>(currentStage)
  const [notes, setNotes]     = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!notes.trim()) {
      toast.error('Please add some notes about this update.')
      return
    }
    setLoading(true)
    try {
      // Insert update record
      const { error: updateErr } = await supabase.from('field_updates').insert({
        field_id: fieldId,
        agent_id: agentId,
        stage,
        notes: notes.trim(),
      })
      if (updateErr) throw updateErr

      // Update field stage if changed
      if (stage !== currentStage) {
        const { error: fieldErr } = await supabase
          .from('fields')
          .update({ current_stage: stage })
          .eq('id', fieldId)
        if (fieldErr) throw fieldErr
      }

      toast.success('Field update logged successfully!')
      setNotes('')
      router.refresh()
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Failed to save update')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="border-emerald-100">
      <CardHeader className="pb-4">
        <CardTitle className="font-display text-base text-emerald-950 flex items-center gap-2">
          <Plus className="w-4 h-4 text-emerald-600" />
          Log an Update
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Label>Stage</Label>
            <Select value={stage} onValueChange={v => setStage(v as FieldStage)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {FIELD_STAGES.map(s => {
                  //Extract the icon component
                  const Icon = STAGE_CONFIG[s].icon;
                  
                  return (
                    <SelectItem key={s} value={s}>
                      
                      <div className="flex items-center gap-2">
                        
                        <Icon className="w-4 h-4 shrink-0" />
                        <span>{STAGE_CONFIG[s].label}</span>
                      </div>
                    </SelectItem>
                  )
                })}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label>Observations / Notes</Label>
            <Textarea
              placeholder="Describe the field condition, any issues or improvements observed…"
              value={notes}
              onChange={e => setNotes(e.target.value)}
              rows={3}
              required
              className="resize-none"
            />
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Save Update'}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}