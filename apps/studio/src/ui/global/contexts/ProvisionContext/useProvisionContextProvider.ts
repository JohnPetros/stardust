import { useMemo } from 'react'

import { S3SignedFileStorageProvider } from '@/provision/storage'
import type { ProvisionContextValue } from './types/ProvisionContextValue'

export function useProvisionContextProvider(): ProvisionContextValue {
  return useMemo(
    () => ({
      signedFileStorageProvider: S3SignedFileStorageProvider(),
    }),
    [],
  )
}
