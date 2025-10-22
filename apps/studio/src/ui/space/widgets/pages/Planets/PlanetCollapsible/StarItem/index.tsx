import type { Star } from '@stardust/core/space/entities'

import { useRest } from '@/ui/global/hooks/useRest'
import { useToastProvider } from '@/ui/global/hooks/useToastProvider'
import { StarItemView } from './StarItemView'
import { useStarItem } from './useStarItem'

type Props = {
  star: Star
  onDelete: (starId: string) => void
}

export const StarItem = ({ star, onDelete }: Props) => {
  const { spaceService } = useRest()
  const toastProvider = useToastProvider()
  const { isChallenge, handleStarNameChange, handleStarAvailabilityChange, handleStarTypeChange } = useStarItem({
    service: spaceService,
    starId: star.id,
    isStarChallenge: star.isChallenge,
    toastProvider,
  })

  return (
    <StarItemView
      star={star}
      isChallenge={isChallenge.value}
      onNameChange={handleStarNameChange}
      onAvailabilityChange={handleStarAvailabilityChange}
      onTypeChange={handleStarTypeChange}
      onDelete={onDelete}
    />
  )
}
