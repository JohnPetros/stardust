import { zodResolver } from '@hookform/resolvers/zod'
import {
  ChallengeCompletionStatus,
  ChallengeDifficulty,
} from '@stardust/core/challenging/structures'
import type { ChallengingService } from '@stardust/core/challenging/interfaces'
import {
  IdsList,
  ListingOrder,
  Logical,
  OrdinalNumber,
  Text,
} from '@stardust/core/global/structures'
import { challengeSourceSchema } from '@stardust/validation/challenging/schemas'
import { useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import type { z } from 'zod'

import { useDebounce } from '@/ui/global/hooks/useDebounce'
import { useFetch } from '@/ui/global/hooks/useFetch'

type FormData = z.infer<typeof challengeSourceSchema>

type Params = {
  challengingService: ChallengingService
  onSubmit: (url: string, challengeId: string) => Promise<string | null>
}

export function useChallengeSourceForm({ challengingService, onSubmit }: Params) {
  const [isOpen, setIsOpen] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const debouncedSearch = useDebounce(search, 500)

  const form = useForm<FormData>({
    resolver: zodResolver(challengeSourceSchema),
    defaultValues: {
      challengeId: '',
      url: '',
    },
  })

  const {
    data: challengesResponse,
    isLoading,
    isRefetching,
  } = useFetch({
    key: 'challenge-source-form-challenges',
    dependencies: [isOpen, debouncedSearch, page, itemsPerPage],
    isEnabled: isOpen,
    fetcher: async () =>
      await challengingService.fetchChallengesList({
        page: OrdinalNumber.create(page),
        itemsPerPage: OrdinalNumber.create(itemsPerPage),
        categoriesIds: IdsList.create([]),
        completionStatus: ChallengeCompletionStatus.create('any'),
        difficulty: ChallengeDifficulty.create('any'),
        upvotesCountOrder: ListingOrder.create('any'),
        downvoteCountOrder: ListingOrder.create('any'),
        completionCountOrder: ListingOrder.create('any'),
        postingOrder: ListingOrder.create('descending'),
        shouldIncludePrivateChallenges: Logical.create(true),
        shouldIncludeOnlyAuthorChallenges: Logical.create(false),
        shouldIncludeStarChallenges: Logical.create(false),
        title: Text.create(debouncedSearch),
        userId: null,
      }),
  })

  const challenges = challengesResponse?.items ?? []
  const totalItemsCount = challengesResponse?.totalItemsCount ?? 0
  const totalPages = Math.max(1, Math.ceil(totalItemsCount / itemsPerPage))
  const selectedChallengeId = form.watch('challengeId')

  const selectedChallenge = useMemo(() => {
    return challenges.find((challenge) => challenge.id === selectedChallengeId)
  }, [challenges, selectedChallengeId])

  async function handleSubmit(values: FormData) {
    setSubmitError('')
    const error = await onSubmit(values.url, values.challengeId)

    if (error) {
      setSubmitError(error)
      return
    }

    form.reset({
      challengeId: '',
      url: '',
    })
    setIsOpen(false)
    setSearch('')
    setPage(1)
  }

  function handleOpenChange(nextIsOpen: boolean) {
    setIsOpen(nextIsOpen)

    if (!nextIsOpen) {
      setSubmitError('')
      setSearch('')
      setPage(1)
      form.reset({
        challengeId: '',
        url: '',
      })
    }
  }

  function handleSelectChallenge(challengeId: string) {
    form.setValue('challengeId', challengeId, {
      shouldValidate: true,
    })
  }

  function handleSearchChange(value: string) {
    setSearch(value)
    setPage(1)
  }

  function handleNextPage() {
    if (page < totalPages) {
      setPage(page + 1)
    }
  }

  function handlePrevPage() {
    if (page > 1) {
      setPage(page - 1)
    }
  }

  function handlePageChange(nextPage: number) {
    setPage(nextPage)
  }

  function handleItemsPerPageChange(nextItemsPerPage: number) {
    setItemsPerPage(nextItemsPerPage)
    setPage(1)
  }

  return {
    form,
    isOpen,
    search,
    challenges,
    totalPages,
    totalItemsCount,
    page,
    itemsPerPage,
    submitError,
    selectedChallenge,
    selectedChallengeId,
    isLoading: isLoading || isRefetching,
    onDialogChange: handleOpenChange,
    onSearchChange: handleSearchChange,
    onSelectChallenge: handleSelectChallenge,
    onNextPage: handleNextPage,
    onPrevPage: handlePrevPage,
    onPageChange: handlePageChange,
    onItemsPerPageChange: handleItemsPerPageChange,
    onSubmit: form.handleSubmit(handleSubmit),
  }
}
