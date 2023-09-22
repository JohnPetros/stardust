import { removeAccentuation } from './removeAccentuation'

export function slugify(title: string) {
  return removeAccentuation(title)
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
}
