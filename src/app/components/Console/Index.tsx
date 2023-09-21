'use client'

import { useState } from 'react'
import { PanInfo, Variants, motion } from 'framer-motion'

const consoleAnimations: Variants = {
  closed: {
    y: 250,
  },
  open: {
    y: 0,
  },
}

interface ConsoleProps {
  result: string
}

export function Console({ result }: ConsoleProps) {
  const [isOpen, setIsOpen] = useState(true)

  function handleDragEnd(_: any, info: PanInfo) {
    if (info.offset.y >= 100) {
      setIsOpen(false)
    }
  }

  return (
    <motion.div
      variants={consoleAnimations}
      initial="closed"
      animate={isOpen ? "open" : "closed"}
      drag="y"
      dragConstraints={{ top: 10, bottom: 0 }}
      dragElastic={0.8}
      dragMomentum={false}
      onDragEnd={handleDragEnd}
      className="absolute -bottom-4 bg-gray-700 rounded-t-lg w-full min-h-[12rem]"
    >
      <div className="p-3 border-b border-gray-400">
        <strong className="text-gray-200">Resultado</strong>
      </div>
      <div className="p-3 text-gray-300">{result}</div>
    </motion.div>
  )
}
