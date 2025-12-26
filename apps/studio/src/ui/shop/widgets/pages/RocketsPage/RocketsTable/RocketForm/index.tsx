import { useRest } from '@/ui/global/hooks/useRest'
import { RocketFormView } from './RocketFormView'
import type { PropsWithChildren } from 'react'
import type { RocketDto } from '@stardust/core/shop/entities/dtos'

type Props = {
  onSubmit: (dto: RocketDto) => Promise<void>
  initialValues?: RocketDto
}

export const RocketForm = ({
  children,
  onSubmit,
  initialValues,
}: PropsWithChildren<Props>) => {
  const { storageService } = useRest()
  return (
    <RocketFormView
      storageService={storageService}
      onSubmit={onSubmit}
      initialValues={initialValues}
    >
      {children}
    </RocketFormView>
  )
}
