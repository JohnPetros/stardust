import { useEffect, useState } from 'react'

import type { SolutionDto } from '@stardust/core/challenging/dtos'
import { Solution } from '@stardust/core/challenging/entities'

import { useAuthContext } from '@/ui/auth/contexts/AuthContext'
import { useRouter } from '@/ui/global/hooks/useRouter'
import { ROUTES, STORAGE } from '@/constants'
import { useLocalStorage } from '@/ui/global/hooks/useLocalStorage'
import { usePostSolutionAction } from './usePostSolutionAction'
import { useEditSolutionAction } from './useEditSolutionAction'

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
  const { user } = useAuthContext()
  const [isSuccess, setIsSuccess] = useState(false)
  const [solutionTitle, setSolutionTitle] = useState(solution?.title.value ?? '')
  const [solutionContent, setSolutionContent] = useState(solution?.content.value ?? '')
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({
    solutionTitle: '',
    solutionContent: '',
  })
  const { goTo } = useRouter()
  const { isPosting, postSolution } = usePostSolutionAction({
    onSuccess: (newSolution) => handleActionSuccess(newSolution, true),
    onError: handleActionError,
  })
  const { isEditing, editSolution } = useEditSolutionAction({
    onSuccess: (solution) => handleActionSuccess(solution, false),
    onError: handleActionError,
  })
  const localStorage = useLocalStorage(STORAGE.keys.challengeCode(challengeId))

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

  function handleActionSuccess(solution: Solution, isNew: boolean) {
    setSolution(solution)
    setIsSuccess(true)
    goTo(
      ROUTES.challenging.challenges.challengeSolutions.solution(
        challengeSlug,
        solution.slug.value.concat(isNew ? '?isNew=true' : ''),
      ),
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
      authorId: user.id.value,
      challengeId,
    })
  }

  async function handleSolutionEdit() {
    if (!solution) return

    await editSolution({
      solutionId: solution.id.value,
      solutionTitle,
      solutionContent,
    })
  }

  useEffect(() => {
    const storageSolutionContent = localStorage.get()
    if (!solutionContent && storageSolutionContent)
      setSolutionContent(`# Abordagem
Descreva passo a passo como você chegou na sua solução.

## Código
<Code>
${storageSolutionContent}    
</Code>`)
  }, [solutionContent, localStorage.get])

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
