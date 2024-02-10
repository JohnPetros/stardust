import type { Doc } from '@/@types/Doc'

export interface IDocsController {
  getDocsOrderedByPosition(): Promise<Doc[]>
  getUserUnlockedDocsIds(userId: string): Promise<string[]>
  checkDocUnlocking(docId: string, userId: string): Promise<boolean>
  addUnlockedDoc(docId: string, userId: string): Promise<void>
}
