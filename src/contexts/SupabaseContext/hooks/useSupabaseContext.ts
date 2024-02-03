import { useContext } from 'react'

import { SupabaseContext } from '..'

export const useSupabaseContext = () => {
  const context = useContext(SupabaseContext)

  if (context === undefined) {
    throw new Error(
      'useSupabaseContext hook must be used inside SupabaseProvider'
    )
  } else {
    return context
  }
}
