import { Button } from '@/app/components/Button'
import { Text } from '@/app/components/Text'
import { Text as TextData } from '@/types/text'
import { useState } from 'react'
import { Star } from './Star'
import { theory } from '@/utils/templates/planets/planet1/star1/theory'

interface TheoryProps {
  title: string
  number: number
}

export function Theory({ title, number }: TheoryProps) {
  const [texts, setTexts] = useState<TextData[]>(theory)

  return (
    <div className="max-w-3xl mx-auto">
      <header className="flex items-center justify-center gap-2">
        <Star number={number} />
        <h1>{title}</h1>
      </header>
      <div className="space-y-10 mt-12">
        {texts.map((text) => (
          <Text data={text} />
        ))}
      </div>
      <footer className="flex items-center justify-center p-6">
        <Button>Continuar</Button>
      </footer>
    </div>
  )
}
