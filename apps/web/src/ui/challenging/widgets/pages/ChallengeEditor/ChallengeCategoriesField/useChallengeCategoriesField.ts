import { useFieldArray, useFormContext } from 'react-hook-form'

import type { ChallengeSchema } from '@stardust/validation/challenging/types'

export function useChallengeCategoriesField() {
  const { control, formState, watch } = useFormContext<ChallengeSchema>()
  const { append, remove, replace } = useFieldArray({
    control,
    name: 'categories',
  })
  const selectedCategories = watch('categories')

  function handleSelecButtonClick(categoryId: string, categoryName: string) {
    append({ id: categoryId, name: categoryName })
  }

  function handleUnselectCategoryButtonClick(categoryId: string) {
    const updatedSelectedCategories = selectedCategories.filter(
      (category) => category.id !== categoryId,
    )
    replace(updatedSelectedCategories)
  }

  return {
    selectedCategoriesIds: selectedCategories.map((category) => category.id),
    errorMessage: formState.errors.categories?.message,
    handleSelecButtonClick,
    handleUnselectCategoryButtonClick,
  }
}
