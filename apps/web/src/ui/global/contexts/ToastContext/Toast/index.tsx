'use client'

import { type ForwardedRef, forwardRef, useImperativeHandle } from 'react'

import type { ToastRef } from '../types'

import { useToast } from './useToast'
import { ToastView } from './ToastView'

export const ToastComponent = (_: unknown, ref: ForwardedRef<ToastRef>) => {
  const { type, message, seconds, isOpen, scope, open, close, handleDragEnd } = useToast()

  useImperativeHandle(ref, () => {
    return {
      open,
    }
  })

  return (
    <ToastView
      type={type}
      message={message}
      seconds={seconds}
      isOpen={isOpen}
      scope={scope}
      onClose={close}
      onDragEnd={handleDragEnd}
    />
  )
}

export const Toast = forwardRef(ToastComponent)
