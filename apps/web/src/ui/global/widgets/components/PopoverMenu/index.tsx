'use client'

import type { ReactNode } from 'react'
import * as Popover from '@radix-ui/react-popover'
import { twMerge } from 'tailwind-merge'

import type { PopoverMenuButton } from './types'
import { Hydration } from '../Hydration'
import { Checkbox } from './Checkbox'
import { usePopoverMenu } from './usePopoverMenu'
import { AnimatedPanel } from './AnimatedPanel'

type PopoverMenuProps = {
  label: string
  buttons: PopoverMenuButton[]
  children: ReactNode
  onOpenChange?: (isOpen: boolean) => void
}

export function PopoverMenu({
  buttons,
  children: trigger,
  label,
  onOpenChange,
}: PopoverMenuProps) {
  const { isOpen, handleOpenChange, handleButtonClick } = usePopoverMenu(onOpenChange)

  return (
    <>
      <Popover.Root open={isOpen} onOpenChange={handleOpenChange}>
        <Popover.Trigger aria-label={label} className='w-max' asChild>
          {trigger}
        </Popover.Trigger>
        <AnimatedPanel isOpen={isOpen}>
          <ul>
            {buttons.map(({ title, label, icon, isToggle, value, action }, index) => {
              const isFirst = index === 0
              return (
                <li key={label}>
                  <Hydration>
                    <button
                      aria-label={label}
                      type='button'
                      className={twMerge(
                        'mr-auto flex w-full items-center justify-between border-t p-2 text-sm text-left text-gray-100',
                        !isFirst ? 'border-green-400' : 'border-transparent',
                      )}
                      onClick={() => handleButtonClick({ action })}
                      name={title}
                    >
                      <div className='flex gap-2'>
                        {icon && icon}
                        {title && (
                          <label htmlFor={`button-${index}`} className='cursor-pointer'>
                            {title}
                          </label>
                        )}
                      </div>

                      {isToggle && (
                        <Checkbox id={`button-${index}`} isChecked={Boolean(value)} />
                      )}
                    </button>
                  </Hydration>
                </li>
              )
            })}
          </ul>
        </AnimatedPanel>
      </Popover.Root>
    </>
  )
}
