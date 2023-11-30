'use client'

import { motion, Variants } from 'framer-motion'
import Image from 'next/image'
import { twMerge } from 'tailwind-merge'

const colors = {
  bg: {
    green: 'bg-green-500',
    blue: 'bg-blue-300',
    red: 'bg-red-300',
    yellow: 'bg-yellow-300',
  },

  border: {
    green: 'border-green-500',
    blue: 'border-blue-300',
    red: 'border-red-300',
    yellow: 'border-yellow-300',
  },
}

interface MetricProps {
  title: string
  amount: number | string
  icon: string
  color: 'green' | 'blue' | 'red' | 'yellow'
  isLarge: boolean
  delay: number
}

export function Metric({
  title,
  amount,
  icon,
  color,
  isLarge,
  delay,
}: MetricProps) {
  const metricAniamtions: Variants = {
    down: {
      opacity: 0,
      y: 24,
    },
    up: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
        delay,
      },
    },
  }

  return (
    <motion.div
      variants={metricAniamtions}
      initial="down"
      animate="up"
      className={twMerge(
        'h-20 overflow-hidden rounded-md border',
        isLarge ? 'w-64' : 'w-32',
        colors.border[color]
      )}
    >
      <div
        className={twMerge('grid place-content-center p-1', colors.bg[color])}
      >
        <dt className="text-gray-900">{title}</dt>
      </div>
      <div className="flex items-center justify-center gap-2 pt-3">
        <Image src={`/icons/${icon}`} width={24} height={24} alt="" />
        <dd className="block text-lg font-medium text-gray-100">{amount}</dd>
      </div>
    </motion.div>
  )
}
