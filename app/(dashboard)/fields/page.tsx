import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { withStatus } from '@/lib/field-utils'
import FieldCard from '@/components/fields/FieldCard'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Plus, Rows3 } from 'lucide-react'
import type { Field } from '@/lib/types'
import FieldsFilter from '@/components/fields/FieldsFilter'

interface Props {
  searchParams: Promise<{ stage?: string; status?: string; search?: string }>
}

export default async function FieldsPage({ searchParams }: Props) {
  const params   = await searchParams
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  const isAdmin = profile?.role === 'admin'

  let query = supabase
    .from('fields')
    .select('*, assigned_agent:profiles!fields_assigned_agent_id_fkey(*)')
    .order('created_at', { ascending: false })

  if (!isAdmin) query = query.eq('assigned_agent_id', user.id)
  if (params.stage) query = query.eq('current_stage', params.stage)

  const { data: rawFields } = await query
  let fields = (rawFields ?? []).map(f => withStatus(f as Field))

  if (params.status) fields = fields.filter(f => f.status === params.status)
  if (params.search) {
    const s = params.search.toLowerCase()
    fields = fields.filter(f =>
      f.name.toLowerCase().includes(s) ||
      f.crop_type.toLowerCase().includes(s) ||
      f.location?.toLowerCase().includes(s)
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display text-2xl font-bold text-emerald-950">
            {isAdmin ? 'All Fields' : 'My Fields'}
          </h2>
          <p className="text-muted-foreground mt-1">{fields.length} field{fields.length !== 1 ? 's' : ''}</p>
        </div>
        {isAdmin && (
          <Button asChild className="bg-emerald-600 hover:bg-emerald-700 text-white gap-2">
            <Link href="/fields/new"><Plus className="w-4 h-4" /> New Field</Link>
          </Button>
        )}
      </div>

      <FieldsFilter />

      {fields.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <Rows3 className="w-12 h-12 text-muted-foreground/30 mb-4" />
          <h3 className="font-display text-lg font-semibold text-muted-foreground">No fields found</h3>
          <p className="text-muted-foreground text-sm mt-1">Try adjusting your filters.</p>
          {isAdmin && (
            <Button asChild className="mt-6 bg-emerald-600 hover:bg-emerald-700 text-white gap-2">
              <Link href="/fields/new"><Plus className="w-4 h-4" /> Create your first field</Link>
            </Button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {fields.map(field => (
            <FieldCard key={field.id} field={field} showAgent={isAdmin} />
          ))}
        </div>
      )}
    </div>
  )
}