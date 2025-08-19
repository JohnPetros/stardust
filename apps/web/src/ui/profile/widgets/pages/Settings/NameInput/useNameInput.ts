import { useState } from 'react'

import type { ProfileService } from '@stardust/core/profile/interfaces'
import type { User } from '@stardust/core/profile/entities'
import { Name } from '@stardust/core/global/structures'
import { ValidationError } from '@stardust/core/global/errors'

type Props = {
  profileService: ProfileService
  defaultValue: string
  user: User | null
  updateUser: (user: User) => Promise<void>
}

export function useNameInput({ profileService, defaultValue, user, updateUser }: Props) {
  const [isEditing, setIsEditing] = useState(false)
  const [value, setValue] = useState(defaultValue)
  const [errorMessage, setErrorMessage] = useState('')
  const [savedValue, setSavedValue] = useState(defaultValue)

  function handleEditButtonClick() {
    setIsEditing(true)
    setErrorMessage('')
  }

  async function handleSaveButtonClick() {
    if (!user) return

    setIsEditing(false)
    user.name = Name.create(value)
    await updateUser(user)
    setSavedValue(value)
  }

  function handleCancelButtonClick() {
    setIsEditing(false)
    setErrorMessage('')
    setValue(savedValue)
  }

  async function handleChange(value: string) {
    setErrorMessage('')

    try {
      const name = Name.create(value)

      if (savedValue !== value) {
        const response = await profileService.verifyUserNameInUse(name)

        if (response.isFailure) {
          setErrorMessage(response.errorMessage)
        }
      }
    } catch (error) {
      if (error instanceof ValidationError) {
        setErrorMessage(error.fieldErrors[0].messages[0])
      }
    } finally {
      setValue(value)
    }
  }

  return {
    isEditing,
    value,
    errorMessage,
    handleEditButtonClick,
    handleSaveButtonClick,
    handleChange,
    handleCancelButtonClick,
  }
}
