'use client'

import { useToastContext } from '@/ui/global/contexts/ToastContext'
import { useAudioContext } from '@/ui/global/hooks/useAudioContext'
import { useNavigationProvider } from '@/ui/global/hooks/useNavigationProvider'
import { useRestContext } from '@/ui/global/hooks/useRestContext'
import { useSpaceContext } from '@/ui/space/hooks/useSpaceContext'
import { StarDetailsView } from './StarDetailsView'
import { useStarDetails } from './useStarDetails'

type Props = {
  variant?: 'card' | 'flat'
}

export function StarDetails({ variant }: Props) {
  const { planets, trail, selectedStarId, restartStarAnimation } = useSpaceContext()
  const { challengingService } = useRestContext()
  const navigation = useNavigationProvider()
  const { showError } = useToastContext()
  const { playAudio } = useAudioContext()
  const { details, isPending, handleAction } = useStarDetails({
    planets,
    trail,
    selectedStarId,
    challengingService,
    navigation,
    showError,
    playAudio,
    restartStarAnimation,
  })

  return (
    <StarDetailsView
      details={details}
      isPending={isPending}
      variant={variant}
      onAction={handleAction}
    />
  )
}
