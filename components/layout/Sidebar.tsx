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
    <div className="hidden md:flex flex-col w-64 border-r bg-card/50 backdrop-blur-sm">
      <div className="px-6 py-8 border-b">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Calculator className="h-6 w-6 text-primary" />
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
            GPA Tracker
          </span>
        </div>
      </div>

      <nav className="flex-1 px-4 py-6 space-y-1.5">
        {routes.map((route) => {
          // For dashboard, only match exact path. For others, match path and subpaths
          const isActive = route.href === '/dashboard'
            ? pathname === route.href
            : pathname === route.href || pathname?.startsWith(route.href + '/')

          return (
            <Link key={route.href} href={route.href}>
              <Button
                variant={isActive ? 'secondary' : 'ghost'}
                className={cn(
                  'w-full justify-start h-11 px-4 mb-1 transition-all duration-200',
                  isActive && 'bg-primary/10 text-primary font-semibold shadow-sm hover:bg-primary/15',
                  !isActive && 'hover:bg-accent/50 hover:translate-x-1'
                )}
              >
                <route.icon className={cn(
                  'mr-3 h-5 w-5',
                  isActive && 'text-primary'
                )} />
                {route.label}
              </Button>
            </Link>
          )
        })}
      </nav>

      <div className="p-6 border-t mt-auto">
        <div className="bg-gradient-to-br from-primary/20 via-purple-500/20 to-blue-500/20 rounded-xl p-5 shadow-sm">
          <p className="text-sm font-semibold mb-2 text-foreground">Track Your Success</p>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Monitor your academic performance with detailed analytics and insights
          </p>
        </div>
      </div>
    </div>
  )
}
