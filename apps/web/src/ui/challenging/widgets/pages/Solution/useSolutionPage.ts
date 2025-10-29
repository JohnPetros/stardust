import { useEffect, useState } from 'react'

import type { SolutionDto } from '@stardust/core/challenging/entities/dtos'
import { Solution } from '@stardust/core/challenging/entities'
import type { ChallengingService } from '@stardust/core/challenging/interfaces'
import { Text, type Id } from '@stardust/core/global/structures'

import { ROUTES, STORAGE } from '@/constants'
import { useAuthContext } from '@/ui/auth/contexts/AuthContext'
import { useNavigationProvider } from '@/ui/global/hooks/useNavigationProvider'
import { useLocalStorage } from '@/ui/global/hooks/useLocalStorage'
import { useToastContext } from '@/ui/global/contexts/ToastContext'

type FieldErrors = {
  solutionTitle: string
  solutionContent: string
}

type Params = {
  challengingService: ChallengingService
  savedSolutionDto: SolutionDto | null
  challengeId: Id
  challengeSlug: Id
}

export function useSolutionPage({
  challengingService,
  savedSolutionDto,
  challengeId,
  challengeSlug,
}: Params) {
  const [solution, setSolution] = useState<Solution | null>(
    savedSolutionDto ? Solution.create(savedSolutionDto) : null,
  )
  const { user } = useAuthContext()
  const [isSuccess, setIsSuccess] = useState(false)
  const [solutionTitle, setSolutionTitle] = useState(solution?.title.value ?? '')
  const [solutionContent, setSolutionContent] = useState(solution?.content.value ?? '')
  const [isLoading, setIsLoading] = useState(false)
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({
    solutionTitle: '',
    solutionContent: '',
  })
  const { goTo } = useNavigationProvider()
  const toast = useToastContext()
  const localStorage = useLocalStorage(STORAGE.keys.challengeCode(challengeId.value))

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
        challengeSlug.value,
        solution.slug.value.concat(isNew ? '?isNew=true' : ''),
      ),
    )
  }

  async function handleSolutionPost() {
    if (!user) return
    setIsLoading(true)

    const response = await challengingService.postSolution(
      Text.create(solutionTitle),
      Text.create(solutionContent),
      challengeId,
    )

    if (response.isFailure) {
      toast.showError(response.errorMessage)
    }

    if (response.isSuccessful) {
      handleActionSuccess(Solution.create(response.body), true)
    }

    setIsLoading(false)
  }

  async function handleSolutionEdit() {
    if (!solution) return

    const response = await challengingService.editSolution(
      solution.id,
      Text.create(solutionTitle),
      Text.create(solutionContent),
    )

    if (response.isFailure) {
      toast.showError(response.errorMessage)
    }

    if (response.isSuccessful) {
      handleActionSuccess(Solution.create(response.body), false)
    }

    setIsLoading(false)
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
    solutionTitle,
    solutionContent,
    isActionDisable: !solutionTitle || !solutionContent,
    canExecute:
      solution?.title.value !== solutionTitle ||
      solution?.content.value !== solutionContent,
    isFailure: Boolean(fieldErrors.solutionTitle) || Boolean(fieldErrors.solutionContent),
    isExecuting: isLoading,
    isSuccess,
    handleTitleChange,
    handleContentChange,
    handleSolutionPost,
    handleSolutionEdit,
  }
}
