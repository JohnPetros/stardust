'use client'

import { RefObject } from 'react'
import { Icon } from '@phosphor-icons/react'

interface IconButtonProps {
  buttonRef: RefObject<HTMLButtonElement>
  icon: Icon
  onClick: VoidFunction
}

export function IconButton({
  buttonRef,
  icon: Icon,
  onClick,
}: IconButtonProps) {
  return (
    <button
      ref={buttonRef}
      className="grid place-content-center"
      onClick={onClick}
    >
      <Icon className="text-green-500 text-xl" weight="bold" />
    </button>
  )
}
