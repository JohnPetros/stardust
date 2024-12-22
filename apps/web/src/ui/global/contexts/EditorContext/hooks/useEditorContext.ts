'use client'

import { useContext } from 'react'

import { AppError } from '@stardust/core/global/errors'

import { EditorContext } from '..'

export function useEditorContext() {
  const context = useContext(EditorContext)

  if (!context) {
    throw new AppError('useEditorContext must be used inside EditorContext')
  }

  return context
}
