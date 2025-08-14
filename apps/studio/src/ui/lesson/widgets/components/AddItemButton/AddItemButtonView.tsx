import type { PropsWithChildren } from 'react'

import { Icon } from '@/ui/global/widgets/components/Icon'
import { Button } from '@/ui/shadcn/components/button'

type Props = {
  onClick: () => void
}

export const AddItemButtonView = ({ onClick, children }: PropsWithChildren<Props>) => {
  return (
    <Button variant='ghost' onClick={onClick}>
      <Icon name='plus' className='w-4 h-4 rounded-md bg-green-400 text-green-900' />
      {children}
    </Button>
  )
}
