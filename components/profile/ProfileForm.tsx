// Copyright 2026 Caleb Maina
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Loader2, Save } from 'lucide-react'
import type { Profile } from '@/lib/types'

interface Props { profile: Profile }

export default function ProfileForm({ profile }: Props) {
  const [loading, setLoading] = useState(false)
  const [name, setName]       = useState(profile.full_name ?? '')
  const router   = useRouter()
  const supabase = createClient()

  const initials = profile.full_name
    ? profile.full_name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
    : profile.email[0].toUpperCase()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ full_name: name.trim() })
        .eq('id', profile.id)
      if (error) throw error
      toast.success('Profile updated!')
      router.refresh()
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Failed to update profile')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-5">
      {/* Avatar card */}
      <Card>
        <CardContent className="p-6 flex items-center gap-5">
          <Avatar className="w-20 h-20 border-4 border-emerald-100">
            <AvatarImage src={profile.avatar_url ?? ''} />
            <AvatarFallback className="bg-emerald-600 text-white text-2xl font-bold font-display">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-display font-semibold text-lg text-emerald-950">{profile.full_name ?? '—'}</h3>
            <p className="text-muted-foreground text-sm">{profile.email}</p>
            <Badge
              className={`mt-2 text-xs ${profile.role === 'admin'
                ? 'bg-emerald-100 text-emerald-700'
                : 'bg-blue-100 text-blue-700'}`}
            >
              {profile.role === 'admin' ? 'Admin' : 'Field Agent'}
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Edit form */}
      <Card>
        <CardHeader><CardTitle className="font-display text-base text-emerald-950">Edit Information</CardTitle></CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <Label>Full Name</Label>
              <Input
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Your name"
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label>Email</Label>
              <Input value={profile.email} disabled className="bg-muted/50" />
              <p className="text-xs text-muted-foreground">Email cannot be changed here.</p>
            </div>
            <Button
              type="submit"
              disabled={loading}
              className="bg-emerald-600 hover:bg-emerald-700 text-white gap-2"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              Save Changes
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}