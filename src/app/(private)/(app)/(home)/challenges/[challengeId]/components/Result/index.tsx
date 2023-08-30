import { TestCase } from './TestCase'
import type { TestCase as TestCaseData } from '@/types/challenge'

interface ResultsProps {
  testCases: TestCaseData[]
}

export function Result({ testCases }: ResultsProps) {
  return (
    <div className="w-full h-full bg-gray-800 p-6">
      <div className="space-y-6">
        {testCases.map((testCase) => (
          <TestCase key={testCase.id} data={testCase} isCorrect={false} />
        ))}
      </div>
    </div>
  )
}
