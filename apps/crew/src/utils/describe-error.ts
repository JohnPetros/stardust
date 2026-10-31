import { getErrorCode } from '@/utils/get-error-code'

export function describeError(error: unknown): string {
  const candidate = error as { name?: unknown } | null
  const name = typeof candidate?.name === 'string' ? candidate.name : 'unknown error'
  const code = getErrorCode(error)

  return code ? `${name} (code ${code})` : name
}
