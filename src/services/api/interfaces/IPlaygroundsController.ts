import type { Playground } from '@/@types/Playground'

export interface IPlaygroundsController {
  getPlaygroundById(id: string): Promise<Playground>
  getPlaygroundsByUserSlug(userSlug: string): Promise<Playground[]>
  addPlayground(newPlayground: Partial<Playground>): Promise<void>
  updatePlaygroundCodeById(code: string, id: string): Promise<void>
  updatePlaygroundTitleById(title: string, id: string): Promise<void>
  updatePublicPlaygroundById(isOpen: boolean, id: string): Promise<void>
  deletePlaygroundById(id: string): Promise<void>
}
