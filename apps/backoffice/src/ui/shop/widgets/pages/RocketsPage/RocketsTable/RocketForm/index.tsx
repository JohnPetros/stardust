import { useRestContext } from '@/ui/global/hooks/useRestContext'
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
  const { storageService } = useRestContext()
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
