'use client'

import { useCallback, useRef } from 'react'

import { OpenToastParams } from '../types/OpenToastParams'
import { ToastRef } from '../types/ToastRef'

export function useToastProvider() {
  const toastRef = useRef<ToastRef | null>(null)

  const showToast = useCallback(
    (message: string, options?: Partial<Omit<OpenToastParams, 'message'>>) => {
      toastRef.current?.open({
        message,
        type: options?.type ?? 'success',
        seconds: options?.seconds ?? 2.5,
      })
    },
    []
  )

  return { toastRef, showToast }
}
