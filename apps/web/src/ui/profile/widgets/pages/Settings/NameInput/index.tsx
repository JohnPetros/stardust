'use client'

import { NameInputView } from './NameInputView'
import { useNameInput } from './useNameInput'
import { useRest } from '@/ui/global/hooks/useRest'

type Props = {
  defaultValue: string
}

export const NameInput = ({ defaultValue }: Props) => {
  const { profileService } = useRest()
  const {
    isEditing,
    value,
    handleEditButtonClick,
    handleSaveButtonClick,
    handleCancelButtonClick,
    handleChange,
  } = useNameInput(profileService, defaultValue)

  return (
    <NameInputView
      value={value}
      isEditing={isEditing}
      onChange={handleChange}
      onEditButtonClick={handleEditButtonClick}
      onSaveButtonClick={handleSaveButtonClick}
      onCancelButtonClick={handleCancelButtonClick}
    />
  )
}
