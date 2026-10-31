import { Animation } from '@/ui/global/widgets/components/Animation'

type Props = {
  number: number
  size?: number
}

export const StarView = ({ number, size = 80 }: Props) => {
  return (
    <div className='relative'>
      <Animation name='star' size={size} hasLoop={false} />
      <span className='absolute left-1/2 top-1/2 -translate-x-[calc(50%-2px)] -translate-y-[calc(50%-2px)] text-base font-bold text-yellow-900'>
        {number}
      </span>
    </div>
  )
}
