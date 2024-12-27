import { usePathname, useRouter, useSearchParams } from 'next/navigation'

export function useQueryParams() {
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const { replace } = useRouter()

  function set(key: string, value: string) {
    const params = new URLSearchParams(searchParams)

    params.set(key, value)
    replace(`${pathname}?${params.toString()}`)
  }

  function get(key: string) {
    return searchParams.get(key)
  }

  function getAll() {
    const values: string[] = []

    searchParams.forEach((value) => {
      values.push(value)
    })

    return values
  }

  function remove(key: string) {
    const params = new URLSearchParams(searchParams)

    params.delete(key)
    replace(`${pathname}?${params.toString()}`)
  }

  return {
    set,
    get,
    getAll,
    remove,
  }
}
