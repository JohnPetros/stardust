'use client'

import { ForwardedRef, forwardRef, useImperativeHandle } from 'react'
import { CaretDown } from '@phosphor-icons/react'
import { motion, Variants } from 'framer-motion'

import { useConsole } from './useConsole'

const consoleAnimations: Variants = {
  closed: {
    y: '100%',
  },
  open: {
    y: '40%',
  },
}

export type ConsoleProps = {
  results: string[]
  height: number
}

export type ConsoleRef = {
  open: VoidFunction
  close: VoidFunction
}

export function ConsoleComponent(
  { results, height }: ConsoleProps,
  ref: ForwardedRef<ConsoleRef>
) {
  const {
    output,
    animationControls,
    open,
    close,
    calculateMinHeight,
    handleDragEnd,
  } = useConsole({ results, height })

  useImperativeHandle(
    ref,
    () => {
      return {
        open,
        close,
      }
    },
    [open, close]
  )

  return (
    <motion.div
      variants={consoleAnimations}
      animate={animationControls}
      initial="closed"
      drag="y"
      dragConstraints={{ top: 0 }}
      dragElastic={0}
      dragMomentum={false}
      onDragEnd={handleDragEnd}
      style={{ minHeight: calculateMinHeight() }}
      className={`absolute -bottom-4  w-full cursor-pointer rounded-t-lg bg-gray-700`}
    >
      <div className="border-b border-gray-400 px-6 py-2">
        <span className="mx-auto block h-[2px] w-1/6 rounded-md bg-gray-400"></span>
        <div className="mt-1 flex items-center justify-between">
          <strong className="text-gray-200">Resultado</strong>
          <button onClick={close}>
            <CaretDown className="text-lg text-gray-400" weight="bold" />
          </button>
        </div>
      </div>

      <ul className="px-6 py-2">
        {output.map((output, index) => (
          <li key={`result-${index}`} className="block text-sm text-gray-300">
            {output}
          </li>
        ))}
      </ul>
    </motion.div>
  )
}

export const Console = forwardRef(ConsoleComponent)
