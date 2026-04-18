import { createHash, randomBytes } from 'node:crypto'

import type { ApiKeySecretProvider } from '@stardust/core/auth/interfaces'

export class NodeCryptoApiKeySecretProvider implements ApiKeySecretProvider {
  generateToken(byteLength: number): string {
    return randomBytes(byteLength).toString('hex')
  }

  hash(value: string): string {
    return createHash('sha256').update(value).digest('hex')
  }
}
