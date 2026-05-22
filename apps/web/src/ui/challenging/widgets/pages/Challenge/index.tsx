'use client'

import type { ChallengeDto } from '@stardust/core/challenging/entities/dtos'

import { useChallengePage } from './useChallengePage'
import { ChallengePageView } from './ChallengePageView'
import { useAuthContext } from '@/ui/global/hooks/useAuthContext'
import { ChallengeNavigation } from '../../components/ChallengeNavigation'
import { ChallengesNavigationSidebar } from '../../components/ChallengesNavigationSidebar'
import { ChallengeNavigationAlertDialog } from '../../components/ChallengeNavigationAlertDialog'
import { NotesDrawer } from '@/ui/global/widgets/components/NotesDrawer'
import { Icon } from '@/ui/global/widgets/components/Icon'

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
  const {
    challengeTitle,
    panelsLayout,
    shouldHaveConfettiAnimation,
    previousChallengeSlug: pagePreviousChallengeSlug,
    nextChallengeSlug: pageNextChallengeSlug,
    isSidebarOpen,
    challengeSlug,
    challengeNavigationAlertDialogRef,
    confirmNavigation,
    cancelNavigation,
    handleBackButtonClick,
    handlePanelsLayoutButtonClick,
    handlePreviousChallengeClick,
    handleNextChallengeClick,
    handleOpenSidebar,
    handleCloseSidebar,
    handleSidebarChallengeSelect,
  } = useChallengePage({
    challengeDto,
    user,
    userChallengeVote,
    previousChallengeSlug,
    nextChallengeSlug,
    isAccountAuthenticated,
  })

  return (
    <ChallengePageView
      challengeTitle={challengeTitle}
      panelsLayout={panelsLayout}
      shouldHaveConfettiAnimation={shouldHaveConfettiAnimation}
      challengeNavigationSlot={
        <ChallengeNavigation
          previousChallengeSlug={pagePreviousChallengeSlug}
          nextChallengeSlug={pageNextChallengeSlug}
          onPreviousChallengeClick={handlePreviousChallengeClick}
          onNextChallengeClick={handleNextChallengeClick}
          onOpenSidebar={handleOpenSidebar}
          sidebarSlot={
            <ChallengesNavigationSidebar
              isOpen={isSidebarOpen}
              onClose={handleCloseSidebar}
              currentChallengeSlug={challengeSlug}
              onChallengeSelect={handleSidebarChallengeSelect}
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
          dialogRef={challengeNavigationAlertDialogRef}
          onConfirm={confirmNavigation}
          onCancel={cancelNavigation}
        />
      }
      handleBackButtonClick={handleBackButtonClick}
      handlePanelsLayoutButtonClick={handlePanelsLayoutButtonClick}
    />
  )
}
