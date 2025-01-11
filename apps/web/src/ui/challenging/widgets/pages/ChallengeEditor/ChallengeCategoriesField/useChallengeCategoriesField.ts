import { useFieldArray, useFormContext } from 'react-hook-form'

import type { ChallengeSchema } from '@stardust/validation/challenging/types'

export function useChallengeCategoriesField() {
  const { control } = useFormContext<ChallengeSchema>()
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'categories',
  })

  function handleSelecButtonClick(categoryId: string, categoryName: string) {
    append({ id: categoryId, name: categoryName })
  }

  function handleUnselectCategoryButtonClick(index: number) {
    remove(index)
  }

  return {
    selectedCategories: fields,
    handleSelecButtonClick,
    handleUnselectCategoryButtonClick,
  }
}
