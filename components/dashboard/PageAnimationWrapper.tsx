'use client'

import { motion } from 'framer-motion'
import { ReactNode } from 'react'

const pageContainer = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1
    }
  }
}

const pageItem = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: "easeOut"
    }
  }
}

interface PageAnimationWrapperProps {
  children: ReactNode
}

export function PageAnimationWrapper({ children }: PageAnimationWrapperProps) {
  return (
    <motion.div
      initial="hidden"
      animate="show"
      variants={pageContainer}
      className="space-y-8"
    >
      {children}
    </motion.div>
  )
}

export function AnimatedHeader({ children }: { children: ReactNode }) {
  return (
    <motion.div
      variants={pageItem}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {children}
    </motion.div>
  )
}

export function AnimatedSection({ children, delay = 0 }: { children: ReactNode; delay?: number }) {
  return (
    <motion.div
      variants={pageItem}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
    >
      {children}
    </motion.div>
  )
}

export function AnimatedGrid({ children }: { children: ReactNode }) {
  return (
    <motion.div
      variants={pageContainer}
      initial="hidden"
      animate="show"
      className="grid gap-5 md:grid-cols-2 lg:grid-cols-3"
    >
      {children}
    </motion.div>
  )
}

export function AnimatedCard({ children, index = 0 }: { children: ReactNode; index?: number }) {
  return (
    <motion.div
      variants={pageItem}
      whileHover={{ scale: 1.02, y: -5 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      {children}
    </motion.div>
  )
}

export function AnimatedStatsGrid({ children }: { children: ReactNode }) {
  return (
    <motion.div
      variants={pageContainer}
      initial="hidden"
      animate="show"
      className="grid gap-6 md:grid-cols-2 lg:grid-cols-4"
    >
      {children}
    </motion.div>
  )
}
