'use client'

import { createContext, type PropsWithChildren, useRef } from 'react'
import { Provider, Viewport } from '@radix-ui/react-toast'

import { Toast } from './Toast'
import { useToastProvider, useToastContext } from './hooks'
import type { ToastContextValue, ToastRef } from './types'

export const ToastContext = createContext({} as ToastContextValue)

export const ToastContextProvider = ({ children }: PropsWithChildren) => {
  const toastRef = useRef<ToastRef | null>(null)
  const { showToast, showSuccess, showError } = useToastProvider(toastRef)

  return (
    <ToastContext.Provider value={{ show: showToast, showSuccess, showError }}>
      <Provider swipeDirection='right'>
        <Viewport className='right-4 top-4 z-[1000] flex max-w-[90vw] rounded' />
        <Toast ref={toastRef} />
        {children as null}
      </Provider>
    </ToastContext.Provider>
  )
}

export { useToastContext }
