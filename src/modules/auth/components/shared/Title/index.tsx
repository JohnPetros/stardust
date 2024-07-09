import { Icon } from '@/modules/global/components/shared/Icon'
import type { IconName } from '@/modules/global/components/shared/Icon/types'

type TitleProps = {
  title: string
  text: string
  icon: IconName
}

export function Title({ title, text, icon }: TitleProps) {
  return (
    <div>
      <div className='flex items-center gap-3'>
        <Icon name={icon} className='text-green-400' weight='bold' size={24} />
        <h1 className='text-xl font-medium text-green-400'>{title}</h1>
      </div>
      <p className='mt-2 text-gray-100 tracking-wider'>{text}</p>
    </div>
  )
}
