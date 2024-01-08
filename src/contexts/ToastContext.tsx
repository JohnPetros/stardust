'use client'

import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useRef,
} from 'react'
import { Provider } from '@radix-ui/react-toast'

import { OpenToastProps, Toast, ToastRef } from '@/app/components/Toast'

export interface ToastContextValue {
  show: (
    message: string,
    options?: Partial<Omit<OpenToastProps, 'message'>>
  ) => void
}

interface ToastContextProps {
  children: ReactNode
}

export const ToastContext = createContext({} as ToastContextValue)

export function ToastProvider({ children }: ToastContextProps) {
  const toastRef = useRef<ToastRef | null>(null)

  function show(
    message: string,
    options?: Partial<Omit<OpenToastProps, 'message'>>
  ) {
    toastRef.current?.open({
      message,
      type: options?.type ?? 'success',
      seconds: options?.seconds ?? 2.5,
    })
  }

  return (
    <ToastContext.Provider value={{ show }}>
      <Provider swipeDirection="right">
        <Toast ref={toastRef} />
        {children}
      </Provider>
    </ToastContext.Provider>
  )
}

export function useToast() {
  const context = useContext(ToastContext)

  if (!context) {
    throw new Error('useToast must be used inside ToastProvider')
  }

  return context
}
