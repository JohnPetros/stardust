import { useContext } from 'react'

import { SpaceContext } from '..'

export function useSpaceContext() {
  const context = useContext(SpaceContext)

  if (!context) {
    throw new Error('useSpaceContext must be used inside SpaceProvider')
  }

  return context
}
