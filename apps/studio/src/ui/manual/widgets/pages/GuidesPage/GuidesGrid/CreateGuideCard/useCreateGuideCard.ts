import { useState } from 'react'

export function useCreateGuideCard() {
  const [isFormOpen, setIsFormOpen] = useState(false)

  return {
    isFormOpen,
    setIsFormOpen,
  }
}
