'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'


import { useChallengeStore } from '@/stores/challengeStore'

import { Solution } from '@/@types/Solution'

import { PopoverMenuButton } from '@/global/components/PopoverMenu'
import { APP_ERRORS, ROUTES } from '@/global/constants'
import { CACHE } from '@/global/constants/cache'

import { useAuthContext } from '@/contexts/AuthContext/hooks/useAuthContext'

import { useApi } from '@/services/api'
import { useCache } from '@/services/cache'

type Sorter = 'date' | 'upvotes'

export function useSolutionsList(canShowSolutions: boolean) {
  const challenge = useChallengeStore((store) => store.state.challenge)

  const [title, setTitle] = useState('')
  const [sorter, setSorter] = useState<Sorter>('date')
  const [isPopoverMenuOpen, setIsPopoverMenuOpen] = useState(false)

  const { user } = useAuthContext()

  const api = useApi()
  const router = useRouter()

  function checkUserUpvotedSolution(
    solution: Solution,
    votedSolutionsIds: string[]
  ) {
    const isVoted = votedSolutionsIds.includes(solution.id)

    return {
      ...solution,
      isVoted,
    }
  }

  async function getFilteredSolutions() {
    if (!challenge || !user) return

    const filteredSolutions = await api.getFilteredSolutions(
      {
        challengeId: challenge.id,
        title,
        sorter,
      }
    )

    const upvotedSolutionsIds = await api.getUserUpvotedSolutionsIds(user.id)

    return filteredSolutions.map((solution) =>
      checkUserUpvotedSolution(solution, upvotedSolutionsIds)
    )
  }

  function handleSearchSoulutionTitleChange(solutionTitle: string) {
    setTitle(solutionTitle)
  }

  function handlePopoverMenuOpenChange(isOpen: boolean) {
    setIsPopoverMenuOpen(isOpen)
  }

  function handleSortSolutions(sorter: Sorter) {
    setSorter(sorter)
  }

  const {
    data: solutions,
    error,
    isLoading,
  } = useCache<Solution[]>({
    key: CACHE.keys.solutions,
    fetcher: getFilteredSolutions,
    dependencies: [challenge?.id, user?.id, sorter, title],
  })

  if (error) {
    console.error(error)
    throw new Error(APP_ERRORS.solutions.failedlistFetching)
  }

  const popoverMenuButtons: PopoverMenuButton[] = [
    {
      title: 'Mais recentes',
      isToggle: true,
      value: sorter === 'date',
      action: () => handleSortSolutions('date'),
    },
    {
      title: 'Mais votados',
      isToggle: true,
      value: sorter === 'upvotes',
      action: () => handleSortSolutions('upvotes'),
    },
  ]

  useEffect(() => {
    if (!canShowSolutions)
      router.push(`${ROUTES.private.challenge}/${challenge?.slug}`)
  }, [canShowSolutions, router, challenge?.slug])

  return {
    isLoading,
    solutions,
    sorter,
    isPopoverMenuOpen,
    popoverMenuButtons,
    handleSortSolutions,
    handlePopoverMenuOpenChange,
    handleSearchSoulutionTitleChange,
  }
}
