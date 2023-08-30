'use client'

import { ReactNode, useState } from 'react'

import * as Popover from '@radix-ui/react-popover'
import { Checkbox } from './Checkbox'

import { AnimatePresence, Variants, motion } from 'framer-motion'
import { twMerge } from 'tailwind-merge'

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
  buttons: PopoverMenuButton[]
  trigger: ReactNode
}

export function PopoverMenu({ buttons, trigger }: PopoverMenuProps) {
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
      <Popover.Trigger onClick={handleTriggerClick}>{trigger}</Popover.Trigger>
      <AnimatePresence>
        {isOpen ? (
          <Popover.Portal forceMount>
            <div className="flex flex-col">
              <Popover.Content className="w-40 mr-1" sideOffset={5}>
                <motion.div
                  variants={popoverAnimation}
                  initial="up"
                  animate="down"
                  exit="up"
                  className="bg-gray-700 rounded-md p-3 w-full h-full"
                >
                  <Popover.Arrow className='fill-gray-700' />

                  {buttons.map(({ title, isToggle, value, action }, index) => {
                    const isFirst = index === 0
                    return (
                      <button
                        key={title}
                        className={twMerge(
                          'flex items-center w-full text-left p-3 border-t text-gray-100 mr-auto',
                          !isFirst ? 'border-green-400' : 'border-transparent'
                        )}
                        onClick={() => handlePopoverMenuButtonClick({ action })}
                      >
                        {title}

                        {isToggle && <Checkbox isChecked={Boolean(value)} />}
                      </button>
                    )
                  })}
                </motion.div>
              </Popover.Content>
            </div>
          </Popover.Portal>
        ) : null}
      </AnimatePresence>
    </Popover.Root>
  )
}
