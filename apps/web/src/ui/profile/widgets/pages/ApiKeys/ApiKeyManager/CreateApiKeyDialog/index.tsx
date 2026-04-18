'use client'

import type { PropsWithChildren } from 'react'
import { useCallback, useState } from 'react'

import type { CreatedApiKey } from '../types'
import { CreateApiKeyDialogView } from './CreateApiKeyDialogView'

type Props = {
  isCreating: boolean
  createdApiKey: CreatedApiKey | null
  onCreateApiKey: (name: string) => Promise<boolean>
  onCreatedApiKeyDialogClose: () => void
  onCopyCreatedApiKeySecret: () => Promise<void>
}

export const CreateApiKeyDialog = ({
  children,
  isCreating,
  createdApiKey,
  onCreateApiKey,
  onCreatedApiKeyDialogClose,
  onCopyCreatedApiKeySecret,
}: PropsWithChildren<Props>) => {
  const [isOpen, setIsOpen] = useState(false)
  const [name, setName] = useState('')
  const [errorMessage, setErrorMessage] = useState('')

  const handleOpenChange = useCallback(
    (nextIsOpen: boolean) => {
      setIsOpen(nextIsOpen)

      if (!nextIsOpen) {
        setName('')
        setErrorMessage('')
        onCreatedApiKeyDialogClose()
      }
    },
    [onCreatedApiKeyDialogClose],
  )

  const handleCreateClick = useCallback(async () => {
    const parsedName = name.trim()
    if (!parsedName) {
      setErrorMessage('Nome obrigatório')
      return
    }

    setErrorMessage('')
    const response = await onCreateApiKey(parsedName)

    if (!response) {
      return
    }

    setName('')
  }, [name, onCreateApiKey])

  return (
    <CreateApiKeyDialogView
      isOpen={isOpen}
      name={name}
      errorMessage={errorMessage}
      isCreating={isCreating}
      createdApiKey={createdApiKey}
      onOpenChange={handleOpenChange}
      onNameChange={setName}
      onCreateClick={handleCreateClick}
      onCopyCreatedApiKeySecret={onCopyCreatedApiKeySecret}
    >
      {children}
    </CreateApiKeyDialogView>
  )
}
