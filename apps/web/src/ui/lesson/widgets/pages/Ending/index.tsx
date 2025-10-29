import { useRef } from 'react'

import type { AnimatedProgressBarRef } from '@/ui/global/widgets/components/AnimatedProgressBar/types'
import { useNavigationProvider } from '@/ui/global/hooks/useNavigationProvider'
import { EndingPageView } from './EndingPageView'
import { useEndingPage } from './useEndingPage'

export const EndingPage = () => {
  const progressBarRef = useRef<AnimatedProgressBarRef | null>(null)
  const {
    activeThankIndex,
    lastThankIndex,
    handleProgressBarAnimationEnd,
    handleSkipTextButtonClick,
  } = useEndingPage(progressBarRef)
  const navigationProvider = useNavigationProvider()

  return (
    <EndingPageView
      progressBarRef={progressBarRef}
      activeThankIndex={activeThankIndex}
      lastThankIndex={lastThankIndex}
      navigationProvider={navigationProvider}
      onProgressBarAnimationEnd={handleProgressBarAnimationEnd}
      onSkipTextButtonClick={handleSkipTextButtonClick}
    />
  )
}
