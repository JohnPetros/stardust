'use client'

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
    <div className="mt-20">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-center mt-6">
          <Star number={number} />
          <h1 className="uppercase text-xl text-gray-100 font-bold">{title}</h1>
        </div>
        <div className="space-y-10 mt-12">
          {texts.map((text) => (
            <Text data={text} />
          ))}
        </div>
      </div>

      <footer className="fixed w-full bottom-0 border-t border-gray-800 bg-gray-900 flex items-center justify-center p-4">
        <Button className="w-32" tabIndex={0}>
          Continuar
        </Button>
      </footer>
    </div>
  )
}
