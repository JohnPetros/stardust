import { DictionaryTopic } from '@/@types/dictionaryTopic'

export interface IDictionaryTopicsController {
  getDictionaryTopicsOrderedByPosition(): Promise<DictionaryTopic[]>
  getUserUnlockedDictionaryTopicsIds(userId: string): Promise<string[]>
  checkDictionaryTopicUnlocking(
    dictionaryTopicId: string,
    userId: string
  ): Promise<boolean>
  addUnlockedDictionaryTopic(
    dictionaryTopicId: string,
    userId: string
  ): Promise<void>
}
