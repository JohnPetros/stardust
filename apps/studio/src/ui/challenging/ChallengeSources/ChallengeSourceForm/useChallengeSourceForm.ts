import { zodResolver } from '@hookform/resolvers/zod'
import {
  ChallengeCompletionStatus,
  ChallengeDifficulty,
  ChallengeIsNewStatus,
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
import { useEffect, useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import type { z } from 'zod'

import { useDebounce } from '@/ui/global/hooks/useDebounce'
import { useFetch } from '@/ui/global/hooks/useFetch'

type FormData = z.infer<typeof challengeSourceSchema>

type Params = {
  challengingService: ChallengingService
  challengeSourceId?: string
  initialValues?: {
    url: string
    challengeId?: string | null
    challengeTitle?: string | null
  }
  onCreate: (url: string, challengeId?: string) => Promise<string | null>
  onUpdate: (
    challengeSourceId: string,
    url: string,
    challengeId: string | undefined,
  ) => Promise<string | null>
}

export function useChallengeSourceForm({
  challengingService,
  challengeSourceId,
  initialValues,
  onCreate,
  onUpdate,
}: Params) {
  const isEditing = Boolean(challengeSourceId)
  const [isOpen, setIsOpen] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const debouncedSearch = useDebounce(search, 500)

  const form = useForm<FormData>({
    resolver: zodResolver(challengeSourceSchema),
    defaultValues: {
      challengeId: undefined,
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
        isNewStatus: ChallengeIsNewStatus.create('all'),
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

  const selectedChallengeTitle =
    selectedChallenge?.title ??
    (selectedChallengeId === initialValues?.challengeId
      ? (initialValues?.challengeTitle ?? null)
      : null)

  async function handleSubmit(values: FormData) {
    setSubmitError('')

    const error = isEditing
      ? await onUpdate(
          challengeSourceId as string,
          values.url,
          values.challengeId ?? undefined,
        )
      : await onCreate(values.url, values.challengeId ?? undefined)

    if (error) {
      setSubmitError(error)
      return
    }

    form.reset({
      challengeId: undefined,
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
        challengeId: undefined,
        url: '',
      })
      return
    }

    form.reset({
      challengeId: initialValues?.challengeId ?? undefined,
      url: initialValues?.url ?? '',
    })
  }

  function handleSelectChallenge(challengeId: string) {
    form.setValue('challengeId', challengeId, {
      shouldValidate: true,
    })
  }

  function handleClearChallenge() {
    form.setValue('challengeId', undefined, {
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

  useEffect(() => {
    if (!isOpen) {
      return
    }

    form.reset({
      challengeId: initialValues?.challengeId ?? undefined,
      url: initialValues?.url ?? '',
    })
  }, [form, initialValues, isOpen])

  return {
    form,
    isEditing,
    isOpen,
    search,
    challenges,
    totalPages,
    totalItemsCount,
    page,
    itemsPerPage,
    submitError,
    selectedChallengeTitle,
    selectedChallengeId,
    isLoading: isLoading || isRefetching,
    onDialogChange: handleOpenChange,
    onSearchChange: handleSearchChange,
    onSelectChallenge: handleSelectChallenge,
    onClearChallenge: handleClearChallenge,
    onNextPage: handleNextPage,
    onPrevPage: handlePrevPage,
    onPageChange: handlePageChange,
    onItemsPerPageChange: handleItemsPerPageChange,
    onSubmit: form.handleSubmit(handleSubmit),
  }
}
