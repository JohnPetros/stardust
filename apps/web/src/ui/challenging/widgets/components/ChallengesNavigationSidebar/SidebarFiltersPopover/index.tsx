import { useEffect, useState } from 'react'

import type { ChallengeCategoryDto } from '@stardust/core/challenging/entities/dtos'

import { SidebarFiltersPopoverView } from './SidebarFiltersPopoverView'

type Filters = {
  completionStatus: 'all' | 'completed' | 'not-completed'
  difficultyLevels: string[]
  categoriesIds: string[]
}

type Props = {
  categories: ChallengeCategoryDto[]
  isAccountAuthenticated: boolean
  isLoading: boolean
  activeFiltersCount: number
  appliedFilters: Filters
  onApplyFilters: (filters: Filters) => void
  onClearFilters: () => void
}

export const SidebarFiltersPopover = ({
  categories,
  isAccountAuthenticated,
  isLoading,
  activeFiltersCount,
  appliedFilters,
  onApplyFilters,
  onClearFilters,
}: Props) => {
  const [isOpen, setIsOpen] = useState(false)
  const [draftFilters, setDraftFilters] = useState<Filters>(appliedFilters)

  useEffect(() => {
    setDraftFilters(appliedFilters)
  }, [appliedFilters])

  function handleCategoryToggle(categoryId: string) {
    setDraftFilters((currentFilters) => {
      const shouldRemove = currentFilters.categoriesIds.includes(categoryId)

      return {
        ...currentFilters,
        categoriesIds: shouldRemove
          ? currentFilters.categoriesIds.filter((id) => id !== categoryId)
          : [...currentFilters.categoriesIds, categoryId],
      }
    })
  }

  function handleDifficultyChange(difficultyLevel: string) {
    setDraftFilters((currentFilters) => {
      if (difficultyLevel === 'all') {
        return { ...currentFilters, difficultyLevels: [] }
      }

      return { ...currentFilters, difficultyLevels: [difficultyLevel] }
    })
  }

  return (
    <SidebarFiltersPopoverView
      isOpen={isOpen}
      isAccountAuthenticated={isAccountAuthenticated}
      isLoading={isLoading}
      categories={categories
        .filter((category) => Boolean(category.id))
        .map((category) => ({
          id: category.id as string,
          name: category.name,
        }))}
      activeFiltersCount={activeFiltersCount}
      draftFilters={draftFilters}
      onOpenChange={setIsOpen}
      onCompletionStatusChange={(completionStatus) => {
        setDraftFilters((currentFilters) => ({
          ...currentFilters,
          completionStatus,
        }))
      }}
      onDifficultyChange={handleDifficultyChange}
      onCategoryToggle={handleCategoryToggle}
      onApply={() => {
        onApplyFilters(draftFilters)
        setIsOpen(false)
      }}
      onClear={() => {
        const emptyFilters = {
          completionStatus: 'all' as const,
          difficultyLevels: [],
          categoriesIds: [],
        }
        setDraftFilters(emptyFilters)
        onClearFilters()
        setIsOpen(false)
      }}
    />
  )
}
