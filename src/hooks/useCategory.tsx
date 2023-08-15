'use client'
import { useApi } from '@/services/api'
import useSWR from 'swr'

export function useCategory() {
  const api = useApi()
  const { data: categories, error } = useSWR('/categories', api.getCategories)

  if (error) {
    throw new Error(error)
  }

  console.log(categories)

  return {
    categories,
  }
}
