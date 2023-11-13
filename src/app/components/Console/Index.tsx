'use client'

import {
  ForwardedRef,
  forwardRef,
  useEffect,
  useImperativeHandle,
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
}

export interface ConsoleRef {
  open: VoidFunction
  close: VoidFunction
}

export function ConsoleComponent(
  { results }: ConsoleProps,
  ref: ForwardedRef<ConsoleRef>
) {
  const [outputs, setOutputs] = useState<string[]>([])
  const controls = useAnimation()

  function open() {
    controls.start('open')
  }

  function close() {
    controls.start('closed')
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
    []
  )

  useEffect(() => {
    setOutputs([])
    if (!results.length) return

    const outputs = results.filter((_, index) => index % 2 !== 0)

    setOutputs(outputs)
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
      className="absolute -bottom-4 min-h-[20rem] w-full cursor-pointer rounded-t-lg bg-gray-700"
    >
      <div className="border-b border-gray-400 px-6 py-3">
        <span className="mx-auto block h-[2px] w-1/6 rounded-md bg-gray-400"></span>
        <div className="mt-1 flex items-center justify-between">
          <strong className="text-gray-200">Resultado</strong>
          <button onClick={close}>
            <CaretDown className="text-lg text-gray-400" weight="bold" />
          </button>
        </div>
      </div>

      <ul className="px-6 py-3">
        {outputs.map((output, index) => (
          <li key={`result-${index}`} className="block text-sm text-gray-300">
            {output}
          </li>
        ))}
      </ul>
    </motion.div>
  )
}

export const Console = forwardRef(ConsoleComponent)
