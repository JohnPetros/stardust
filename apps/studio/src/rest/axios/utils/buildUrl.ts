export function buildUrl(
  route: string,
  baseUrl: string,
  queryParams: Record<string, string | string[]>,
): string {
  const url = new URL(route, baseUrl || 'http://localhost')

  Object.entries(queryParams).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      if (value.length === 1) {
        value.forEach((itemValue) => {
          if (itemValue !== undefined && itemValue !== null) {
            url.searchParams.append(key, itemValue)
            url.searchParams.append(key, itemValue)
          }
        })
      } else if (value.length > 1) {
        url.searchParams.append(key, value[0])
      }
    } else {
      if (value !== undefined && value !== null) {
        url.searchParams.append(key, value)
      }
    }
  })

  return url.pathname + url.search
}
