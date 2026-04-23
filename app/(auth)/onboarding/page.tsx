// Copyright 2026 aleb Maina
import OnboardingForm from '@/components/auth/OnboardingForm'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function OnboardingPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  // this was for skipping this back when I had a dropdown for choosing role at sign up. It doesnt break anything so will keep it
  const { data: profile } = await supabase
    .from('profiles')
    .select('role_selected')
    .eq('id', user.id)
    .single()

  if (profile?.role_selected) redirect('/dashboard')

  return <OnboardingForm />
}