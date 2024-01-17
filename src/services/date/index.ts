import { DateProvider } from '@/providers/dateProvider'

const dateProvider = DateProvider()

export function useDate() {
  return dateProvider
}
