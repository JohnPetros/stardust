import { Icon } from '@/ui/global/widgets/components/Icon'
import type { IconName } from '@/ui/global/widgets/components/Icon/types'

type TitleProps = {
  title: string
  text: string
  icon: IconName
}

export const TitleView = ({ title, text, icon }: TitleProps) => {
  return (
    <div>
      <div className='flex items-center gap-3'>
        <Icon name={icon} className='text-theme-accent-text' weight='bold' size={24} />
        <h1 className='text-2xl font-semibold leading-[1.417] text-theme-accent-text'>
          {title}
        </h1>
      </div>
      {text && <p className='mt-2 text-sm text-theme-text-secondary'>{text}</p>}
    </div>
  )
}
