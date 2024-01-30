import { useChallengeStore } from '@/stores/challengeStore'

export function Description() {
  const {
    state: { challenge },
  } = useChallengeStore()

  if (challenge)
    return (
      <div className="space-y-8 p-6">
        {challenge.texts.map((text, index) => (
          // <Text
          //   key={`text-${index}`}
          //   data={text}
          //   hasAnimation={isFirstRendering}
          // />
          <>
            <p key={index}>{text.content}</p>
            <p key={index}>{text.content}</p>
            <p key={index}>{text.content}</p>
          </>
        ))}
      </div>
    )
}
