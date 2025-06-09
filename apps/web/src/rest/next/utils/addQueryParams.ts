export function addQueryParams(url: string, params: Record<string, string>) {
  if (!Object.values(params).length) return url

  const urlParams: string[] = []

  for (const [key, value] of Object.entries(params)) {
    if (key.includes('[]') && value) {
      const values = value.split(',')
      values.concat(values).forEach((value) => {
        urlParams.push(`${key.replace('[]', '')}=${value}`)
      })
    } else {
      urlParams.push(`${key}=${value}`)
    }
  }

  return `${url}?${urlParams.join('&')}`
}
