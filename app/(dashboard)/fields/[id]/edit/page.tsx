import { redirect, notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import FieldForm from '@/components/fields/FieldForm'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'
import type { Field, Profile } from '@/lib/types'

interface Props { params: Promise<{ id: string }> }

export default async function EditFieldPage({ params }: Props) {
  const { id }   = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  if (profile?.role !== 'admin') redirect(`/fields/${id}`)

  const { data: rawField } = await supabase
    .from('fields')
    .select('*, assigned_agent:profiles!fields_assigned_agent_id_fkey(*)')
    .eq('id', id)
    .single()
  if (!rawField) notFound()

  const { data: agents } = await supabase
    .from('profiles').select('*').eq('role', 'field_agent').order('full_name')

  return (
    <div className="space-y-6">
      <div>
        <Button variant="ghost" asChild className="gap-1 text-muted-foreground -ml-2 mb-2">
          <Link href={`/fields/${id}`}><ChevronLeft className="w-4 h-4" /> Back to Field</Link>
        </Button>
        <h2 className="font-display text-2xl font-bold text-emerald-950">Edit Field</h2>
        <p className="text-muted-foreground mt-1">{rawField.name}</p>
      </div>
      <FieldForm field={rawField as Field} agents={(agents ?? []) as Profile[]} adminId={user.id} />
    </div>
  )
}