'use server'

import { Challenge } from '@/@types/challenge'
import { createServerClient } from '@/services/api/supabase/clients/serverClient'
import { DocsController } from '@/services/api/supabase/controllers/docsController'

export async function unlockDoc(challenge: Challenge, userId: string) {
  const shouldUnlockDoc = !challenge.isCompleted && Boolean(challenge.star_id)

  if (shouldUnlockDoc && challenge.doc_id) {
    const docsController = DocsController(createServerClient())

    const isDocUnlock = await docsController.checkDocUnlocking(
      challenge.doc_id,
      userId
    )

    if (!isDocUnlock)
      await docsController.addUnlockedDoc(challenge.doc_id, userId)
  }
}
