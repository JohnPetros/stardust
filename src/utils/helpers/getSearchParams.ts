export function getSearchParams(url: string, param: string) {
  return new URL(url).searchParams.get(param)
}
