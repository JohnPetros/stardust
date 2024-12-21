'use client'

import { useContext } from 'react'

import { AuthContext } from '..'

export function useAuthContext() {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider')
  }

  return context
}
