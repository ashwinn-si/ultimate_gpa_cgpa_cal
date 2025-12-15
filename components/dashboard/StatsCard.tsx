'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import * as Icons from 'lucide-react'
import { LucideIcon } from 'lucide-react'
import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'

interface StatsCardProps {
  title: string
  value: string | number
  description?: string
  icon?: LucideIcon
  iconName?: string
  trend?: {
    value: number
    isPositive: boolean
  }
  className?: string
}

export function StatsCard({
  title,
  value,
  description,
  icon: Icon,
  iconName,
  trend,
  className,
}: StatsCardProps) {
  const [displayValue, setDisplayValue] = useState(0)
  const numericValue = typeof value === 'number' ? value : parseFloat(value.toString())

  // If iconName is provided, dynamically get the icon component
  const DynamicIcon = iconName ? (Icons[iconName as keyof typeof Icons] as LucideIcon) : Icon

  // Animate counter for numeric values
  useEffect(() => {
    if (typeof value === 'number' || !isNaN(numericValue)) {
      const duration = 1000 // 1 second
      const steps = 30
      const increment = numericValue / steps
      let currentStep = 0

      const timer = setInterval(() => {
        currentStep++
        if (currentStep <= steps) {
          setDisplayValue(increment * currentStep)
        } else {
          setDisplayValue(numericValue)
          clearInterval(timer)
        }
      }, duration / steps)

      return () => clearInterval(timer)
    }
  }, [value, numericValue])

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      whileHover={{ y: -5, scale: 1.02 }}
    >
      <Card className={className}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">{title}</CardTitle>
          {DynamicIcon && (
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.2, type: "spring" }}
            >
              <DynamicIcon className="h-4 w-4 text-muted-foreground" />
            </motion.div>
          )}
        </CardHeader>
        <CardContent>
          <motion.div
            className="text-2xl font-bold"
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.3, type: "spring" }}
          >
            {typeof value === 'number' || !isNaN(numericValue)
              ? displayValue.toFixed(typeof value === 'string' && value.includes('.') ? 1 : 0)
              : value}
          </motion.div>
          {description && (
            <motion.p
              className="text-xs text-muted-foreground mt-1"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              {description}
            </motion.p>
          )}
          {trend && (
            <motion.div
              className={`text-xs mt-2 ${trend.isPositive ? 'text-success' : 'text-error'}`}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
            >
              {trend.isPositive ? '↑' : '↓'} {Math.abs(trend.value)}%
            </motion.div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  )
}
