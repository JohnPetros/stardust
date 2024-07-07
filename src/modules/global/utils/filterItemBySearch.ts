import { removeAccentuation } from './removeAccentuation'

export function filterItemBySearch(search: string, item: string) {
  if (!search) {
    return true
  }
  return removeAccentuation(item)
    .toLowerCase()
    .includes(removeAccentuation(search).toLowerCase())
}
