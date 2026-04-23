// Copyright 2026 Caleb Maina
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import ProfileForm from '@/components/profile/ProfileForm'
import type { Profile } from '@/lib/types'

export default async function ProfilePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single()
  if (!profile) redirect('/login')

  return (
    <div className="max-w-lg space-y-6">
      <div>
        <h2 className="font-display text-2xl font-bold text-emerald-950">Profile</h2>
        <p className="text-muted-foreground mt-1">Manage your account information.</p>
      </div>
      <ProfileForm profile={profile as Profile} />
    </div>
  )
}