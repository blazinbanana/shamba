'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, Rows3, Users, UserCircle } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { Profile } from '@/lib/types'

interface Props { profile: Profile }

export default function BottomNav({ profile }: Props) {
  const pathname = usePathname()

  const nav = [
    { href: '/dashboard', label: 'Home',   icon: LayoutDashboard },
    { href: '/fields',    label: 'Fields', icon: Rows3 },
    ...(profile.role === 'admin' ? [{ href: '/agents', label: 'Agents', icon: Users }] : []),
    { href: '/profile',   label: 'Profile', icon: UserCircle },
  ]

  return (
    <nav className="lg:hidden fixed bottom-0 inset-x-0 bg-white border-t border-border z-50 pb-safe">
      <div className="flex items-stretch">
        {nav.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || (href !== '/dashboard' && pathname.startsWith(href))
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex-1 flex flex-col items-center justify-center gap-0.5 py-3 text-xs font-medium transition-colors',
                active ? 'text-emerald-700' : 'text-muted-foreground'
              )}
            >
              <Icon className={cn('w-5 h-5', active ? 'text-emerald-600' : '')} />
              <span>{label}</span>
              {active && <span className="w-1 h-1 rounded-full bg-emerald-500 mt-0.5" />}
            </Link>
          )
        })}
      </div>
    </nav>
  )
}