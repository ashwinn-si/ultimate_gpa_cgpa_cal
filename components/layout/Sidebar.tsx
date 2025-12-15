'use client'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Home, BarChart3, Settings, BookOpen, Calculator, Heart } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'

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

const sidebarVariants = {
  hidden: { x: -100, opacity: 0 },
  visible: {
    x: 0,
    opacity: 1,
    transition: {
      duration: 0.3,
      staggerChildren: 0.1
    }
  }
}

const itemVariants = {
  hidden: { x: -20, opacity: 0 },
  visible: { x: 0, opacity: 1 }
}

export default function Sidebar() {
  const pathname = usePathname()

  return (
    <motion.div
      className="hidden md:flex flex-col w-64 border-r bg-card/50 backdrop-blur-sm"
      initial="hidden"
      animate="visible"
      variants={sidebarVariants}
    >
      <motion.div className="px-6 py-8 border-b" variants={itemVariants}>
        <motion.div
          className="flex items-center gap-3"
          whileHover={{ scale: 1.03 }}
          transition={{ type: "spring", stiffness: 400 }}
        >
          <motion.div
            className="p-2 bg-primary/10 rounded-lg"
            whileHover={{ rotate: 360 }}
            transition={{ duration: 0.6 }}
          >
            <Calculator className="h-6 w-6 text-primary" />
          </motion.div>
          <span className="text-xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
            GPA Tracker
          </span>
        </motion.div>
      </motion.div>

      <motion.nav className="flex-1 px-4 py-6 space-y-1.5" variants={itemVariants}>
        {routes.map((route, index) => {
          // For dashboard, only match exact path. For others, match path and subpaths
          const isActive = route.href === '/dashboard'
            ? pathname === route.href
            : pathname === route.href || pathname?.startsWith(route.href + '/')

          return (
            <motion.div
              key={route.href}
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ x: 5 }}
            >
              <Link href={route.href}>
                <Button
                  variant={isActive ? 'secondary' : 'ghost'}
                  className={cn(
                    'w-full justify-start h-11 px-4 mb-1 transition-all duration-200',
                    isActive && 'bg-primary/10 text-primary font-semibold shadow-sm hover:bg-primary/15',
                    !isActive && 'hover:bg-accent/50'
                  )}
                >
                  <motion.div
                    whileHover={{ scale: 1.2, rotate: 15 }}
                    transition={{ type: "spring", stiffness: 400 }}
                  >
                    <route.icon className={cn(
                      'mr-3 h-5 w-5',
                      isActive && 'text-primary'
                    )} />
                  </motion.div>
                  {route.label}
                </Button>
              </Link>
            </motion.div>
          )
        })}
      </motion.nav>

      <motion.div className="p-6 border-t mt-auto" variants={itemVariants}>
        <motion.div
          className="mt-4 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <a
            href="https://www.ashwinsi.in"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary transition-colors"
          >
            Made with <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 1.5 }}><Heart className="h-3 w-3 text-red-500 fill-red-500" /></motion.div> by Ashwin S I
          </a>
        </motion.div>
      </motion.div>
    </motion.div>
  )
}
