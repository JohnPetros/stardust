import type { PropsWithChildren } from 'react'

import { Star } from '@/ui/global/widgets/components/Star'

type Props = {
  starName: string
  starNumber: number
}

export const HeaderView = ({
  starName,
  starNumber,
  children,
}: PropsWithChildren<Props>) => {
  return (
    <div className='flex items-center justify-between gap-4'>
      <div className='flex items-center'>
        <Star number={starNumber} size={72} />
        <h1 className='text-3xl font-bold text-zinc-100'>{starName}</h1>
      </div>
      {children}
    </div>
  )
}
