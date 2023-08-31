import { useChallengeContext } from '@/hooks/useChallengeContext'
import { TestCase } from './TestCase'

export function Result() {
  const {
    state: { challenge },
  } = useChallengeContext()

  if (challenge)
    return (
      <div className="w-full min-h-screen bg-gray-800 p-6">
        <div className="space-y-6 ">
          {challenge.test_cases.map((testCase) => (
            <TestCase key={testCase.id} data={testCase} isCorrect={false} />
          ))}
        </div>
      </div>
    )
}
