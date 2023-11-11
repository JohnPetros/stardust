'use client'
import useSWR from 'swr'

import { useApi } from '@/services/api'

export function useCategory() {
  const api = useApi()
  const { data: categories, error } = useSWR('/categories', api.getCategories)

  if (error) {
    throw new Error(error)
  }

  return {
    categories,
  }
}
