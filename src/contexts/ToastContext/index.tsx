'use client'

import { createContext, ReactNode, useRef } from 'react'
import { Provider, Viewport } from '@radix-ui/react-toast'

import { Toast } from './components/Toast'
import { useToastProvider } from './hooks/useToastProvider'
import type { ToastContextValue } from './types/ToastContextValue'
import type { ToastRef } from './types/ToastRef'

type ToastContextProps = {
  children: ReactNode
}

export const ToastContext = createContext({} as ToastContextValue)

export function ToastProvider({ children }: ToastContextProps) {
  const toastRef = useRef<ToastRef | null>(null)

  const { show } = useToastProvider()

  return (
    <ToastContext.Provider value={{ show }}>
      <Provider swipeDirection="right">
        <Viewport className="right-4 top-4 z-[1000] flex max-w-[90vw] rounded" />
        <Toast ref={toastRef} />
        {children}
      </Provider>
    </ToastContext.Provider>
  )
}
