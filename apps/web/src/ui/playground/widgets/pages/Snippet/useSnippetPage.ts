'use client'

import { type RefObject, useEffect, useState } from 'react'
import z from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import type { SnippetDto } from '@stardust/core/playground/dtos'

import type { PlaygroundCodeEditorRef } from '@/ui/global/widgets/components/PlaygroundCodeEditor/types'
import { useWindowSize } from '@/ui/global/hooks/useWindowSize'
import { useAuthContext } from '@/ui/auth/contexts/AuthContext'
import { Snippet } from '@stardust/core/playground/entities'
import { useEditSnippetAction } from '@/ui/playground/hooks/useEditSnippetAction'
import { useCreateSnippetAction } from '@/ui/playground/hooks/useCreateSnippetAction'
import {
  booleanSchema,
  idSchema,
  stringSchema,
  titleSchema,
} from '@stardust/validation/global/schemas'
import type { AlertDialogRef } from '@/ui/global/widgets/components/AlertDialog/types'
import { useRouter } from '@/ui/global/hooks'
import { ROUTES } from '@/constants'

const snippetSchema = z.object({
  snippetId: idSchema,
  snippetTitle: titleSchema,
  snippetCode: stringSchema,
  isSnippetPublic: booleanSchema.default(true),
})

type SnippetSchema = z.infer<typeof snippetSchema>

type UseSnippetPageParams = {
  playgroudCodeEditorRef: RefObject<PlaygroundCodeEditorRef>
  authAlertDialogRef: RefObject<AlertDialogRef>
  snippetDto?: SnippetDto
}

export function useSnippetPage({
  snippetDto,
  playgroudCodeEditorRef,
  authAlertDialogRef,
}: UseSnippetPageParams) {
  const snippet = snippetDto ? Snippet.create(snippetDto) : null
  const [snippetErrors, setSnippetErrors] = useState({ title: '', code: '' })
  const [isActionSuccess, setIsActionSuccess] = useState(false)
  const [isActionFailure, setIsActionFailure] = useState(false)
  const [isUserSnippetAuthor, setIsUserSnippetAuthor] = useState(false)
  const { user } = useAuthContext()
  const { editSnippet, isEditing } = useEditSnippetAction({
    onSuccess: handleActionSuccess,
    onError: handleActionError,
  })
  const { createSnippet, isCreating } = useCreateSnippetAction({
    onSuccess: handleActionSuccess,
    onError: handleActionError,
  })
  const { control, formState, getValues, reset, watch } = useForm<SnippetSchema>({
    resolver: zodResolver(snippetSchema),
    defaultValues: {
      snippetId: snippet?.id,
      snippetTitle: snippet?.title.value ?? Snippet.DEFEAULT_TITLE,
      snippetCode: snippet?.code.value ?? '',
      isSnippetPublic: snippet?.isPublic.value ?? true,
    },
  })
  const windowSize = useWindowSize()
  const router = useRouter()
  const formValues = getValues()

  async function handleActionSuccess(snippet: Snippet) {
    setIsUserSnippetAuthor(snippet.isPublic.isTrue)
    reset({
      snippetId: snippet.id,
      snippetTitle: snippet.title.value,
      snippetCode: snippet.code.value,
      isSnippetPublic: snippet.isPublic.value,
    })
  }

  async function handleActionError(
    snippetTitleErrorMessage: string,
    snippetCodeErrorMessage: string,
  ) {
    setSnippetErrors({ title: snippetTitleErrorMessage, code: snippetCodeErrorMessage })
    setIsActionFailure(true)
  }

  async function handleActionButtonClick() {
    if (!user) {
      authAlertDialogRef.current?.open()
      return
    }
    setSnippetErrors({ title: '', code: '' })

    const { snippetId, snippetTitle, snippetCode, isSnippetPublic } = getValues()

    const hasSnippet = !snippetId
    if (hasSnippet) {
      await createSnippet({ snippetTitle, snippetCode, isSnippetPublic })
      return
    }

    editSnippet({ snippetId, snippetTitle, snippetCode, isSnippetPublic })
  }

  async function handleRunCode() {
    playgroudCodeEditorRef.current?.runCode()
  }

  function handleAuthAlertDialogConfirm() {
    router.goTo(
      `${ROUTES.auth.signIn}?nextRoute=${ROUTES.playground.snippet(snippet?.id)}`,
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
    setIsUserSnippetAuthor(snippet && user ? snippet.authorId === user.id : false)
  }, [snippet, user])

  return {
    pageHeight: windowSize.height,
    formControl: control,
    snippetErrors,
    snippetId: formValues.snippetId,
    canExecuteAction: formState.isDirty,
    isSnippetPublic: formValues.isSnippetPublic,
    isActionDisabled: formValues.snippetTitle === '' && formValues.snippetCode === '',
    isActionExecuting: isCreating || isEditing,
    isActionFailure,
    isUserSnippetAuthor,
    isActionSuccess,
    handleRunCode,
    handleActionButtonClick,
    handleAuthAlertDialogConfirm,
  }
}
