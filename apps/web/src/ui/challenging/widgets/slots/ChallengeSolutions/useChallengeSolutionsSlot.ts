import { useState } from 'react'

import { Solution } from '@stardust/core/challenging/entities'

import { CACHE } from '@/constants'
import { usePaginatedCache } from '@/ui/global/hooks/usePaginatedCache'
import type { PopoverMenuButton } from '@/ui/global/widgets/components/PopoverMenu/types'
import { Id, OrdinalNumber, Text } from '@stardust/core/global/structures'
import { SolutionsListingSorter } from '@stardust/core/challenging/structures'
import type { ChallengingService } from '@stardust/core/challenging/interfaces'
import type { Challenge } from '@stardust/core/challenging/entities'
import type { User } from '@stardust/core/profile/entities'
import type { CodePlaybackDto } from '@stardust/core/global/structures/dtos'

type Params = {
  challengingService: ChallengingService
  user: User | null
  challenge: Challenge | null
}

const SOLUTIONS_PER_PAGE = OrdinalNumber.create(15)

export function useChallengeSolutionsSlot({
  challengingService,
  user,
  challenge,
}: Params) {
  const [sorter, setSorter] = useState<SolutionsListingSorter>(
    SolutionsListingSorter.create('date'),
  )
  const [solutionTitle, setSolutionTitle] = useState('')
  const [isFromUser, setIsFromUser] = useState(false)
  async function fetchSolutionsList(page: number) {
    const response = await challengingService.fetchSolutionsList({
      page: OrdinalNumber.create(page),
      title: Text.create(solutionTitle),
      itemsPerPage: SOLUTIONS_PER_PAGE,
      sorter,
      userId: isFromUser ? Id.create(user?.id.value) : null,
      challengeId: Id.create(challenge?.id.value),
    })
    if (response.isFailure) response.throwError()
    return response.body
  }

  const { data, isLoading, isReachedEnd, nextPage } = usePaginatedCache({
    key: CACHE.keys.solutionsList,
    fetcher: fetchSolutionsList,
    itemsPerPage: SOLUTIONS_PER_PAGE.value,
    isInfinity: true,
    isEnabled: Boolean(user && challenge),
    shouldRefetchOnFocus: false,
    dependencies: [solutionTitle, sorter],
  })

  function handleSolutionTitleChange(title: string) {
    setSolutionTitle(title)
  }

  function handleSorterChange(sorter: string) {
    setSorter(SolutionsListingSorter.create(sorter))
  }

  function handleIsFromUserChange(isFromUser: boolean) {
    setIsFromUser(isFromUser)
  }

  const popoverMenuButtons: PopoverMenuButton[] = [
    {
      title: 'Mais recentes',
      isToggle: true,
      value: sorter.isDate.isTrue,
      action: () => handleSorterChange('date'),
    },
    {
      title: 'Mais votados',
      isToggle: true,
      value: sorter.isUpvotesCount.isTrue,
      action: () => handleSorterChange('upvotesCount'),
    },
    {
      title: 'Mais comentados',
      isToggle: true,
      value: sorter.isCommentsCount.isTrue,
      action: () => handleSorterChange('commentsCount'),
    },
  ]

  return {
    sorter,
    solutions: data.map((solution) => {
      const entity = Solution.create(solution)
      return {
        id: entity.id.value,
        title: entity.title.value,
        slug: entity.slug.value,
        upvotesCount: entity.upvotesCount.value,
        viewsCount: entity.viewsCount.value,
        commentsCount: entity.commentsCount.value,
        postedAt: entity.postedAt,
        author: {
          name: entity.author.name.value,
          slug: entity.author.slug.value,
          avatar: {
            name: entity.author.avatar.name.value,
            image: entity.author.avatar.image.value,
          },
        },
      }
    }),
    officialSolution: (challenge?.officialSolution?.dto ??
      null) as CodePlaybackDto | null,
    solutionTitle,
    isFromUser,
    isLoading,
    isReachedEnd,
    popoverMenuButtons,
    challengeSlug: challenge?.slug.value ?? '',
    isChallengeCompleted: Boolean(
      challenge && user && user.hasCompletedChallenge(challenge.id).isTrue,
    ),
    nextPage,
    handleIsFromUserChange,
    handleSolutionTitleChange,
  }
}
