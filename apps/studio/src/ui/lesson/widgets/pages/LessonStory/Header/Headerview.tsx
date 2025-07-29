import { Star } from '@/ui/global/widgets/components/Star'

type Props = {
  starName: string
  starNumber: number
}

export const HeaderView = ({ starName, starNumber }: Props) => {
  return (
    <div className='flex items-center'>
      <Star number={starNumber} size={100} />
      <h1 className='text-2xl font-bold text-zinc-100'>{starName}</h1>
    </div>
  )
}
