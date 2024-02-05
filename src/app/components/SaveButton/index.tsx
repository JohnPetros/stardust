import { CloudArrowUp } from '@phosphor-icons/react'
import { twMerge } from 'tailwind-merge'

import { useSaveButton } from './useSaveButton'

import { Button } from '@/app/components/Button'

type SaveButtonProps = {
  onSave: () => Promise<void>
}

export function SaveButton({ onSave }: SaveButtonProps) {
  const { variant, title, handleClick } = useSaveButton(onSave)

  return (
    <Button
      className={twMerge(
        'flex h-8 w-32 items-center gap-2 border border-transparent',
        variant
      )}
      onClick={handleClick}
    >
      <CloudArrowUp className={twMerge('text-lg', variant)} weight="bold" />
      {title}
    </Button>
  )
}
