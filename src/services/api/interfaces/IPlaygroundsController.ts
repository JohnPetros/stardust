import type { Playground } from '@/@types/playground'

export interface IPlaygroundsController {
  getPlaygroundsByUserId(userId: string): Promise<Playground[]>
  deletePlaygroundById(id: string): Promise<void>
  updatePlaygroundTitleById(title: string, id: string): Promise<void>
}
