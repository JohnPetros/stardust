import { useRest } from '@/ui/global/hooks/useRest'
import { RocketFormView } from './RocketFormView'
import type { PropsWithChildren } from 'react'

type Props = {
  onSubmit: (data: {
    name: string
    image: string
    price: number
    isAcquiredByDefault?: boolean
    isSelectedByDefault?: boolean
  }) => Promise<void>
}

export const RocketForm = ({ children, onSubmit }: PropsWithChildren<Props>) => {
  const { storageService } = useRest()
  return (
    <RocketFormView storageService={storageService} onSubmit={onSubmit}>
      {children}
    </RocketFormView>
  )
}
