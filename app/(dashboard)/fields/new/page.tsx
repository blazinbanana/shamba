import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import FieldForm from '@/components/fields/FieldForm'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'
import type { Profile } from '@/lib/types'

export default async function NewFieldPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single()
  if (profile?.role !== 'admin') redirect('/fields')

  const { data: agents } = await supabase
    .from('profiles').select('*').eq('role', 'field_agent').order('full_name')

  return (
    <div className="space-y-6">
      <div>
        <Button variant="ghost" asChild className="gap-1 text-muted-foreground -ml-2 mb-2">
          <Link href="/fields"><ChevronLeft className="w-4 h-4" /> Back to Fields</Link>
        </Button>
        <h2 className="font-display text-2xl font-bold text-emerald-950">Create New Field</h2>
        <p className="text-muted-foreground mt-1">Set up a new field for the growing season.</p>
      </div>
      <FieldForm agents={(agents ?? []) as Profile[]} adminId={user.id} />
    </div>
  )
}