import { Animation } from '@/ui/global/components/shared/Animation'

type TitleProps = {
  number: number
  children: string
}

export function Title({ children, number }: TitleProps) {
  return (
    <div className=' flex items-center justify-center'>
      <div className='relative'>
        <Animation name='unlocked-star' size={80} hasLoop={false} />
        <span className='absolute left-[52%] top-[51%] block -translate-x-1/2 -translate-y-1/2 text-lg font-semibold text-yellow-700'>
          {number}
        </span>
      </div>
      <h1 className='text-xl font-bold uppercase text-gray-100'>{children}</h1>
    </div>
  )
}
