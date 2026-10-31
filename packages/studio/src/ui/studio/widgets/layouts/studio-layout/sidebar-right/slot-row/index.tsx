import type { PropsWithChildren } from 'react'

export type SlotRowProps = PropsWithChildren<{
  label?: string
}>

export const SlotRow = ({ label, children }: SlotRowProps) => {
  return (
    <div className='flex items-center gap-1 min-h-7'>
      <span className='w-20 shrink-0 truncate text-xxs text-muted-foreground'>
        {label}
      </span>
      {children}
    </div>
  )
}
