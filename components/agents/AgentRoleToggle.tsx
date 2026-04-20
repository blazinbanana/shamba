'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Loader2 } from 'lucide-react'
import type { UserRole } from '@/lib/types'

interface Props {
  agentId: string
  currentRole: UserRole
}

export default function AgentRoleToggle({ agentId, currentRole }: Props) {
  const [loading, setLoading] = useState(false)
  const router   = useRouter()
  const supabase = createClient()

  const toggle = async () => {
    const newRole = currentRole === 'admin' ? 'field_agent' : 'admin'
    if (!confirm(`Change this user's role to ${newRole.replace('_', ' ')}?`)) return
    setLoading(true)
    try {
      const { error } = await supabase.from('profiles').update({ role: newRole }).eq('id', agentId)
      if (error) throw error
      toast.success(`Role updated to ${newRole.replace('_', ' ')}`)
      router.refresh()
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Failed to update role')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggle}
      disabled={loading}
      className="text-xs text-muted-foreground hover:text-foreground"
    >
      {loading ? <Loader2 className="w-3 h-3 animate-spin" /> : (
        currentRole === 'admin' ? 'Make Agent' : 'Make Admin'
      )}
    </Button>
  )
}