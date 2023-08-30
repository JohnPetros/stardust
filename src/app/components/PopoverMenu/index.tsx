import { ReactNode } from 'react'

import * as Popover from '@radix-ui/react-popover'
import { Checkbox } from './Checkbox'

import { twMerge } from 'tailwind-merge'

export type PopoverMenuButton = {
  title: string
  isToggle: boolean
  value: boolean | null
  action: VoidFunction
}

interface PopoverMenuProps {
  buttons: PopoverMenuButton[]
  trigger: ReactNode
}

export function PopoverMenu({ buttons, trigger }: PopoverMenuProps) {
  return (
    <Popover.Root>
      <Popover.Trigger>{trigger}</Popover.Trigger>
      <Popover.Content className="bg-gray-700 rounded-md p-3 w-40">
        {buttons.map(({ title, isToggle, value }, index) => {
          const isFirst = index === 0

          return (
            <button
              key={title}
              className={twMerge(
                'flex items-center w-full text-left p-3 border-t text-gray-100 mr-auto',
                !isFirst ? 'border-green-400' : 'border-transparent'
              )}
            >
              {title}

              {isToggle && <Checkbox isChecked={Boolean(value)} />}
            </button>
          )
        })}
      </Popover.Content>
    </Popover.Root>
  )
}
