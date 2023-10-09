import { useEffect } from 'react'
import { useChallengeStore } from '@/hooks/useChallengeStore'

import { Text } from '@/app/components/Text'

export function Description() {
  const {
    state: { challenge, isFirstRendering },
    action: { setIsFirstRendering },
  } = useChallengeStore()

  useEffect(() => {
    setIsFirstRendering(false)
  }, [])

  if (challenge)
    return (
      <div className="p-6 space-y-8">
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
