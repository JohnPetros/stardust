import { useState } from 'react'

const QUOTES = [
  'Aquecendo os motores 🚀',
  'Caçando uns bits perdidos pelo caminho…',
  'Fazendo mágica com café e código ☕✨',
  'Subindo as engrenagens do universo paralelo…',
  'Quase lá, só não vale fechar o app agora 👀',
]

export function useUserCreationPendingMessage() {
  const [quoteIndex, setQuoteIndex] = useState(0)

  function handleAnimationComplete() {
    setTimeout(() => {
      if (quoteIndex === QUOTES.length - 1) {
        setQuoteIndex(0)
      } else {
        setQuoteIndex(quoteIndex + 1)
      }
    }, 1000)
  }

  return {
    quote: QUOTES[quoteIndex],
    handleAnimationComplete,
  }
}
