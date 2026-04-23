import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { withStatus } from '@/lib/field-utils'
import StatsCard from '@/components/dashboard/StatsCard'
import FieldCard from '@/components/fields/FieldCard'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { formatDistanceToNow } from 'date-fns'
import {
  Rows3, AlertTriangle, CheckCircle2, TrendingUp,
  Users, Plus, ArrowRight, Clock,
} from 'lucide-react'
import type { Field, FieldUpdate, Profile } from '@/lib/types'
import { FarmerTractorIcon } from '@/components/ui/FarmerTractorIcon'
export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

const { data: profile } = await supabase
  .from('profiles').select('*').eq('id', user.id).single()
if (!profile) redirect('/login')

const isAdmin = profile.role === 'admin'

let fieldsQuery = supabase
  .from('fields')
  .select('*, assigned_agent:profiles!fields_assigned_agent_id_fkey(*)')
  .order('created_at', { ascending: false })

if (!isAdmin) {
  fieldsQuery = fieldsQuery.eq('assigned_agent_id', user.id)
}

// fields + agentCount in parallel
const [fieldsRes, agentCountRes] = await Promise.all([
  fieldsQuery,
  isAdmin
    ? supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .eq('role', 'field_agent')
    : Promise.resolve({ data: null, count: 0 })
])

const rawFields = fieldsRes.data
let agentCount = isAdmin ? (agentCountRes.count ?? 0) : 0
  const fields = (rawFields ?? []).map(f => withStatus(f as Field))

  const totalFields    = fields.length
  const activeFields   = fields.filter(f => f.status === 'active').length
  const atRiskFields   = fields.filter(f => f.status === 'at_risk').length
  const completedFields = fields.filter(f => f.status === 'completed').length

  // last 5 updates
  let updatesQuery = supabase
    .from('field_updates')
    .select('*, agent:profiles!field_updates_agent_id_fkey(*), field:fields(id,name,crop_type)')
    .order('created_at', { ascending: false })
    .limit(5)

  if (!isAdmin) {
    const myFieldIds = fields.map(f => f.id)
    if (myFieldIds.length > 0) {
      updatesQuery = updatesQuery.in('field_id', myFieldIds)
    }
  }

  const { data: recentUpdates } = await updatesQuery

  const atRiskList = fields.filter(f => f.status === 'at_risk').slice(0, 4)

  return (
    <div className="space-y-8">
      {/* Welcome */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display text-2xl font-bold text-emerald-950 flex items-baseline gap-3 flex-wrap">
            <span>
              Good {getGreeting()}, {profile.full_name?.split(' ')[0] ?? 'there'}
            </span>
            <FarmerTractorIcon className="w-11 h-11 translate-y-[2px]" />
          </h2>
          <p className="text-muted-foreground mt-1">
            {isAdmin ? 'Here is an overview of all your fields.' : 'Here is the status of your assigned fields.'}
          </p>
        </div>
        {isAdmin && (
          <Button asChild className="bg-emerald-600 hover:bg-emerald-700 text-white gap-2">
            <Link href="/fields/new"><Plus className="w-4 h-4" /> New Field</Link>
          </Button>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Total Fields"
          value={totalFields}
          icon={Rows3}
          variant="emerald"
          subtitle={isAdmin ? `${agentCount} active agents` : undefined}
        />
        <StatsCard title="Active"    value={activeFields}    icon={TrendingUp}  variant="default" />
        <StatsCard title="At Risk"   value={atRiskFields}    icon={AlertTriangle} variant="amber" />
        <StatsCard title="Completed" value={completedFields} icon={CheckCircle2}  variant="slate" />
      </div>

      {isAdmin && (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          <StatsCard title="Field Agents" value={agentCount} icon={Users} variant="default" />
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* At-risk fields */}
        {atRiskList.length > 0 && (
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-display font-semibold text-lg text-emerald-950 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-amber-500" />
                Needs Attention
              </h3>
              <Button variant="ghost" size="sm" asChild className="text-emerald-700">
                <Link href="/fields?status=at_risk" className="gap-1">View all <ArrowRight className="w-3.5 h-3.5" /></Link>
              </Button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {atRiskList.map(field => (
                <FieldCard key={field.id} field={field} showAgent={isAdmin} />
              ))}
            </div>
          </div>
        )}

        {/* Recent activity */}
        <div className="space-y-4">
          <h3 className="font-display font-semibold text-lg text-emerald-950 flex items-center gap-2">
            <Clock className="w-5 h-5 text-emerald-600" />
            Recent Activity
          </h3>
          <Card>
            <CardContent className="p-0 divide-y divide-border">
              {(recentUpdates ?? []).length === 0 ? (
                <p className="text-sm text-muted-foreground p-4 text-center">No updates yet.</p>
              ) : (
                (recentUpdates as FieldUpdate[]).map(u => (
                  <div key={u.id} className="p-3 hover:bg-muted/40 transition-colors">
                    <p className="text-sm font-medium text-foreground truncate">
                      {(u.field as any)?.name ?? 'Unknown field'}
                    </p>
                    <p className="text-xs text-muted-foreground line-clamp-2 mt-0.5">{u.notes}</p>
                    <p className="text-xs text-muted-foreground/60 mt-1">
                      {formatDistanceToNow(new Date(u.created_at), { addSuffix: true })}
                    </p>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* All fields grid */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-display font-semibold text-lg text-emerald-950">
            {isAdmin ? 'All Fields' : 'My Fields'}
          </h3>
          <Button variant="ghost" size="sm" asChild className="text-emerald-700">
            <Link href="/fields" className="gap-1">See all <ArrowRight className="w-3.5 h-3.5" /></Link>
          </Button>
        </div>
        {fields.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Rows3 className="w-10 h-10 text-muted-foreground/30 mx-auto mb-3" />
              <p className="text-muted-foreground">
                {isAdmin ? 'No fields yet. Create your first field.' : 'No fields assigned to you yet.'}
              </p>
              {isAdmin && (
                <Button asChild className="mt-4 bg-emerald-600 hover:bg-emerald-700 text-white gap-2">
                  <Link href="/fields/new"><Plus className="w-4 h-4" /> Create Field</Link>
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {fields.slice(0, 8).map(field => (
              <FieldCard key={field.id} field={field} showAgent={isAdmin} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function getGreeting() {
  const h = new Date().getHours()
  if (h < 12) return 'morning'
  if (h < 17) return 'afternoon'
  return 'evening'
}