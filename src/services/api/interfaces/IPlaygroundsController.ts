import type { Playground } from '@/@types/Playground'

export interface IPlaygroundsController {
  getPlaygroundsByUserId(userId: string): Promise<Playground[]>
  getPlaygroundById(id: string): Promise<Playground>
  updatePlaygroundCodeById(code: string, id: string): Promise<void>
  updatePlaygroundTitleById(title: string, id: string): Promise<void>
  updatePublicPlaygroundById(isOpen: boolean, id: string): Promise<void>
  deletePlaygroundById(id: string): Promise<void>
}
