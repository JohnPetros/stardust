'use client'

import {
  ForwardedRef,
  forwardRef,
  useEffect,
  useImperativeHandle,
  useState,
} from 'react'
import { PanInfo, Variants, motion, useAnimation } from 'framer-motion'
import { CaretDown } from '@phosphor-icons/react'

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

  function handleDragEnd(_: any, info: PanInfo) {
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
      className="absolute -bottom-4 bg-gray-700 rounded-t-lg w-full min-h-[20rem] cursor-pointer"
    >
      <div className="px-6 py-3 border-b border-gray-400">
        <span className="block rounded-md mx-auto h-[2px] bg-gray-400 w-1/6"></span>
        <div className="mt-1 flex items-center justify-between">
          <strong className="text-gray-200">Resultado</strong>
          <button onClick={close}>
            <CaretDown className="text-lg text-gray-400" weight="bold" />
          </button>
        </div>
      </div>

      <ul className="px-6 py-3">
        {outputs.map((output, index) => (
          <li key={`result-${index}`} className="block text-gray-300 text-sm">
            {output}
          </li>
        ))}
      </ul>
    </motion.div>
  )
}

export const Console = forwardRef(ConsoleComponent)
