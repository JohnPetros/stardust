export function buildUrl(
  route: string,
  baseUrl: string,
  queryParams: Record<string, string | string[]>,
): string {
  const url = new URL(route, baseUrl || 'http://localhost')
  Object.entries(queryParams).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      value.forEach((v) => url.searchParams.append(key, v))
    } else {
      url.searchParams.append(key, value)
    }
  })
  return url.pathname + url.search
}
