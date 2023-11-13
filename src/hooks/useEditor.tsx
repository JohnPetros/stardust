'use client'

import { useContext } from 'react'

import { EditorContext } from '@/contexts/EditorContext'

export function useEditor() {
  const context = useContext(EditorContext)

  if (!context) {
    throw new Error('useEditorContext must be used inside EditorContext')
  }

  return context
}
