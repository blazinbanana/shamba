// Copyright 2026 Caleb Maina
'use client'

import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuSeparator, DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { LogOut, UserCircle } from 'lucide-react'
import MobileSidebar from './MobileSidebar'
import type { Profile } from '@/lib/types'
import Link from 'next/link'

const PAGE_TITLES: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/fields':    'Fields',
  '/agents':    'Agents',
  '/profile':   'Profile',
}

interface Props { profile: Profile }

export default function Header({ profile }: Props) {
  const pathname = usePathname()
  const router   = useRouter()
  const supabase = createClient()

  const title = Object.entries(PAGE_TITLES)
    .find(([k]) => pathname === k || pathname.startsWith(k + '/'))
    ?.[1] ?? 'SHAMBA'

  const initials = profile.full_name
    ? profile.full_name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
    : profile.email[0].toUpperCase()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    toast.success('Signed out')
    router.push('/login')
    router.refresh()
  }

  return (
    <header className="h-16 bg-white border-b border-border px-4 sm:px-6 flex items-center justify-between shrink-0">
      <div className="flex items-center gap-3">
        {/* Mobile hamburger */}
        <MobileSidebar profile={profile} />
        {/* Page title */}
        <h1 className="font-display text-lg sm:text-xl font-bold text-emerald-950">{title}</h1>
      </div>

      <div className="flex items-center gap-2 sm:gap-4">
        <Badge
          variant="secondary"
          className={`hidden sm:inline-flex ${profile.role === 'admin'
            ? 'bg-emerald-100 text-emerald-800 border-emerald-200'
            : 'bg-blue-100 text-blue-800 border-blue-200'}`}
        >
          {profile.role === 'admin' ? 'Admin' : 'Field Agent'}
        </Badge>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="focus:outline-none">
              <Avatar className="w-9 h-9 cursor-pointer ring-2 ring-offset-2 ring-transparent hover:ring-emerald-400 transition-all">
                <AvatarImage src={profile.avatar_url ?? ''} />
                <AvatarFallback className="bg-emerald-600 text-white text-xs font-bold">{initials}</AvatarFallback>
              </Avatar>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <div className="px-3 py-2">
              <p className="text-sm font-medium truncate">{profile.full_name ?? 'User'}</p>
              <p className="text-xs text-muted-foreground truncate">{profile.email}</p>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/profile" className="cursor-pointer gap-2">
                <UserCircle className="w-4 h-4" /> Profile
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout} className="text-red-600 gap-2 cursor-pointer">
              <LogOut className="w-4 h-4" /> Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}