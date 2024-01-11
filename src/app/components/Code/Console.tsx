'use client'

import {
  ForwardedRef,
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react'
import { CaretDown } from '@phosphor-icons/react'
import { motion, PanInfo, useAnimation, Variants } from 'framer-motion'

const consoleAnimations: Variants = {
  closed: {
    y: '100%',
  },
  open: {
    y: '40%',
  },
}

interface ConsoleProps {
  results: string[]
  height: number
}

export interface ConsoleRef {
  open: VoidFunction
  close: VoidFunction
}

export function ConsoleComponent(
  { results, height }: ConsoleProps,
  ref: ForwardedRef<ConsoleRef>
) {
  const [output, setOutput] = useState<string[]>([])
  const types = useRef<string[]>([])
  const controls = useAnimation()

  function calculateMinHeight() {
    return ((height + 100) / 10) * 0.4 + 'rem' // 40% of the full height
  }

  const open = useCallback(() => {
    controls.start('open')
  }, [controls])

  const close = useCallback(() => {
    controls.start('closed')
  }, [controls])

  function formatOutput(output: string, index: number) {
    switch (types.current[index].trim()) {
      case 'textoo':
        return "'" + output + "'"
      case 'vetor':
        return '[ ' + output.split(',').join(', ') + ' ]'
      default:
        return output
    }
  }

  function handleDragEnd(_: unknown, info: PanInfo) {
    if (info.velocity.y > 20 && info.offset.y >= 50) {
      close()
    }
  }

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

  useEffect(() => {
    setOutput([])
    if (!results.length) return

    types.current = results.filter((_, index) => index % 2 === 0)
    const output = results.filter((_, index) => index % 2 !== 0)

    setOutput(output.map((output, index) => formatOutput(output.trim(), index)))
  }, [results])

  return (
    <motion.div
      variants={consoleAnimations}
      initial="closed"
      animate={controls}
      drag="y"
      dragConstraints={{ top: 0 }}
      dragElastic={0.4}
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
