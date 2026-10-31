import type { PropsWithChildren } from 'react'

export type PropertyGroupProps = PropsWithChildren<{
  title?: string
}>

export const PropertyGroup = ({ title, children }: PropertyGroupProps) => {
  return (
    <div className='flex flex-col border-t border-border px-4'>
      <div className='h-11 flex items-center'>
        <span className='text-xxs text-foreground'>{title}</span>
      </div>
      <div className='flex flex-col gap-2 pb-3'>{children}</div>
    </div>
  )
}
