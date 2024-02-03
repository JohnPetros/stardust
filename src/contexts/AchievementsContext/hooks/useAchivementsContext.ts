'use client'

import { useContext } from 'react'

import { AchivementsContext } from '..'

export function useAchivementsContext() {
  const context = useContext(AchivementsContext)

  if (!context) {
    throw new Error(
      'useAchivementsContext must be used inside AchivementsContext'
    )
  }

  return context
}
