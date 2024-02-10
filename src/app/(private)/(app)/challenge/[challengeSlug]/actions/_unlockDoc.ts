'use server'

import { Challenge } from '@/@types/Challenge'
import { IDocsController } from '@/services/api/interfaces/IDocsController'

type UnlockDocParams = {
  challenge: Challenge
  userId: string
  docsController: IDocsController
}

export async function unlockDoc({
  challenge,
  userId,
  docsController,
}: UnlockDocParams) {
  const shouldUnlockDoc = !challenge.isCompleted && Boolean(challenge.starId)

  if (shouldUnlockDoc && challenge.docId) {
    const isDocUnlock = await docsController.checkDocUnlocking(
      challenge.docId,
      userId
    )

    if (!isDocUnlock)
      await docsController.addUnlockedDoc(challenge.docId, userId)
  }
}
