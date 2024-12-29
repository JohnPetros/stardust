import type { TopicDto } from '@stardust/core/forum/dtos'
import type { Topic } from '@stardust/core/forum/entities'
import type { TopicCategory } from '@stardust/core/forum/types'

import type { SupabaseTopic, SupabaseTopicCategory } from '../types'

const TOPIC_SUPABASE_CATEGORIES: Record<SupabaseTopicCategory, TopicCategory> = {
  'challenge feedback': 'challenge-feedback',
  'challenge solution': 'challenge-solution',
  post: 'post',
}

const SUPABASE_TOPIC_CATEGORIES: Record<TopicCategory, SupabaseTopicCategory> = {
  'challenge-feedback': 'challenge feedback',
  'challenge-solution': 'challenge solution',
  post: 'post',
}

export const SupabaseTopicMapper = () => {
  return {
    toDto(supabaseTopic: SupabaseTopic): TopicDto {
      const topicDto: TopicDto = {
        id: supabaseTopic.id ?? '',
        category: TOPIC_SUPABASE_CATEGORIES[supabaseTopic.category],
      }

      return topicDto
    },

    toSupabase(topic: Topic): SupabaseTopic {
      const supabaseTopic: SupabaseTopic = {
        id: topic.id,
        category: SUPABASE_TOPIC_CATEGORIES[topic.category],
        created_at: '',
      }

      return supabaseTopic
    },
  }
}
