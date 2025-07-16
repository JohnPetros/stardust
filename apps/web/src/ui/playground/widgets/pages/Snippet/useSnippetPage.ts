'use client'

import { type RefObject, useEffect, useState } from 'react'
import z from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import type { SnippetDto } from '@stardust/core/playground/entities/dtos'
import { Snippet } from '@stardust/core/playground/entities'
import {
  booleanSchema,
  idSchema,
  stringSchema,
  titleSchema,
} from '@stardust/validation/global/schemas'
import type { PlaygroundService } from '@stardust/core/playground/interfaces'
import { Name, type Id } from '@stardust/core/global/structures'

import type { PlaygroundCodeEditorRef } from '@/ui/global/widgets/components/PlaygroundCodeEditor/types'
import { useWindowSize } from '@/ui/global/hooks/useWindowSize'
import type { AlertDialogRef } from '@/ui/global/widgets/components/AlertDialog/types'
import { useRouter } from '@/ui/global/hooks/useRouter'
import { ROUTES } from '@/constants'
import { useToastContext } from '@/ui/global/contexts/ToastContext'

const snippetSchema = z.object({
  snippetId: idSchema,
  snippetTitle: titleSchema,
  snippetCode: stringSchema,
  isSnippetPublic: booleanSchema.default(true),
})

type SnippetSchema = z.infer<typeof snippetSchema>

type UseSnippetPageParams = {
  playgroundService: PlaygroundService
  userId?: Id
  playgroudCodeEditorRef: RefObject<PlaygroundCodeEditorRef | null>
  authAlertDialogRef: RefObject<AlertDialogRef | null>
  snippetDto?: SnippetDto
}

export function useSnippetPage({
  playgroundService,
  userId,
  snippetDto,
  playgroudCodeEditorRef,
  authAlertDialogRef,
}: UseSnippetPageParams) {
  const snippet = snippetDto ? Snippet.create(snippetDto) : null
  const [isActionSuccess, setIsActionSuccess] = useState(false)
  const [isActionFailure, setIsActionFailure] = useState(false)
  const [isUserSnippetAuthor, setIsUserSnippetAuthor] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [snippetFieldErrors, setSnippetFieldErrors] = useState<Record<string, string[]>>(
    {},
  )
  const { control, formState, getValues, reset, watch } = useForm<SnippetSchema>({
    resolver: zodResolver(snippetSchema),
    defaultValues: {
      snippetId: snippet?.id.value,
      snippetTitle: snippet?.title.value ?? Snippet.DEFEAULT_TITLE,
      snippetCode: snippet?.code.value ?? '',
      isSnippetPublic: snippet?.isPublic.value ?? true,
    },
  })
  const toast = useToastContext()
  const windowSize = useWindowSize()
  const router = useRouter()
  const formValues = getValues()

  async function handleSnippetCreated(snippet: Snippet) {
    setIsUserSnippetAuthor(snippet.isPublic.isTrue)
    reset({
      snippetId: snippet.id.value,
      snippetTitle: snippet.title.value,
      snippetCode: snippet.code.value,
      isSnippetPublic: snippet.isPublic.value,
    })
  }

  async function handleActionButtonClick() {
    if (!userId) {
      authAlertDialogRef.current?.open()
      return
    }
    setIsLoading(true)

    const { snippetId, snippetTitle, snippetCode, isSnippetPublic } = getValues()

    const hasSnippet = !snippetId
    if (hasSnippet) {
      const response = await playgroundService.createSnippet(
        Snippet.create({
          title: snippetTitle,
          code: snippetCode,
          isPublic: isSnippetPublic,
          author: {
            id: userId.value,
          },
        }),
      )

      if (response.isSuccessful) {
        setIsActionSuccess(true)
        handleSnippetCreated(Snippet.create(response.body))
      }

      if (response.isFailure) {
        setIsActionFailure(true)
        if (response.isValidationFailure) {
          setSnippetFieldErrors({
            snippetTitle: response.getValidationFieldErrors('snippetTitle'),
            snippetCode: response.getValidationFieldErrors('snippetCode'),
          })
        } else toast.showError(response.errorMessage)
      }

      setIsLoading(false)
      return
    }

    let title: Name

    try {
      title = Name.create(snippetTitle)
    } catch (error) {
      setSnippetFieldErrors({
        snippetTitle: ['Título deve conter no mínimo 3 caracteres'],
      })
      setIsActionFailure(true)
      setIsLoading(false)
      return
    }

    const response = await playgroundService.updateSnippet(
      Snippet.create({
        id: snippetId,
        title: title.value,
        code: snippetCode,
        isPublic: isSnippetPublic,
        author: {
          id: userId.value,
        },
      }),
    )

    if (response.isSuccessful) {
      setIsActionSuccess(true)
    }

    if (response.isFailure) {
      setIsActionFailure(true)
      if (response.isValidationFailure) {
        setSnippetFieldErrors({
          snippetTitle: response.getValidationFieldErrors('snippetTitle'),
          snippetCode: response.getValidationFieldErrors('snippetCode'),
        })
      } else toast.showError(response.errorMessage)
    }

    setIsLoading(false)
  }

  async function handleRunCode() {
    playgroudCodeEditorRef.current?.runCode()
  }

  function handleAuthAlertDialogConfirm() {
    router.goTo(
      `${ROUTES.auth.signIn}?nextRoute=${ROUTES.playground.snippet(snippet?.id.value)}`,
    )
  }

  useEffect(() => {
    const subscription = watch(() => {
      setIsActionSuccess(false)
      setIsActionFailure(false)
    })
    return () => subscription.unsubscribe()
  }, [watch])

  useEffect(() => {
    setIsUserSnippetAuthor(
      snippet && userId ? snippet.author.id.value === userId.value : false,
    )
  }, [snippet, userId])

  return {
    pageHeight: windowSize.height,
    formControl: control,
    snippetId: formValues.snippetId,
    canExecuteAction: formState.isDirty,
    isSnippetPublic: formValues.isSnippetPublic,
    isActionDisabled: formValues.snippetTitle === '' && formValues.snippetCode === '',
    isActionExecuting: isLoading,
    snippetFieldErrors,
    isActionFailure,
    isUserSnippetAuthor,
    isActionSuccess,
    handleRunCode,
    handleActionButtonClick,
    handleAuthAlertDialogConfirm,
  }
}
