import { useMemo } from 'react'

import { SupabaseSignedFileStorageProvider } from '@/provision/storage'
import type { ProvisionContextValue } from './types/ProvisionContextValue'

export function useProvisionContextProvider(): ProvisionContextValue {
  return useMemo(
    () => ({
      signedFileStorageProvider: SupabaseSignedFileStorageProvider(),
    }),
    [],
  )
}
