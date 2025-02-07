import { useEffect, useState } from 'react'

import type { SolutionDto } from '@stardust/core/challenging/dtos'
import { Solution } from '@stardust/core/challenging/entities'

import { useChallengeStore } from '@/ui/challenging/stores/ChallengeStore'
import { useAuthContext } from '@/ui/auth/contexts/AuthContext'
import { useToastContext } from '@/ui/global/contexts/ToastContext'
import { usePostSolutionAction } from './usePostSolutionAction'
import { useEditSolutionAction } from './useEditSolutionAction'
import { useRouter } from '@/ui/global/hooks/useRouter'
import { ROUTES } from '@/constants'

type FieldErrors = {
  solutionTitle: string
  solutionContent: string
}

export function useSolutionPage(
  savedSolutionDto: SolutionDto | null,
  challengeId: string,
  challengeSlug: string,
) {
  const [solution, setSolution] = useState<Solution | null>(
    savedSolutionDto ? Solution.create(savedSolutionDto) : null,
  )
  const { getSolutionContentSlice } = useChallengeStore()
  const { solutionContent, setSolutionContent } = getSolutionContentSlice()
  const { user } = useAuthContext()
  const [isSuccess, setIsSuccess] = useState(false)
  const [solutionTitle, setSolutionTitle] = useState(solution?.title.value ?? '')
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({
    solutionTitle: '',
    solutionContent: '',
  })
  const { goTo } = useRouter()
  const { isPosting, postSolution } = usePostSolutionAction({
    onSuccess: handleActionSuccess,
    onError: handleActionError,
  })
  const { isEditing, editSolution } = useEditSolutionAction({
    onSuccess: handleActionSuccess,
    onError: handleActionError,
  })

  function handleTitleChange(title: string) {
    setFieldErrors({
      solutionTitle: '',
      solutionContent: '',
    })
    setIsSuccess(false)
    setSolutionTitle(title)
  }

  function handleContentChange(content: string) {
    setFieldErrors({
      solutionTitle: '',
      solutionContent: '',
    })
    setSolutionContent(content)
  }

  function handleActionSuccess(solution: Solution) {
    setSolution(solution)
    setIsSuccess(true)
    goTo(
      `${ROUTES.challenging.challenges.challengeSolutions.solution(
        challengeSlug,
        solution.slug.value,
      )}?isNew=true`,
    )
  }

  function handleActionError(solutionTitleError: string, solutionContentError: string) {
    setFieldErrors({
      solutionTitle: solutionTitleError,
      solutionContent: solutionContentError,
    })
  }

  async function handleSolutionPost() {
    if (!user) return

    await postSolution({
      solutionTitle,
      solutionContent,
      authorId: user.id,
      challengeId,
    })
  }

  async function handleSolutionEdit() {
    if (!solution) return

    await editSolution({
      solutionId: solution.id,
      solutionTitle,
      solutionContent,
    })
  }

  useEffect(() => {
    if (solution) setSolutionContent(solution.content.value)
  }, [solution, setSolutionContent])

  return {
    solution,
    solutionTitle,
    solutionContent,
    isActionDisable: !solutionTitle || !solutionContent,
    canExecute:
      solution?.title.value !== solutionTitle ||
      solution?.content.value !== solutionContent,
    isFailure: Boolean(fieldErrors.solutionTitle) || Boolean(fieldErrors.solutionContent),
    isExecuting: isPosting || isEditing,
    isSuccess,
    fieldErrors,
    handleTitleChange,
    handleContentChange,
    handleSolutionPost,
    handleSolutionEdit,
  }
}
