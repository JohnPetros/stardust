'use client'

import { CaretDown, ToggleLeft, ToggleRight } from '@phosphor-icons/react'
import { Variants, motion } from 'framer-motion'
import { ForwardedRef, forwardRef, useImperativeHandle } from 'react'

import { Tooltip } from '../Tooltip'

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
  output: string[]
  height: number
}

export type ConsoleRef = {
  open: VoidFunction
  close: VoidFunction
}

export function ConsoleComponent(
  { output, height }: ConsoleProps,
  ref: ForwardedRef<ConsoleRef>
) {
  const {
    isOpen,
    animationControls,
    shouldFormatOutput,
    open,
    close,
    calculateMinHeight,
    handleDragEnd,
    handleToggleFormatOutput,
  } = useConsole(height)

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

  console.log({ output })

  return (
    <motion.div
      variants={consoleAnimations}
      animate={animationControls}
      initial='closed'
      drag='y'
      dragConstraints={{ top: 0 }}
      dragElastic={0}
      dragMomentum={false}
      onDragEnd={handleDragEnd}
      style={{ minHeight: calculateMinHeight() }}
      className='absolute -bottom-4 w-full cursor-pointer rounded-t-lg bg-gray-700'
    >
      <div className='border-b border-gray-400 px-6 py-2'>
        <span className='mx-auto block h-[2px] w-1/6 rounded-md bg-gray-400' />
        <div className='mt-1 flex items-center justify-between'>
          <div className='flex items-center gap-3'>
            <strong className='text-gray-200'>Resultado</strong>
          </div>
          <Tooltip direction='bottom' content='Fechar console'>
            <button type='button' onClick={close} tabIndex={isOpen ? undefined : -1}>
              <CaretDown className='text-lg text-gray-400' weight='bold' />
            </button>
          </Tooltip>
        </div>
      </div>

      <ul className='px-6 py-2'>
        {output.length > 0
          ? output.map((output) => (
              <li key={String(output)} className='block text-sm text-gray-300'>
                {output}
              </li>
            ))
          : 'Sem resultado'}
      </ul>
    </motion.div>
  )
}

export const Console = forwardRef(ConsoleComponent)
