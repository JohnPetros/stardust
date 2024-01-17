'use client'

import { useMemo } from 'react'

import { MdxController } from './controllers/mdxController'

export function useServerApi() {
  const serverApi = useMemo(() => {
    return {
      ...MdxController(),
    }
  }, [])

  return serverApi
}
