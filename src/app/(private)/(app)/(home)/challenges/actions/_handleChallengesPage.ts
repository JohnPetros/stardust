import type { Category } from '@/@types/Category'
import { ICategoriesController } from '@/services/api/interfaces/ICategoriesController'
import { APP_ERRORS } from '@/global/constants'

let categories: Category[]

export async function _handleChalengesPage(
  categoriesController: ICategoriesController
) {
  try {
    categories = await categoriesController.getCategories()
    return categories
  } catch (error) {
    console.error(error)
    throw new Error(APP_ERRORS.categories.failedFetching)
  }
}
