// Copyright 2026 Caleb Maina
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { createClient } from '@/lib/supabase/client'
import { validateAdminCode } from '@/lib/admin-codes'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Loader2, Sprout, ClipboardList, Leaf, KeyRound, ShieldCheck, LucideSprout} from 'lucide-react'
import { cn } from '@/lib/utils'

type Role = 'admin' | 'field_agent'

const ROLES: { value: Role; icon: typeof Leaf; label: string; description: string }[] = [
  {
    value: 'admin',
    icon: ClipboardList,
    label: 'Admin / Coordinator',
    description: 'Create and manage fields, assign agents, and monitor all progress. Requires the admin code.',
  },
  {
    value: 'field_agent',
    icon: Leaf,
    label: 'Field Agent',
    description: 'Work on the ground. Log updates and track stage changes on your assigned fields.',
  },
]

export default function OnboardingForm() {
  const router   = useRouter()
  const supabase = createClient()
  const [selected, setSelected]   = useState<Role | null>(null)
  const [adminCode, setAdminCode] = useState('')
  const [codeError, setCodeError] = useState('')
  const [loading, setLoading]     = useState(false)

  const handleConfirm = async () => {
    if (!selected) return
    setLoading(true)
    setCodeError('')

    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      if (selected === 'admin') {
        if (!adminCode.trim()) {
          setCodeError('The admin code is required.')
          setLoading(false)
          return
        }
        const result = await validateAdminCode(adminCode)
        if (!result.ok) {
          setCodeError(result.error ?? 'Invalid admin code.')
          setLoading(false)
          return
        }
      }

      const { error } = await supabase
        .from('profiles')
        .update({ role: selected, role_selected: true })
        .eq('id', user.id)

      if (error) throw error

      toast.success(`Welcome! You're set up as ${selected === 'admin' ? 'an Admin' : 'a Field Agent'}.`)
      router.push('/dashboard')
      router.refresh()
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-white flex items-center justify-center p-6">
      <div className="w-full max-w-lg">
        <div className="flex items-center gap-3 mb-10">
          <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center">
            <Sprout className="w-6 h-6 text-white" />
          </div>
          <span className="font-display text-2xl font-bold text-emerald-900">SHAMBA</span>
        </div>

        <h1 className="font-display text-3xl font-bold text-emerald-950 mb-2">
          One last step <LucideSprout/>
        </h1>
        <p className="text-muted-foreground mb-8">
          How will you be using SHAMBA? Choose your role to get started.
        </p>

        <div className="space-y-4 mb-6">
          {ROLES.map(({ value, icon: Icon, label, description }) => {
            const isSelected = selected === value
            const isAdmin    = value === 'admin'
            return (
              <button
                key={value}
                onClick={() => { setSelected(value); setCodeError('') }}
                className={cn(
                  'w-full text-left p-5 rounded-2xl border-2 transition-all duration-200',
                  isSelected
                    ? isAdmin
                      ? 'border-emerald-500 bg-emerald-50 shadow-md shadow-emerald-100'
                      : 'border-blue-500 bg-blue-50 shadow-md shadow-blue-100'
                    : 'border-border bg-white hover:border-emerald-200 hover:shadow-sm'
                )}
              >
                <div className="flex items-start gap-4">
                  <div className={cn(
                    'w-11 h-11 rounded-xl flex items-center justify-center shrink-0 mt-0.5',
                    isSelected
                      ? isAdmin ? 'bg-emerald-600 text-white' : 'bg-blue-600 text-white'
                      : 'bg-muted text-muted-foreground'
                  )}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className={cn(
                        'font-semibold text-base',
                        isSelected
                          ? isAdmin ? 'text-emerald-900' : 'text-blue-900'
                          : 'text-foreground'
                      )}>
                        {label}
                      </h3>
                      <div className={cn(
                        'w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0',
                        isSelected
                          ? isAdmin ? 'border-emerald-600' : 'border-blue-600'
                          : 'border-muted-foreground/30'
                      )}>
                        {isSelected && (
                          <div className={cn(
                            'w-2.5 h-2.5 rounded-full',
                            isAdmin ? 'bg-emerald-600' : 'bg-blue-600'
                          )} />
                        )}
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1 leading-relaxed">{description}</p>
                  </div>
                </div>
              </button>
            )
          })}
        </div>

        {/* Admin code */}
        <div className={cn(
          'overflow-hidden transition-all duration-300',
          selected === 'admin' ? 'max-h-40 opacity-100 mb-6' : 'max-h-0 opacity-0 mb-0'
        )}>
          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 space-y-2">
            <Label htmlFor="code" className="flex items-center gap-1.5 text-emerald-900">
              <KeyRound className="w-3.5 h-3.5" />
              Admin Code
            </Label>
            <div className="relative">
              <Input
                id="code"
                type="password"
                placeholder="Enter the admin code"
                value={adminCode}
                onChange={e => { setAdminCode(e.target.value); setCodeError('') }}
                className={cn(
                  'h-11 bg-white pr-10',
                  codeError ? 'border-red-400 focus-visible:ring-red-400' : 'border-emerald-200'
                )}
                autoComplete="off"
              />
              {adminCode && !codeError && (
                <ShieldCheck className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-500" />
              )}
            </div>
            {codeError
              ? <p className="text-xs text-red-600">{codeError}</p>
              : <p className="text-xs text-emerald-700/70">Ask an existing admin for the code.</p>
            }
          </div>
        </div>

        <Button
          onClick={handleConfirm}
          disabled={!selected || loading}
          className="w-full h-12 bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-base"
        >
          {loading
            ? <Loader2 className="w-5 h-5 animate-spin" />
            : 'Continue to Dashboard →'}
        </Button>

        <p className="text-center text-xs text-muted-foreground mt-4">
          You can contact your admin to change your role later.
        </p>
      </div>
    </div>
  )
}