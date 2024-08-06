'use client'

import { type ForwardedRef, forwardRef, useImperativeHandle } from 'react'

import { Tooltip } from '../Tooltip'

import type { ConsoleRef } from './types'
import { AnimatedPanel } from './AnimatedPanel'
import { useConsole } from './useConsole'
import { Icon } from '../Icon'

export type ConsoleProps = {
  outputs: string[]
  height: number
}

export function ConsoleComponent(
  { outputs, height }: ConsoleProps,
  ref: ForwardedRef<ConsoleRef>,
) {
  const { isOpen, open, close, panelHeight } = useConsole(height)

  useImperativeHandle(
    ref,
    () => {
      return {
        open,
        close,
      }
    },
    [open, close],
  )

  return (
    <AnimatedPanel
      isOpen={isOpen}
      height={panelHeight}
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
              <Icon name='simple-arrow-down' className='text-lg text-gray-400' weight='bold' />
            </button>
          </Tooltip>
        </div>
      </div>

      <ul className='px-6 py-2'>
        {outputs.length > 0
          ? outputs.map((output) => (
              <li key={String(output)} className='block text-sm text-gray-300'>
                {output}
              </li>
            ))
          : 'Sem resultado'}
      </ul>
    </AnimatedPanel>
  )
}

export const Console = forwardRef(ConsoleComponent)
