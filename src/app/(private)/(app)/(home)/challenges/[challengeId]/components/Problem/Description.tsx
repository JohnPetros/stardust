import { useEffect } from 'react'

import { Text } from '@/app/components/TypeWriter'
import { useChallengeStore } from '@/stores/challengeStore'

export function Description() {
  const {
    state: { challenge, isFirstRendering },
    actions: { setIsFirstRendering },
  } = useChallengeStore()

  useEffect(() => {
    setIsFirstRendering(false)
  }, [])

  if (challenge)
    return (
      <div className="space-y-8 p-6">
        {challenge.texts.map((text, index) => (
          <Text
            key={`text-${index}`}
            data={text}
            hasAnimation={isFirstRendering}
          />
        ))}
      </div>
    )
}
