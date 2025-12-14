'use client'

import { Button } from '@/components/ui/button'
import { LogOut, User, Settings } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import Link from 'next/link'
import type { User as SupabaseUser } from '@supabase/supabase-js'

interface HeaderProps {
  user: SupabaseUser
}

export default function Header({ user }: HeaderProps) {
  const router = useRouter()

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    toast.success('Logged out successfully')
    router.push('/login')
  }

  return (
    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-10">
      <div className="flex h-16 items-center px-6 justify-between">
        <div>
          <h2 className="text-xl font-semibold">CGPA Calculator</h2>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-sm">
            <User className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">{user.email}</span>
          </div>

          <Link href="/dashboard/settings">
            <Button variant="ghost" size="icon">
              <Settings className="h-4 w-4" />
            </Button>
          </Link>

          <Button variant="ghost" size="icon" onClick={handleLogout}>
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </header>
  )
}
