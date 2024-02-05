'use client'

import { useEffect, useRef } from 'react'

export function useUnmount(onUnmount: () => void): void {
  const unmountHanlder = useRef(onUnmount)

  unmountHanlder.current = onUnmount

  useEffect(
    () => () => {
      unmountHanlder.current()
    },
    []
  )
}
