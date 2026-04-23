// Copyright 2026 Caleb Maina
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import Sidebar from '@/components/layout/Sidebar'
import Header from '@/components/layout/Header'
import BottomNav from '@/components/layout/BottomNav'
import type { Profile } from '@/lib/types'

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles').select('*').eq('id', user.id).single()
  if (!profile) redirect('/login')

  return (
    <div className="flex h-screen overflow-hidden bg-[#f7f8f5]">
      {/* Desktop sidebar */}
      <Sidebar profile={profile as Profile} />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Header profile={profile as Profile} />
        {/* pb-20 on mobile so content isn't hidden behind bottom nav bar */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 pb-24 lg:pb-8">
          {children}
        </main>
      </div>

      {/* mobile bottom navigation */}
      <BottomNav profile={profile as Profile} />
    </div>
  )
}