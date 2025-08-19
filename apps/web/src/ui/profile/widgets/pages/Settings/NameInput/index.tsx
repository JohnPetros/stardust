'use client'

import { useAuthContext } from '@/ui/global/hooks/useAuthContext'
import { NameInputView } from './NameInputView'
import { useNameInput } from './useNameInput'
import { useRest } from '@/ui/global/hooks/useRest'

type Props = {
  defaultValue: string
}

export const NameInput = ({ defaultValue }: Props) => {
  const { user, updateUser } = useAuthContext()
  const { profileService } = useRest()
  const {
    isEditing,
    value,
    errorMessage,
    handleEditButtonClick,
    handleSaveButtonClick,
    handleCancelButtonClick,
    handleChange,
  } = useNameInput({ profileService, defaultValue, user, updateUser })

  return (
    <NameInputView
      value={value}
      errorMessage={errorMessage}
      isEditing={isEditing}
      onChange={handleChange}
      onEditButtonClick={handleEditButtonClick}
      onSaveButtonClick={handleSaveButtonClick}
      onCancelButtonClick={handleCancelButtonClick}
    />
  )
}
