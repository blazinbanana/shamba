'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { toast } from 'sonner'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Loader2, Sprout, Eye, EyeOff } from 'lucide-react'

interface Props { mode: 'login' | 'signup' }

export default function AuthForm({ mode }: Props) {
  const router   = useRouter()
  const supabase = createClient()
  const [loading, setLoading]             = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)
  const [showPassword, setShowPassword]   = useState(false)
  const [form, setForm] = useState({ name: '', email: '', password: '' })

  const set = (key: string, val: string) => setForm(f => ({ ...f, [key]: val }))

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      if (mode === 'login') {
        const { error } = await supabase.auth.signInWithPassword({
          email: form.email,
          password: form.password,
        })
        if (error) throw error
        router.push('/dashboard')
        router.refresh()
      } else {
        const { data, error } = await supabase.auth.signUp({
          email: form.email,
          password: form.password,
          options: { data: { full_name: form.name } },
        })
        if (error) throw error

        // Create a bare profile — role will be chosen on onboarding
        if (data.user) {
          await supabase.from('profiles').upsert({
            id:            data.user.id,
            email:         form.email,
            full_name:     form.name,
            role:          'field_agent', // safe default, overwritten on onboarding
            role_selected: false,
          }, { onConflict: 'id' })
        }

        // Same flow as Google — go pick your role at onboarding as opposed to assigning using dropdown
        toast.success('Account created! Choose your role to continue.')
        router.push('/onboarding')
        router.refresh()
      }
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  const handleGoogle = async () => {
    setGoogleLoading(true)
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    })
    if (error) {
      toast.error(error.message)
      setGoogleLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1200&q=80"
          alt="Aerial view of agricultural fields"
          fill className="object-cover" priority unoptimized
        />
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/80 via-emerald-800/60 to-emerald-950/70" />
        <div className="relative z-10 flex flex-col justify-between p-12 text-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 backdrop-blur rounded-xl flex items-center justify-center">
              <Sprout className="w-6 h-6 text-white" />
            </div>
            <span className="font-display text-2xl font-bold tracking-wide">SHAMBA</span>
          </div>
          <div>
            <h1 className="font-display text-5xl font-bold leading-tight mb-4">
              Track every<br />
              <span className="text-emerald-300">growing season</span><br />
              seamlessly
            </h1>
            <p className="text-emerald-100/80 text-lg leading-relaxed max-w-sm mb-8">
              Real-time visibility into your fields — from planting day through to harvest.
            </p>
            
            {/* Refined horizontal list with dots */}
            <div className="flex flex-wrap items-center gap-4 text-sm text-white">
              {['track growth', 'derisking', 'align teams'].map((label, index, array) => (
                <div key={label} className="flex items-center gap-4">
                  <span className="font-medium tracking-wide">{label}</span>
                  
                  {/* The dot separator */}
                  {index !== array.length - 1 && (
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-400/80" />
                  )}
                </div>
              ))}
            </div>
            
          </div>
        </div>
      </div>
      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-8 bg-gradient-to-br from-emerald-50/50 to-white">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="flex items-center gap-2 mb-8 lg:hidden">
            <div className="w-9 h-9 bg-emerald-600 rounded-xl flex items-center justify-center">
              <Sprout className="w-5 h-5 text-white" />
            </div>
            <span className="font-display text-xl font-bold text-emerald-900">SHAMBA</span>
          </div>

          <h2 className="font-display text-3xl font-bold text-emerald-950 mb-2">
            {mode === 'login' ? 'Welcome back' : 'Create account'}
          </h2>
          <p className="text-muted-foreground mb-8">
            {mode === 'login'
              ? 'Sign in to monitor your fields.'
              : 'Start tracking your crop progress today.'}
          </p>

          {/* Google */}
          <Button
            variant="outline"
            className="w-full h-11 border-2 font-medium gap-3 mb-6"
            onClick={handleGoogle}
            disabled={googleLoading}
          >
            {googleLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : (
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
            )}
            Continue with Google
          </Button>

          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-3 text-muted-foreground font-medium">or</span>
            </div>
          </div>

          <form onSubmit={handleEmailAuth} className="space-y-4">
            {mode === 'signup' && (
              <div className="space-y-1.5">
                <Label htmlFor="name">Full name</Label>
                <Input
                  id="name" placeholder="Jane Kimani"
                  value={form.name} onChange={e => set('name', e.target.value)}
                  required className="h-11"
                />
              </div>
            )}

            <div className="space-y-1.5">
              <Label htmlFor="email">Email address</Label>
              <Input
                id="email" type="email" placeholder="jane@shamba.co"
                value={form.email} onChange={e => set('email', e.target.value)}
                required className="h-11"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={form.password}
                  onChange={e => set('password', e.target.value)}
                  required minLength={6} className="h-11 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(s => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full h-11 bg-emerald-600 hover:bg-emerald-700 text-white font-medium mt-2"
              disabled={loading}
            >
              {loading
                ? <Loader2 className="w-4 h-4 animate-spin" />
                : mode === 'login' ? 'Sign in' : 'Create account'}
            </Button>
          </form>

          <p className="text-center text-sm text-muted-foreground mt-6">
            {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
            <Link
              href={mode === 'login' ? '/signup' : '/login'}
              className="text-emerald-700 font-medium hover:underline"
            >
              {mode === 'login' ? 'Sign up' : 'Sign in'}
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}