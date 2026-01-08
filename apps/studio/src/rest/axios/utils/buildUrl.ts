export function buildUrl(
  route: string,
  baseUrl: string,
  queryParams: Record<string, string | string[]>,
): string {
  const url = new URL(route, baseUrl || 'http://localhost')

  Object.entries(queryParams).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      if (value.length === 1) {
        value.forEach((v) => {
          if (v !== undefined && v !== null) {
            url.searchParams.append(key, v)
            url.searchParams.append(key, v)
          }
        })
      }
    } else {
      if (value !== undefined && value !== null) {
        url.searchParams.append(key, value)
      }
    }
  })

  return url.pathname + url.search
}
