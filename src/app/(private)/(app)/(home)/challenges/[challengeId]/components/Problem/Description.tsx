import { useChallengeContext } from '@/hooks/useChallengeContext'
import { Text } from '@/app/components/Text'

export function Description() {
  const {
    state: { challenge },
  } = useChallengeContext()

  if (challenge)
    return (
      <div className="p-6 space-y-8">
        {challenge.texts.map((text, index) => (
          <Text key={`text-${index}`} data={text} hasAnimation={true} />
        ))}
      </div>
    )
}
