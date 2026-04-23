import { redirect, notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { withStatus, getDaysSincePlanting } from '@/lib/field-utils'
import StageTimeline from '@/components/fields/StageTimeline'
import UpdateForm from '@/components/fields/UpdateForm'
import UpdatesList from '@/components/fields/UpdatesList'
import FieldStatusBadge from '@/components/fields/FieldStatusBadge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import { ChevronLeft, MapPin, Calendar, Maximize2, Pencil, User } from 'lucide-react'
import { format } from 'date-fns'
import type { Field, FieldUpdate, Profile } from '@/lib/types'
import { STAGE_CONFIG } from '@/lib/constants'

interface Props { params: Promise<{ id: string }> }

export default async function FieldDetailPage({ params }: Props) {
  const { id }   = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single()
  const isAdmin = profile?.role === 'admin'

  const { data: rawField } = await supabase
    .from('fields')
    .select('*, assigned_agent:profiles!fields_assigned_agent_id_fkey(*)')
    .eq('id', id)
    .single()

  if (!rawField) notFound()

  // Agents can only view their own fields
  if (!isAdmin && rawField.assigned_agent_id !== user.id) redirect('/fields')

  const field = withStatus(rawField as Field)
  const stageCfg = STAGE_CONFIG[field.current_stage]
  const days = getDaysSincePlanting(field.planting_date)
  const Icon = stageCfg.icon

  const { data: rawUpdates } = await supabase
    .from('field_updates')
    .select('*, agent:profiles!field_updates_agent_id_fkey(*)')
    .eq('field_id', id)
    .order('created_at', { ascending: false })

  const updates = (rawUpdates ?? []) as FieldUpdate[]
  const canUpdate = !isAdmin && field.assigned_agent_id === user.id

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Breadcrumb + actions */}
      <div className="flex items-start justify-between">
        <div>
          <Button variant="ghost" asChild className="gap-1 text-muted-foreground -ml-2 mb-2">
            <Link href="/fields"><ChevronLeft className="w-4 h-4" /> Back to Fields</Link>
          </Button>
          <div className="flex items-center gap-3 flex-wrap">
            <h2 className="font-display text-2xl font-bold text-emerald-950">{field.name}</h2>
            <FieldStatusBadge status={field.status!} />
          </div>
          <p className="text-muted-foreground mt-1">{field.crop_type}</p>
        </div>
        {isAdmin && (
          <Button asChild variant="outline" className="gap-2 border-emerald-200 hover:bg-emerald-50">
            <Link href={`/fields/${id}/edit`}><Pencil className="w-4 h-4" /> Edit Field</Link>
          </Button>
        )}
      </div>

      {/* Stage timeline */}
      <Card>
        <CardContent className="pt-6">
          <StageTimeline currentStage={field.current_stage} />
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: details */}
        <div className="lg:col-span-2 space-y-5">
          {/* Info card */}
          <Card>
            <CardContent className="p-5">
              <h3 className="font-display font-semibold text-base mb-4 text-emerald-950">Field Details</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground text-xs uppercase tracking-wide mb-1">Current Stage</p>
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${stageCfg.bg} ${stageCfg.color}`}>
                    <Icon className="w-3.5 h-3.5 shrink-0" /> {stageCfg.label}
                  </span>
                </div>
                <div>
                  <p className="text-muted-foreground text-xs uppercase tracking-wide mb-1">Days in Field</p>
                  <p className="font-semibold text-emerald-950">{days} days</p>
                </div>
                <div className="flex items-start gap-2">
                  <Calendar className="w-4 h-4 text-muted-foreground mt-0.5 shrink-0" />
                  <div>
                    <p className="text-muted-foreground text-xs mb-0.5">Planted</p>
                    <p className="font-medium">{format(new Date(field.planting_date), 'dd MMM yyyy')}</p>
                  </div>
                </div>
                {field.location && (
                  <div className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 text-muted-foreground mt-0.5 shrink-0" />
                    <div>
                      <p className="text-muted-foreground text-xs mb-0.5">Location</p>
                      <p className="font-medium">{field.location}</p>
                    </div>
                  </div>
                )}
                {field.area_hectares && (
                  <div className="flex items-start gap-2">
                    <Maximize2 className="w-4 h-4 text-muted-foreground mt-0.5 shrink-0" />
                    <div>
                      <p className="text-muted-foreground text-xs mb-0.5">Area</p>
                      <p className="font-medium">{field.area_hectares} hectares</p>
                    </div>
                  </div>
                )}
                {field.assigned_agent && (
                  <div className="flex items-start gap-2">
                    <User className="w-4 h-4 text-muted-foreground mt-0.5 shrink-0" />
                    <div>
                      <p className="text-muted-foreground text-xs mb-0.5">Assigned Agent</p>
                      <p className="font-medium">
                        {(field.assigned_agent as Profile).full_name ?? (field.assigned_agent as Profile).email}
                      </p>
                    </div>
                  </div>
                )}
              </div>
              {field.notes && (
                <div className="mt-4 pt-4 border-t border-border">
                  <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1.5">Notes</p>
                  <p className="text-sm text-foreground leading-relaxed">{field.notes}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Updates list */}
          <UpdatesList updates={updates} />
        </div>

        {/* Right: update form (agents only) */}
        <div>
          {canUpdate && (
            <UpdateForm
              fieldId={field.id}
              currentStage={field.current_stage}
              agentId={user.id}
            />
          )}
          {isAdmin && updates.length > 0 && (
            <Card>
              <CardContent className="p-5">
                <h3 className="font-display font-semibold text-sm text-emerald-950 mb-3">Quick Stats</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Total updates</span>
                    <span className="font-medium">{updates.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Last updated</span>
                    <span className="font-medium text-xs">
                      {format(new Date(updates[0].created_at), 'dd MMM')}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}