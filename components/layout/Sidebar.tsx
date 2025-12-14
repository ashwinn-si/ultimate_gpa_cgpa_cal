'use client'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Home, BarChart3, Settings, BookOpen, Calculator } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const routes = [
  {
    label: 'Dashboard',
    icon: Home,
    href: '/dashboard',
  },
  {
    label: 'Semesters',
    icon: BookOpen,
    href: '/dashboard/semesters',
  },
  {
    label: 'Analytics',
    icon: BarChart3,
    href: '/dashboard/analytics',
  },
  {
    label: 'Settings',
    icon: Settings,
    href: '/dashboard/settings',
  },
]

export default function Sidebar() {
  const pathname = usePathname()

  return (
    <div className="hidden md:flex flex-col w-64 border-r bg-card">
      <div className="p-6 border-b">
        <div className="flex items-center gap-2">
          <Calculator className="h-6 w-6 text-primary" />
          <span className="text-xl font-bold">GPA Tracker</span>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {routes.map((route) => {
          const isActive = pathname === route.href || pathname?.startsWith(route.href + '/')

          return (
            <Link key={route.href} href={route.href}>
              <Button
                variant={isActive ? 'secondary' : 'ghost'}
                className={cn(
                  'w-full justify-start',
                  isActive && 'bg-secondary font-medium'
                )}
              >
                <route.icon className="mr-2 h-4 w-4" />
                {route.label}
              </Button>
            </Link>
          )
        })}
      </nav>

      <div className="p-4 border-t">
        <div className="bg-gradient-to-r from-primary/20 to-purple-500/20 rounded-lg p-4">
          <p className="text-sm font-medium mb-2">Track Your Success</p>
          <p className="text-xs text-muted-foreground mb-3">
            Monitor your academic performance with detailed analytics
          </p>
        </div>
      </div>
    </div>
  )
}
