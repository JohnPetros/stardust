import { twMerge } from 'tailwind-merge'

type SeparatorProps = {
  isColumn?: boolean
  className?: string
}

export function Separator({ isColumn = true, className }: SeparatorProps) {
  return (
    <span
      className={twMerge(
        'block rounded-md bg-gray-600',
        isColumn ? 'h-full w-[1px]' : 'mx-auto h-[1px] w-[90%]',
        className
      )}
    />
  )
}
