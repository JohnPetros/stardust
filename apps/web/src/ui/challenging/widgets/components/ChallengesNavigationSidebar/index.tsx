'use client'

import { useAuthContext } from '@/ui/global/hooks/useAuthContext'
import { useRestContext } from '@/ui/global/hooks/useRestContext'
import { ChallengesNavigationSidebarView } from './ChallengesNavigationSidebarView'
import { useChallengesNavigationSidebar } from './useChallengesNavigationSidebar'

type Props = {
  isOpen: boolean
  onClose: () => void
  currentChallengeSlug: string
  onChallengeSelect: (challengeSlug: string) => void
}

export const ChallengesNavigationSidebar = ({
  isOpen,
  onClose,
  currentChallengeSlug,
  onChallengeSelect,
}: Props) => {
  const { challengingService } = useRestContext()
  const { user, isAccountAuthenticated } = useAuthContext()

  const {
    isLoading,
    errorMessage,
    isEmpty,
    categories,
    challenges,
    page,
    totalPagesCount,
    paginationStart,
    paginationEnd,
    totalItemsCount,
    completedChallengesCount,
    sidebarTotalChallengesCount,
    activeFiltersCount,
    filters,
    handleSearchChange,
    handleApplyFilters,
    handleClearFilters,
    handlePreviousPageClick,
    handleNextPageClick,
    handleChallengeClick,
    refetch,
  } = useChallengesNavigationSidebar({
    isOpen,
    currentChallengeSlug,
    challengingService,
    isAccountAuthenticated,
    user,
    onClose,
    onChallengeSelect,
  })

  return (
    <ChallengesNavigationSidebarView
      isOpen={isOpen}
      isLoading={isLoading}
      errorMessage={errorMessage}
      isEmpty={isEmpty}
      isAccountAuthenticated={isAccountAuthenticated}
      completedChallengesCount={completedChallengesCount}
      totalChallengesCount={sidebarTotalChallengesCount}
      categories={categories}
      challenges={challenges}
      currentChallengeSlug={currentChallengeSlug}
      user={user}
      activeFiltersCount={activeFiltersCount}
      filters={filters}
      page={page}
      totalPagesCount={totalPagesCount}
      paginationStart={paginationStart}
      paginationEnd={paginationEnd}
      totalItemsCount={totalItemsCount}
      onClose={onClose}
      onSearchChange={handleSearchChange}
      onApplyFilters={handleApplyFilters}
      onClearFilters={handleClearFilters}
      onPreviousPageClick={handlePreviousPageClick}
      onNextPageClick={handleNextPageClick}
      onChallengeClick={handleChallengeClick}
      onRetry={refetch}
    />
  )
}
