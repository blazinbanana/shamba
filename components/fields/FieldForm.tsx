// Copyright 2026 Caleb Maina
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Loader2, Save, Trash2 } from 'lucide-react'
import { CROP_TYPES, STAGE_CONFIG, FIELD_STAGES } from '@/lib/constants'
import type { Field, Profile, FieldStage } from '@/lib/types'

interface Props {
  field?: Field
  agents: Profile[]
  adminId: string
}

export default function FieldForm({ field, agents, adminId }: Props) {
  const router   = useRouter()
  const supabase = createClient()
  const isEdit   = !!field
  const [loading, setLoading]   = useState(false)
  const [deleting, setDeleting] = useState(false)

  const [form, setForm] = useState({
    name:               field?.name ?? '',
    crop_type:          field?.crop_type ?? '',
    planting_date:      field?.planting_date ?? new Date().toISOString().split('T')[0],
    current_stage:      (field?.current_stage ?? 'planted') as FieldStage,
    location:           field?.location ?? '',
    area_hectares:      field?.area_hectares?.toString() ?? '',
    assigned_agent_id:  field?.assigned_agent_id ?? '',
    notes:              field?.notes ?? '',
  })

  const set = (key: string, val: string) => setForm(f => ({ ...f, [key]: val }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const payload = {
        name:              form.name.trim(),
        crop_type:         form.crop_type,
        planting_date:     form.planting_date,
        current_stage:     form.current_stage,
        location:          form.location.trim() || null,
        area_hectares:     form.area_hectares ? parseFloat(form.area_hectares) : null,
        assigned_agent_id: form.assigned_agent_id || null,
        notes:             form.notes.trim() || null,
      }

      if (isEdit) {
        const { error } = await supabase.from('fields').update(payload).eq('id', field!.id)
        if (error) throw error
        toast.success('Field updated successfully!')
        router.push(`/fields/${field!.id}`)
      } else {
        const { data, error } = await supabase
          .from('fields')
          .insert({ ...payload, created_by: adminId })
          .select()
          .single()
        if (error) throw error
        toast.success('Field created successfully!')
        router.push(`/fields/${data.id}`)
      }
      router.refresh()
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Failed to save field')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm('Delete this field? This cannot be undone.')) return
    setDeleting(true)
    try {
      const { error } = await supabase.from('fields').delete().eq('id', field!.id)
      if (error) throw error
      toast.success('Field deleted.')
      router.push('/fields')
      router.refresh()
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Failed to delete field')
    } finally {
      setDeleting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main info */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader><CardTitle className="font-display text-base text-emerald-950">Basic Information</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2 space-y-1.5">
                  <Label>Field Name *</Label>
                  <Input
                    value={form.name}
                    onChange={e => set('name', e.target.value)}
                    placeholder="e.g. Subukia Plot A"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <Label>Crop Type *</Label>
                  <Select value={form.crop_type} onValueChange={v => set('crop_type', v)} required>
                    <SelectTrigger><SelectValue placeholder="Select crop…" /></SelectTrigger>
                    <SelectContent className="max-h-60">
                      {CROP_TYPES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <Label>Current Stage *</Label>
                  <Select value={form.current_stage} onValueChange={v => set('current_stage', v)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent className="max-h-60 bg-white dark:bg-slate-950">
                      {FIELD_STAGES.map(s => {
                        
                        const stage = STAGE_CONFIG[s] 
                        
                        const Icon = stage.icon 
                        
                        return (
                          <SelectItem key={s} value={s}>
                            <div className="flex items-center gap-2">
                              
                              <Icon className="w-4 h-4" />
                              <span>{stage.label}</span>
                            </div>
                          </SelectItem>
                        )
                      })}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <Label>Planting Date *</Label>
                  <Input
                    type="date"
                    value={form.planting_date}
                    onChange={e => set('planting_date', e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <Label>Area (hectares)</Label>
                  <Input
                    type="number"
                    min="0"
                    step="0.01"
                    value={form.area_hectares}
                    onChange={e => set('area_hectares', e.target.value)}
                    placeholder="e.g. 2.5"
                  />
                </div>

                <div className="col-span-2 space-y-1.5">
                  <Label>Location</Label>
                  <Input
                    value={form.location}
                    onChange={e => set('location', e.target.value)}
                    placeholder="e.g. Nakuru County, Rift Valley"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle className="font-display text-base text-emerald-950">Notes</CardTitle></CardHeader>
            <CardContent>
              <Textarea
                value={form.notes}
                onChange={e => set('notes', e.target.value)}
                placeholder="Initial observations, soil type, irrigation setup…"
                rows={4}
                className="resize-none"
              />
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardHeader><CardTitle className="font-display text-base text-emerald-950">Assignment</CardTitle></CardHeader>
            <CardContent>
              <div className="space-y-1.5">
                <Label>Assigned Agent</Label>
                <Select value={form.assigned_agent_id || 'none'} onValueChange={v => set('assigned_agent_id', v === 'none' ? '' : v)}>
                  <SelectTrigger><SelectValue placeholder="Unassigned" /></SelectTrigger>
                  <SelectContent className="max-h-60">
                    <SelectItem value="none">— Unassigned —</SelectItem>
                    {agents.map(a => (
                      <SelectItem key={a.id} value={a.id}>
                        {a.full_name ?? a.email}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-3">
            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white gap-2"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              {isEdit ? 'Save Changes' : 'Create Field'}
            </Button>

            {isEdit && (
              <Button
                type="button"
                variant="outline"
                disabled={deleting}
                onClick={handleDelete}
                className="w-full text-red-600 border-red-200 hover:bg-red-50 gap-2"
              >
                {deleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                Delete Field
              </Button>
            )}
          </div>
        </div>
      </div>
    </form>
  )
}