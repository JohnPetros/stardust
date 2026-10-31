import { cn } from '@/ui/shadcn/utils'
import { Icon } from '../Icon'

type Props = {
  className?: string
  size?: number
}

export const LoadingView = ({ className, size = 24 }: Props) => {
  return (
    <div className='flex items-center justify-center'>
      <Icon name='spinner' size={size} className={cn('animate-spin', className)} />
    </div>
  )
}
