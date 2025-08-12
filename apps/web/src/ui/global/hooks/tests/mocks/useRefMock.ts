import type { RefObject } from 'react'

export function useRefMock<RefData>(refData: RefData) {
  const refMock = {
    current: refData,
  } as unknown as RefObject<RefData>

  return refMock
}
