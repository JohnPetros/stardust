'use client'

import { useMemo } from 'react'

import { CookiesController } from './controllers/cookiesController'
import { MdxController } from './controllers/mdxController'

export function useServerApi() {
  const serverApi = useMemo(() => {
    return {
      ...MdxController(),
      ...CookiesController(),
    }
  }, [])

  return serverApi
}
