'use client'

import { useCallback, type RefObject } from 'react'

import type { OpenToastParams } from '../types/OpenToastParams'
import type { ToastRef } from '../types/ToastRef'

const DEFAULT_DURATION_IN_SECONDS = 2.5

export function useToastProvider(toastRef: RefObject<ToastRef | null>) {
  const showToast = useCallback(
    (message: string, options?: Partial<Omit<OpenToastParams, 'message'>>) => {
      toastRef.current?.open({
        message,
        type: options?.type ?? 'error',
        seconds: options?.seconds ?? DEFAULT_DURATION_IN_SECONDS,
      })
    },
    [toastRef.current?.open],
  )

  const showSuccess = useCallback(
    (message: string, durationInSeconds = DEFAULT_DURATION_IN_SECONDS) => {
      toastRef.current?.open({
        message,
        type: 'success',
        seconds: durationInSeconds,
      })
    },
    [toastRef.current?.open],
  )

  const showError = useCallback(
    (message: string, durationInSeconds = DEFAULT_DURATION_IN_SECONDS) => {
      toastRef.current?.open({
        message,
        type: 'error',
        seconds: durationInSeconds,
      })
    },
    [toastRef.current?.open],
  )

  return { toastRef, showToast, showSuccess, showError }
}
