import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { Card, CardContent } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import AgentRoleToggle from '@/components/agents/AgentRoleToggle'
import { Users, Rows3 } from 'lucide-react'
import type { Profile } from '@/lib/types'

export default async function AgentsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  if (profile?.role !== 'admin') redirect('/dashboard')

  const { data: agents } = await supabase
    .from('profiles').select('*').eq('role', 'field_agent').order('full_name')

  const { data: admins } = await supabase
    .from('profiles').select('*').eq('role', 'admin').order('full_name')

  const { data: fieldCounts } = await supabase
    .from('fields').select('assigned_agent_id').not('assigned_agent_id', 'is', null)

  const countMap: Record<string, number> = {}
  ;(fieldCounts ?? []).forEach(f => {
    if (f.assigned_agent_id)
      countMap[f.assigned_agent_id] = (countMap[f.assigned_agent_id] ?? 0) + 1
  })

  return (
    <div className="space-y-10">
      <div>
        <h2 className="font-display text-2xl font-bold text-emerald-950">Team Management</h2>
        <p className="text-muted-foreground mt-1">Manage your field agents and coordinators.</p>
      </div>

      {/* Field Agents */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <h3 className="font-display font-semibold text-lg text-emerald-950">Field Agents</h3>
          <Badge variant="secondary" className="bg-emerald-100 text-emerald-700">
            {(agents ?? []).length}
          </Badge>
        </div>
        {(agents ?? []).length === 0 ? (
          <Card>
            <CardContent className="py-10 text-center text-muted-foreground">
              <Users className="w-8 h-8 mx-auto mb-2 opacity-30" />
              No field agents yet.
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {(agents as Profile[]).map(agent => {
              const initials = agent.full_name
                ? agent.full_name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
                : agent.email[0].toUpperCase()
              return (
                <Card key={agent.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-5">
                    <div className="flex items-center gap-3 mb-4">
                      <Avatar className="w-11 h-11">
                        <AvatarImage src={agent.avatar_url ?? ''} />
                        <AvatarFallback className="bg-emerald-100 text-emerald-700 font-bold text-sm">
                          {initials}
                        </AvatarFallback>
                      </Avatar>
                      <div className="min-w-0 flex-1">
                        <p className="font-semibold text-sm truncate">{agent.full_name ?? '—'}</p>
                        <p className="text-xs text-muted-foreground truncate">{agent.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                        <Rows3 className="w-4 h-4" />
                        <span>{countMap[agent.id] ?? 0} field{(countMap[agent.id] ?? 0) !== 1 ? 's' : ''}</span>
                      </div>
                      <AgentRoleToggle agentId={agent.id} currentRole="field_agent" />
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}
      </section>

      {/* Admins */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <h3 className="font-display font-semibold text-lg text-emerald-950">Admins</h3>
          <Badge variant="secondary">{(admins ?? []).length}</Badge>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {(admins as Profile[]).map(admin => {
            const initials = admin.full_name
              ? admin.full_name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
              : admin.email[0].toUpperCase()
            return (
              <Card key={admin.id}>
                <CardContent className="p-5">
                  <div className="flex items-center gap-3 mb-4">
                    <Avatar className="w-11 h-11">
                      <AvatarImage src={admin.avatar_url ?? ''} />
                      <AvatarFallback className="bg-blue-100 text-blue-700 font-bold text-sm">
                        {initials}
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold text-sm truncate">{admin.full_name ?? '—'}</p>
                      <p className="text-xs text-muted-foreground truncate">{admin.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200 text-xs">Admin</Badge>
                    {admin.id !== user.id && (
                      <AgentRoleToggle agentId={admin.id} currentRole="admin" />
                    )}
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </section>
    </div>
  )
}