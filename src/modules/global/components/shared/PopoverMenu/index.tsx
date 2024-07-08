'use client'

import { ReactNode, useState } from 'react'
import * as Popover from '@radix-ui/react-popover'
import { AnimatePresence, motion, Variants } from 'framer-motion'
import { twMerge } from 'tailwind-merge'

import { Hydration } from '../Hydration'

import { Checkbox } from './Checkbox'

const popoverAnimation: Variants = {
  up: {
    opacity: 0,
    y: -24,
    x: 24,
  },
  down: {
    opacity: 1,
    y: 0,
    x: 0,
  },
}

export type PopoverMenuButton = {
  isToggle: boolean
  title?: string
  label?: string
  icon?: ReactNode
  value?: boolean | null
  action: VoidFunction
}

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
  const [isOpen, setIsOpen] = useState(false)

  function close() {
    setIsOpen(false)
    if (onOpenChange) onOpenChange(false)
  }

  function handleOpenChange(isMenuOpen: boolean) {
    setIsOpen(isMenuOpen)
    if (onOpenChange) onOpenChange(isMenuOpen)
  }

  function handlePopoverMenuButtonClick({ action }: Pick<PopoverMenuButton, 'action'>) {
    close()
    action()
  }

  return (
    <Popover.Root open={isOpen} onOpenChange={handleOpenChange}>
      <Popover.Trigger aria-label={label} className='w-max'>
        {trigger}
      </Popover.Trigger>
      <AnimatePresence>
        {isOpen ? (
          <Popover.Portal forceMount>
            <div className='flex flex-col'>
              <Popover.Content className='z-[2000] mr-1 min-w-[6rem]' sideOffset={5}>
                <motion.div
                  variants={popoverAnimation}
                  initial='up'
                  animate='down'
                  exit='up'
                  transition={{ duration: 0.2 }}
                  className='h-full w-full rounded-md bg-gray-700 p-2'
                >
                  <Popover.Arrow className='fill-gray-700' />

                  <ul>
                    {buttons.map(
                      ({ title, label, icon, isToggle, value, action }, index) => {
                        const isFirst = index === 0
                        return (
                          <li key={title}>
                            <Hydration>
                              <button
                                aria-label={label}
                                className={twMerge(
                                  'mr-auto flex w-full items-center justify-between border-t p-2 text-left text-gray-100',
                                  !isFirst ? 'border-green-400' : 'border-transparent'
                                )}
                                onClick={() => handlePopoverMenuButtonClick({ action })}
                                name={title}
                              >
                                <div className='flex gap-2'>
                                  {icon && icon}
                                  {title && (
                                    <label
                                      htmlFor={`button-${index}`}
                                      className='cursor-pointer'
                                    >
                                      {title}
                                    </label>
                                  )}
                                </div>

                                {isToggle && (
                                  <Checkbox
                                    id={`button-${index}`}
                                    isChecked={Boolean(value)}
                                  />
                                )}
                              </button>
                            </Hydration>
                          </li>
                        )
                      }
                    )}
                  </ul>
                </motion.div>
              </Popover.Content>
            </div>
          </Popover.Portal>
        ) : null}
      </AnimatePresence>
    </Popover.Root>
  )
}
