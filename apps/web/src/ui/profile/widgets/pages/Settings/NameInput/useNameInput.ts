import { useState } from 'react'

import type { ProfileService } from '@stardust/core/profile/interfaces'

export function useNameInput(profileService: ProfileService, defaultValue: string) {
  const [isEditing, setIsEditing] = useState(false)
  const [value, setValue] = useState(defaultValue)

  function handleEditButtonClick() {
    setIsEditing(true)
  }

  function handleSaveButtonClick() {
    setIsEditing(false)
  }

  function handleCancelButtonClick() {
    setIsEditing(false)
  }

  function handleChange(value: string) {
    // setValue(value)
  }

  console.log(defaultValue)
  console.log(value)

  return {
    isEditing,
    value,
    handleEditButtonClick,
    handleSaveButtonClick,
    handleChange,
    handleCancelButtonClick,
  }
}
