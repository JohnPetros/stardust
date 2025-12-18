import { useRest } from '@/ui/global/hooks/useRest'
import { ChallengesPageView } from './ChallengesPageView'
import { useChallengesPage } from './useChallengesPage'

export const ChallengesPage = () => {
  const { challengingService } = useRest()
  const {
    challenges,
    isLoading,
    page,
    totalPages,
    totalItemsCount,
    itemsPerPage,
    searchInput,
    difficulty,
    selectedCategoryIds,
    categories,
    handleSearchChange,
    handleDifficultyChange,
    handleCategoriesChange,
    handlePrevPage,
    handleNextPage,
  } = useChallengesPage(challengingService)

  return (
    <ChallengesPageView
      challenges={challenges}
      isLoading={isLoading}
      page={page}
      totalPages={totalPages}
      totalItemsCount={totalItemsCount}
      itemsPerPage={itemsPerPage}
      searchInput={searchInput}
      difficulty={difficulty}
      selectedCategoryIds={selectedCategoryIds}
      categories={categories}
      onSearchChange={handleSearchChange}
      onDifficultyChange={handleDifficultyChange}
      onCategoriesChange={handleCategoriesChange}
      onPrevPage={handlePrevPage}
      onNextPage={handleNextPage}
    />
  )
}
