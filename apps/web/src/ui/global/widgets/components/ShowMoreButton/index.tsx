import type { ClassNameValue } from 'tailwind-merge'

import { Button } from '../Button'

type ShowMoreButtonProps = {
  isLoading: boolean
  className?: ClassNameValue
  onClick: VoidFunction
}

export function ShowMoreButton({ onClick, isLoading }: ShowMoreButtonProps) {
  return (
    <Button
      isLoading={isLoading}
      onClick={onClick}
      className='bg-transparent border border-gray-600 text-gray-600'
    >
      Mostrar mais
    </Button>
  )
}
