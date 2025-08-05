'use client'

import { Tooltip } from '../Tooltip'
import { AnimatedPanel } from './AnimatedPanel'
import { Icon } from '../Icon'

export type Props = {
  outputs: string[]
  isOpen: boolean
  panelHeight: string
  onDragDown: VoidFunction
  onClose: VoidFunction
}

export const ConsoleView = ({
  outputs,
  isOpen,
  panelHeight,
  onDragDown,
  onClose,
}: Props) => {
  return (
    <AnimatedPanel
      isOpen={isOpen}
      height={panelHeight}
      onDragDown={onDragDown}
      className='absolute -bottom-4 w-full cursor-pointer rounded-t-lg bg-zinc-800'
    >
      <div className='border-b border-gray-400 px-6 py-2'>
        <span className='mx-auto block h-[2px] w-1/6 rounded-md bg-gray-400' />
        <div className='mt-1 flex items-center justify-between'>
          <div className='flex items-center gap-3'>
            <strong className='text-gray-200'>Saída</strong>
          </div>
          <Tooltip content='Fechar console'>
            <button type='button' onClick={onClose} tabIndex={isOpen ? undefined : -1}>
              <Icon name='arrow-down' className='text-lg text-gray-400' />
            </button>
          </Tooltip>
        </div>
      </div>

      {outputs.length > 0 ? (
        <ul className='px-6 py-2'>
          {outputs.map((output) => (
            <li key={String(output)} className='block text-sm text-gray-300'>
              {output}
            </li>
          ))}
        </ul>
      ) : (
        <p className='block px-6 py-2 text-sm text-gray-300'>Sem saída</p>
      )}
    </AnimatedPanel>
  )
}
