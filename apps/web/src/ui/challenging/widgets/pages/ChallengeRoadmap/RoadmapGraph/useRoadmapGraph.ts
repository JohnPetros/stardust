'use client'

import { useCallback, useEffect, useRef } from 'react'
import { useReactFlow, type Viewport } from '@xyflow/react'

type Storage = { get: () => Viewport | null; set: (value: Viewport) => void }

type Params = { storage: Storage }

export function useRoadmapGraph({ storage }: Params) {
  const reactFlow = useReactFlow()
  const restored = useRef(false)

  useEffect(() => {
    if (restored.current) return
    restored.current = true
    const viewport = storage.get()
    if (viewport) reactFlow.setViewport(viewport)
    else reactFlow.fitView({ padding: 0.25, duration: 0 })
  }, [reactFlow, storage])

  const handleMoveEnd = useCallback(
    (_: unknown, viewport: Viewport) => storage.set(viewport),
    [storage],
  )
  return { onMoveEnd: handleMoveEnd }
}
