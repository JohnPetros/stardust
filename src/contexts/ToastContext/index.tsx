'use client'

import { createContext, ReactNode } from 'react'
import { Provider, Viewport } from '@radix-ui/react-toast'

import { Toast } from './components/Toast'
import { useToastProvider } from './hooks/useToastProvider'
import type { ToastContextValue } from './types/ToastContextValue'

type ToastContextProps = {
  children: ReactNode
}

export const ToastContext = createContext({} as ToastContextValue)

export function ToastProvider({ children }: ToastContextProps) {
  const { toastRef, showToast } = useToastProvider()

  return (
    <ToastContext.Provider value={{ show: showToast }}>
      <Provider swipeDirection="right">
        <Viewport className="right-4 top-4 z-[1000] flex max-w-[90vw] rounded" />
        <Toast ref={toastRef} />
        {children}
      </Provider>
    </ToastContext.Provider>
  )
}
