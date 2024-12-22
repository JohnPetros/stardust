import { useContext } from 'react'

import { AppError } from '@stardust/core/global/errors'

import { SupabaseContext } from '..'

export const useSupabaseContext = () => {
  const context = useContext(SupabaseContext)

  if (context === undefined) {
    throw new AppError('useSupabaseContext hook must be used inside SupabaseProvider')
  }

  return context
}
