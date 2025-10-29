import { useRest } from '@/ui/global/hooks/useRest'
import { PlanetFormView } from './PlanetFormView'
import type { PlanetDto } from '@stardust/core/space/entities/dtos'
import type { PropsWithChildren } from 'react'

type Props = {
  planetDto?: PlanetDto
  onSubmit: (planetDto: Pick<PlanetDto, 'name' | 'icon' | 'image'>) => void
}

export const PlanetForm = ({
  children,
  planetDto,
  onSubmit,
}: PropsWithChildren<Props>) => {
  const { storageService } = useRest()
  return (
    <PlanetFormView
      storageService={storageService}
      planetDto={planetDto}
      onSubmit={onSubmit}
    >
      {children}
    </PlanetFormView>
  )
}
