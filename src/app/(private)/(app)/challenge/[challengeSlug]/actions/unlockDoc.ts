'use server'

import { Challenge } from '@/@types/challenge'
import { createServerClient } from '@/services/api/supabase/clients/serverClient'
import { DocsController } from '@/services/api/supabase/controllers/docsController'

export async function unlockDoc(challenge: Challenge, userId: string) {
  const hasDictionaryTopic = !challenge.isCompleted && challenge.star_id

  if (hasDictionaryTopic && challenge.doc_id) {
    const docsController = DocsController(createServerClient())

    const isDictionaryTopicUnlocked = await docsController.checkDocUnlocking(
      challenge.doc_id,
      userId
    )

    if (!isDictionaryTopicUnlocked)
      await docsController.addUnlockedDoc(challenge.doc_id, userId)
  }
}
