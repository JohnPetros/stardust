import { useEffect, useState } from 'react'

import type { SolutionDto } from '@stardust/core/challenging/dtos'
import { Solution } from '@stardust/core/challenging/entities'

import { useChallengeStore } from '@/ui/challenging/stores/ChallengeStore'
import { useAuthContext } from '@/ui/auth/contexts/AuthContext'
import { useToastContext } from '@/ui/global/contexts/ToastContext'
import { usePostSolutionAction } from './usePostSolutionAction'
import { useEditSolutionAction } from './useEditSolutionAction'

type FieldErrors = {
  solutionTitle: string
  solutionContent: string
}

export function useSolutionPage(
  savedSolutionDto: SolutionDto | null,
  challengeId: string,
) {
  const [solution, setSolution] = useState<Solution | null>(
    savedSolutionDto ? Solution.create(savedSolutionDto) : null,
  )
  const { getSolutionContentSlice } = useChallengeStore()
  const { solutionContent, setSolutionContent } = getSolutionContentSlice()
  const { user } = useAuthContext()
  const [solutionTitle, setSolutionTitle] = useState(solution?.title.value ?? '')
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({
    solutionTitle: '',
    solutionContent: '',
  })
  const toast = useToastContext()
  const { isPosting, postSolution } = usePostSolutionAction({
    onSuccess: (solution) => {
      setSolution(solution)
      toast.show('Sua solução foi postada', { type: 'success' })
    },
    onError(solutionTitleError, solutionContentError) {
      setFieldErrors({
        solutionTitle: solutionTitleError,
        solutionContent: solutionContentError,
      })
    },
  })
  const { isEditing, editSolution } = useEditSolutionAction({
    onSuccess: (solution) => {
      setSolution(solution)
      toast.show('Sua solução foi editada', { type: 'success' })
    },
    onError(solutionTitleError, solutionContentError) {
      setFieldErrors({
        solutionTitle: solutionTitleError,
        solutionContent: solutionContentError,
      })
    },
  })

  function handleTitleChange(title: string) {
    setSolutionTitle(title)
  }

  function handleContentChange(content: string) {
    setSolutionContent(content)
  }

  async function handleSolutionPost() {
    if (!user) return

    setFieldErrors({
      solutionTitle: '',
      solutionContent: '',
    })

    await postSolution({
      solutionTitle,
      solutionContent,
      authorId: user.id,
      challengeId,
    })
  }

  async function handleSolutionEdit() {
    if (!solution) return

    setFieldErrors({
      solutionTitle: '',
      solutionContent: '',
    })

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
    content: solutionContent,
    canPostSolution: Boolean(solutionTitle && solutionContent),
    isLoading: isPosting || isEditing,
    fieldErrors,
    handleTitleChange,
    handleContentChange,
    handleSolutionPost,
    handleSolutionEdit,
  }
}
