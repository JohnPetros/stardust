import { renderHook } from '@testing-library/react'
import { ReactFlowProvider } from '@xyflow/react'
import { useRoadmapGraph } from '../useRoadmapGraph'

it('persists the viewport after movement', () => {
  const set = jest.fn()
  const { result } = renderHook(
    () => useRoadmapGraph({ storage: { get: () => null, set } }),
    { wrapper: ReactFlowProvider },
  )
  result.current.onMoveEnd(null, { x: 1, y: 2, zoom: 1 })
  expect(set).toHaveBeenCalledWith({ x: 1, y: 2, zoom: 1 })
})
