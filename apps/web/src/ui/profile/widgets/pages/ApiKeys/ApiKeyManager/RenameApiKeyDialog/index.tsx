'use client'

import type { PropsWithChildren } from 'react'
import { useCallback, useState } from 'react'
import { RenameApiKeyDialogView } from './RenameApiKeyDialogView'

type Props = {
  apiKeyId: string
  defaultName: string
  isRenaming: boolean
  onRenameApiKey: (apiKeyId: string, name: string) => Promise<boolean>
}

export const RenameApiKeyDialog = ({
  children,
  apiKeyId,
  defaultName,
  isRenaming,
  onRenameApiKey,
}: PropsWithChildren<Props>) => {
  const [isOpen, setIsOpen] = useState(false)
  const [name, setName] = useState(defaultName)
  const [errorMessage, setErrorMessage] = useState('')

  const handleOpenChange = useCallback(
    (nextIsOpen: boolean) => {
      setIsOpen(nextIsOpen)

      if (nextIsOpen) {
        setName(defaultName)
        setErrorMessage('')
      }
    },
    [defaultName],
  )

  const handleRenameClick = useCallback(async () => {
    const parsedName = name.trim()

    if (!parsedName) {
      setErrorMessage('Nome obrigatório')
      return
    }

    setErrorMessage('')
    const response = await onRenameApiKey(apiKeyId, parsedName)

    if (!response) {
      return
    }

    setIsOpen(false)
  }, [apiKeyId, name, onRenameApiKey])

  return (
    <RenameApiKeyDialogView
      isOpen={isOpen}
      name={name}
      errorMessage={errorMessage}
      isRenaming={isRenaming}
      onOpenChange={handleOpenChange}
      onNameChange={setName}
      onRenameClick={handleRenameClick}
    >
      {children}
    </RenameApiKeyDialogView>
  )
}
