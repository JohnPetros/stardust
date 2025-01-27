import type { PropsWithChildren } from 'react'

import { Icon } from '@/ui/global/widgets/components/Icon'
import type { IconName } from '@/ui/global/widgets/components/Icon/types'
import { AnimatedReveal } from '../../AnimatedReveal'
import { Paragraph } from '../../Paragraph'

type TextBlockProps = {
  title: string
  icon: IconName
}

export function TextBlock({ children, icon, title }: PropsWithChildren<TextBlockProps>) {
  return (
    <div>
      <AnimatedReveal>
        <h3 className='flex items-center gap-1 text-gray-50 font-semibold'>
          <Icon name={icon} className='text-green-400' />
          {title}
        </h3>
      </AnimatedReveal>
      <Paragraph>{children}</Paragraph>
    </div>
  )
}
