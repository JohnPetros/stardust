import { Text } from '@/app/components/Text'
import { useChallengeContext } from '@/hooks/useChallengeContext'


export function Problem() {
  const {
    state: { challenge },
  } = useChallengeContext()

  if (challenge)
    return (
      <div className="p-6 w-full h-full">
        <div className="space-y-8">
          {challenge.texts.map((text, index) => (
            <Text key={`text-${index}`} data={text} hasAnimation={true} />
          ))}
        </div>
      </div>
    )
}
