import { useState } from 'react'

import type { SolutionDto } from '@stardust/core/challenging/dtos'

import { useChallengeStore } from '@/ui/challenging/stores/ChallengeStore'
import { Solution } from '@stardust/core/challenging/entities'
import { useAuthContext } from '@/ui/auth/contexts/AuthContext'
import { Name, Text } from '@stardust/core/global/structs'
import { ValidationError } from '@stardust/core/global/errors'
import { useApi } from '@/ui/global/hooks'
import { useToastContext } from '@/ui/global/contexts/ToastContext'

type FieldErrors = {
  [key in 'title' | 'content']: string[]
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
  const [title, setTitle] = useState(solution?.title ?? '')
  const { user } = useAuthContext()
  const [fieldErrors, setFieldErrors] = useState<FieldErrors | null>(null)
  const api = useApi()
  const toast = useToastContext()

  function handleTitleChange(title: string) {
    setTitle(title)
  }

  function handleContentChange(content: string) {
    console.log(content)
    setSolutionContent(content)
  }

  async function handleSolutionPost() {
    if (!user) return

    try {
      const solutionTitle = Name.create(title, 'name')
      const solutionContentText = Text.create(solutionContent, 'content')

      const solution = Solution.create({
        title: solutionTitle.value,
        content: solutionContentText.value,
        slug: solutionTitle.slug,
        author: { id: user.id },
      })

      const response = await api.saveSolution(solution, challengeId)

      if (response.isSuccess) {
        setSolution(solution)
        return
      }
      toast.show(response.errorMessage)
    } catch (error) {
      if (error instanceof ValidationError)
        setFieldErrors(error.getErrorsMap<FieldErrors>())
    }
  }

  async function handleSolutionUpdate() {
    if (!solution) return

    try {
      solution.content = solutionContent
      solution.title = title
      const response = await api.updateSolution(solution)
      if (response.isSuccess) {
        setSolution(solution)
        return
      }

      toast.show(response.errorMessage)
    } catch (error) {
      if (error instanceof ValidationError)
        setFieldErrors(error.getErrorsMap<FieldErrors>())
    }
  }

  return {
    solution,
    title,
    content: solutionContent,
    canPostSolution: Boolean(title && solutionContent),
    fieldErrors,
    handleTitleChange,
    handleContentChange,
    handleSolutionPost,
    handleSolutionUpdate,
  }
}
