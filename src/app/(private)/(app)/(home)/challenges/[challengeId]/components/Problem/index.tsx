import { Text } from '@/app/components/Text'
import type { Text as TextData } from '@/types/text'

interface ProblemProps {
  texts: TextData[]
}

export function Problem({ texts }: ProblemProps) {
  return (
    <div className="p-6 w-full">
      <div className='space-y-8'>
        {texts.map((text, index) => (
          <Text key={`text-${index}`} data={text} hasAnimation={true} />
        ))}
      </div>
    </div>
  )
}
