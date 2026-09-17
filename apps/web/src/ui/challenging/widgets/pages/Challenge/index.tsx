'use client'

import { useRef } from 'react'
import type { ChallengeDto } from '@stardust/core/challenging/entities/dtos'

import { STORAGE } from '@/constants'
import { useAuthContext } from '@/ui/global/hooks/useAuthContext'
import { useNavigationProvider } from '@/ui/global/hooks/useNavigationProvider'
import { useQueryStringParam } from '@/ui/global/hooks/useQueryStringParam'
import { useLocalStorage } from '@/ui/global/hooks/useLocalStorage'
import { useAnalyticsProvider } from '@/provision/analytics/useAnalyticsProvider'
import { useChallengeStore } from '@/ui/challenging/stores/ChallengeStore'
import { useChallengeNavigationGuard } from '@/ui/challenging/hooks/useChallengeNavigationGuard'
import type { AlertDialogRef } from '@/ui/global/widgets/components/AlertDialog/types'
import { ChallengeNavigation } from '../../components/ChallengeNavigation'
import { ChallengesNavigationSidebar } from '../../components/ChallengesNavigationSidebar'
import { ChallengeNavigationAlertDialog } from '../../components/ChallengeNavigationAlertDialog'
import { NotesDrawer } from '@/ui/global/widgets/components/NotesDrawer'
import { Icon } from '@/ui/global/widgets/components/Icon'
import { ChallengeLayoutControls } from './ChallengeLayoutControls'
import { useChallengePage } from './useChallengePage'
import { ChallengePageView } from './ChallengePageView'

type Props = {
  challengeDto: ChallengeDto
  userChallengeVote: string
  previousChallengeSlug: string | null
  nextChallengeSlug: string | null
}

export const ChallengePage = ({
  challengeDto,
  userChallengeVote,
  previousChallengeSlug,
  nextChallengeSlug,
}: Props) => {
  const { user, isAccountAuthenticated } = useAuthContext()
  const navigationProvider = useNavigationProvider()
  const analytics = useAnalyticsProvider()
  const store = useChallengeStore()
  const { challenge, setChallenge } = store.getChallengeSlice()
  const { craftsVislibility, setCraftsVislibility } = store.getCraftsVisibilitySlice()
  const { setActiveContent } = store.getActiveContentSlice()
  const { panelOrder } = store.getPanelOrderSlice()
  const challengeNavigationAlertDialogRef = useRef<AlertDialogRef | null>(null)
  const [isNew] = useQueryStringParam('isNew')
  const [from] = useQueryStringParam('from')
  const [roadmapNode] = useQueryStringParam('node')
  const secondCounterLocalstorage = useLocalStorage(STORAGE.keys.secondsCounter)
  const roadmapContextLocalstorage = useLocalStorage<{
    revisionKey: string
    nodeKey: string
    challengeId: string | null
  }>(STORAGE.keys.challengeRoadmapContext)
  const roadmapContext = roadmapContextLocalstorage.get()
  const navigationGuard = useChallengeNavigationGuard({
    challenge,
    navigationProvider,
    dialogRef: challengeNavigationAlertDialogRef,
  })
  const state = useChallengePage({
    challengeDto,
    userChallengeVote,
    previousChallengeSlug,
    nextChallengeSlug,
    user,
    isAccountAuthenticated,
    analytics,
    navigationProvider,
    challenge,
    setChallenge,
    craftsVislibility,
    setCraftsVislibility,
    setActiveContent,
    panelOrder,
    resetPanelsLayout: store.resetPanelsLayout,
    resetStore: store.resetStore,
    challengeNavigationAlertDialogRef,
    navigationGuard,
    isNew,
    from,
    roadmapNode,
    roadmapRevisionKey: roadmapContext?.revisionKey ?? null,
    roadmapContextLocalstorage,
    secondCounterLocalstorage,
  })

  return (
    <ChallengePageView
      challengeTitle={state.challengeTitle}
      shouldHaveConfettiAnimation={state.shouldHaveConfettiAnimation}
      layoutControlsSlot={
        <ChallengeLayoutControls
          panelOrder={state.panelOrder}
          onResetLayout={state.handleResetLayoutButtonClick}
        />
      }
      challengeNavigationSlot={
        <ChallengeNavigation
          previousChallengeSlug={state.previousChallengeSlug}
          nextChallengeSlug={state.nextChallengeSlug}
          onPreviousChallengeClick={state.handlePreviousChallengeClick}
          onNextChallengeClick={state.handleNextChallengeClick}
          onOpenSidebar={state.handleOpenSidebar}
          sidebarSlot={
            <ChallengesNavigationSidebar
              isOpen={state.isSidebarOpen}
              onClose={state.handleCloseSidebar}
              currentChallengeSlug={state.challengeSlug}
              onChallengeSelect={state.handleSidebarChallengeSelect}
            />
          }
        />
      }
      notesSlot={
        <NotesDrawer>
          <div className='rounded-md p-1 text-gray-300 transition-colors hover:bg-gray-800 hover:text-gray-100'>
            <Icon name='book' size={20} />
          </div>
        </NotesDrawer>
      }
      challengeNavigationAlertDialogSlot={
        <ChallengeNavigationAlertDialog
          dialogRef={state.challengeNavigationAlertDialogRef}
          onConfirm={state.confirmNavigation}
          onCancel={state.cancelNavigation}
        />
      }
      handleBackButtonClick={state.handleBackButtonClick}
      backButtonLabel={state.backButtonLabel}
    />
  )
}
