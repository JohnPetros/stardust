'use client'

import { ReactNode, useState } from 'react'
import * as Popover from '@radix-ui/react-popover'
import { AnimatePresence, motion, Variants } from 'framer-motion'
import { twMerge } from 'tailwind-merge'

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
  title: string
  isToggle: boolean
  value: boolean | null
  action: VoidFunction
}

interface PopoverMenuProps {
  label: string
  buttons: PopoverMenuButton[]
  trigger: ReactNode
}

export function PopoverMenu({ buttons, trigger, label }: PopoverMenuProps) {
  const [isOpen, setIsOpen] = useState(false)

  function close() {
    setIsOpen(false)
  }

  function handleTriggerClick() {
    setIsOpen(true)
  }

  function handleOpenChange() {
    if (isOpen) close()
  }

  function handlePopoverMenuButtonClick({
    action,
  }: Pick<PopoverMenuButton, 'action'>) {
    close()
    action()
  }

  return (
    <Popover.Root open={isOpen} onOpenChange={handleOpenChange}>
      <Popover.Trigger
        aria-label={label}
        className="w-max"
        onClick={handleTriggerClick}
      >
        {trigger}
      </Popover.Trigger>
      <AnimatePresence>
        {isOpen ? (
          <Popover.Portal forceMount>
            <div className="flex flex-col">
              <Popover.Content
                className="z-[150] mr-1 min-w-[10rem]"
                sideOffset={5}
              >
                <motion.div
                  variants={popoverAnimation}
                  initial="up"
                  animate="down"
                  exit="up"
                  className="h-full w-full rounded-md bg-gray-700 p-3"
                >
                  <Popover.Arrow className="fill-gray-700" />

                  <ul>
                    {buttons.map(
                      ({ title, isToggle, value, action }, index) => {
                        const isFirst = index === 0
                        return (
                          <li key={title}>
                            <button
                              className={twMerge(
                                'mr-auto flex w-full items-center justify-between border-t p-3 text-left text-gray-100',
                                !isFirst
                                  ? 'border-green-400'
                                  : 'border-transparent'
                              )}
                              onClick={() =>
                                handlePopoverMenuButtonClick({ action })
                              }
                              name={title}
                            >
                              <label htmlFor={title} className="cursor-pointer">
                                {title}
                              </label>

                              {isToggle && (
                                <Checkbox
                                  id={title}
                                  isChecked={Boolean(value)}
                                />
                              )}
                            </button>
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
