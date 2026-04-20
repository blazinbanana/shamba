'use client'

import { usePathname, useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'
import {
  LayoutDashboard, Rows3, Users, UserCircle,
  LogOut, Sprout, ChevronRight,
} from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import type { Profile } from '@/lib/types'
import { cn } from '@/lib/utils'

interface Props { profile: Profile }

const adminNav = [
  { href: '/dashboard', label: 'Dashboard',  icon: LayoutDashboard },
  { href: '/fields',    label: 'All Fields', icon: Rows3 },
  { href: '/agents',    label: 'Agents',     icon: Users },
  { href: '/profile',   label: 'Profile',    icon: UserCircle },
]

const agentNav = [
  { href: '/dashboard', label: 'Dashboard',   icon: LayoutDashboard },
  { href: '/fields',    label: 'My Fields',   icon: Rows3 },
  { href: '/profile',   label: 'Profile',     icon: UserCircle },
]

export default function Sidebar({ profile }: Props) {
  const pathname = usePathname()
  const router   = useRouter()
  const supabase = createClient()
  const nav      = profile.role === 'admin' ? adminNav : agentNav

  const initials = profile.full_name
    ? profile.full_name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : profile.email[0].toUpperCase()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    toast.success('Signed out successfully')
    router.push('/login')
    router.refresh()
  }

  return (
    <aside className="w-64 hidden lg:flex flex-col sidebar-gradient text-white shrink-0">
      {/* Logo */}
      <div className="px-6 py-6 flex items-center gap-3 border-b border-white/10">
        <div className="w-9 h-9 bg-white/15 backdrop-blur rounded-xl flex items-center justify-center shrink-0">
          <Sprout className="w-5 h-5 text-emerald-200" />
        </div>
        <div>
          <div className="font-display font-bold text-lg leading-tight tracking-wide">SHAMBA</div>
          <div className="text-emerald-300/70 text-xs capitalize">{profile.role.replace('_', ' ')}</div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-4 py-6 space-y-1">
        {nav.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || (href !== '/dashboard' && pathname.startsWith(href))
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all group',
                active
                  ? 'bg-white/15 text-white'
                  : 'text-emerald-200/70 hover:bg-white/10 hover:text-white'
              )}
            >
              <Icon className={cn('w-4.5 h-4.5 shrink-0', active ? 'text-emerald-300' : 'text-emerald-400/60 group-hover:text-emerald-300')} />
              <span>{label}</span>
              {active && <ChevronRight className="w-3.5 h-3.5 ml-auto text-emerald-300/60" />}
            </Link>
          )
        })}
      </nav>

      {/* User footer */}
      <div className="p-4 border-t border-white/10">
        <div className="flex items-center gap-3 px-2 py-2 rounded-xl mb-2">
          <Avatar className="w-9 h-9 border-2 border-white/20">
            <AvatarImage src={profile.avatar_url ?? ''} alt={profile.full_name ?? ''} />
            <AvatarFallback className="bg-emerald-700 text-white text-xs font-bold">{initials}</AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium text-white truncate">{profile.full_name ?? 'User'}</div>
            <div className="text-xs text-emerald-300/60 truncate">{profile.email}</div>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm text-emerald-300/70 hover:bg-white/10 hover:text-white transition-all font-medium"
        >
          <LogOut className="w-4 h-4" />
          Sign out
        </button>
      </div>
    </aside>
  )
}