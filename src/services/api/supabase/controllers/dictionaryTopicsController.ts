import type { IDictionaryTopicsController } from '../../interfaces/IDictionaryTopicsControllert'
import type { Supabase } from '../types/supabase'

import { DictionaryTopic } from '@/@types/dictionaryTopic'

export const DictionaryTopicsController = (
  supabase: Supabase
): IDictionaryTopicsController => {
  return {
    getDictionaryTopicsOrderedByPosition: async () => {
      const { data, error } = await supabase
        .from('dictionary_topics')
        .select('*')
        .order('position', { ascending: true })
        .returns<DictionaryTopic[]>()

      if (error) {
        throw new Error(error.message)
      }

      const dictionaryTopics: DictionaryTopic[] = data.map((topic) => ({
        id: topic.id,
        title: topic.title,
        content: topic.content,
        position: topic.position,
      }))

      return dictionaryTopics
    },

    getUserUnlockedDictionaryTopicsIds: async (userId: string) => {
      const { data, error } = await supabase
        .from('users_unlocked_dictionary_topics')
        .select('dictionary_topic_id')
        .eq('user_id', userId)
        .returns<{ dictionary_topic_id: string }[]>()

      if (error) {
        throw new Error(error.message)
      }

      return data.map((data) => data.dictionary_topic_id)
    },

    checkDictionaryTopicUnlocking: async (
      dictionaryTopicId: string,
      userId: string
    ) => {
      const { data, error } = await supabase
        .from('users_unlocked_dictionary_topics')
        .select('dictionary_topic_id')
        .eq('dictionary_topic_id', dictionaryTopicId)
        .eq('user_id', userId)

      if (error) {
        throw new Error(error.message)
      }

      return !data
    },

    addUnlockedDictionaryTopic: async (
      dictionaryTopicId: string,
      userId: string
    ) => {
      const { error } = await supabase
        .from('users_unlocked_dictionary_topics')
        .insert({ dictionary_topic_id: dictionaryTopicId, user_id: userId })

      console.log({ error })

      if (error) {
        throw new Error(error.message)
      }
    },
  }
}
