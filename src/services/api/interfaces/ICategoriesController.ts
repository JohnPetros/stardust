import type { Category } from '@/@types/category'

export interface ICategoriesController {
  getCategories(challengeId: string): Promise<Category[]>
}
