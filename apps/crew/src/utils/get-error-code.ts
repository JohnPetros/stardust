type ErrorWithCode = {
  code?: unknown
  details?: { code?: unknown }
  cause?: { code?: unknown }
} | null

export function getErrorCode(error: unknown): string | undefined {
  const candidate = error as ErrorWithCode

  return [candidate?.details?.code, candidate?.code, candidate?.cause?.code].find(
    (value): value is string => typeof value === 'string',
  )
}
