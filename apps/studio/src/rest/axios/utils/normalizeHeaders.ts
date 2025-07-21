export function normalizeHeaders(headers: any): Record<string, string> {
  const result: Record<string, string> = {}
  if (!headers) return result
  for (const [key, value] of Object.entries(headers)) {
    if (typeof value === 'string') {
      result[key] = value
    } else if (Array.isArray(value)) {
      result[key] = value.join(',')
    } else if (value !== undefined && value !== null) {
      result[key] = String(value)
    }
  }
  return result
}
