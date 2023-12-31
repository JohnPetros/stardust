'use client'

import { useState } from 'react'

import { useAuth } from '@/contexts/AuthContext'
import { useToast } from '@/contexts/ToastContext'
import { passwordSchema } from '@/libs/zod'

export function useResetPasswordDialog() {
  const { resetPassword } = useAuth()

  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const toast = useToast()

  function handlePasswordChange(value: string) {
    setPassword(value)
    setError('')
  }

  async function handleSubmit() {
    try {
      setIsLoading(true)
      const passwordValidation = passwordSchema.safeParse(password)

      if (passwordValidation.success) {
        await resetPassword(password)

        toast.show('Senha redefinida com sucesso!', { seconds: 5 })
      } else {
        console.log(passwordValidation.error.errors)
        setError('e-mail inválido')
      }
    } catch (error) {
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  return {
    isLoading,
    password,
    error,
    handleSubmit,
    handlePasswordChange,
  }
}
