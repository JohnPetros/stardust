import type { Category } from '@/@types/Category'

export interface ICategoriesController {
  getCategories(): Promise<Category[]>
}
