import type { ChangeEvent } from 'react'

import type { IconName } from '@/ui/global/widgets/components/Icon/types'

export type FeedbackFormMetadata = {
  label: string
  icon: IconName
  color: string
  placeholder: string
}

const intentMetadata: Record<string, FeedbackFormMetadata> = {
  bug: {
    label: 'Problema',
    icon: 'bug',
    color: 'text-green-500',
    placeholder:
      'Algo não está funcionando bem? Queremos corrigir. Conte com detalhes o que está acontecendo...',
  },
  idea: {
    label: 'Ideia',
    icon: 'lightbulb',
    color: 'text-yellow-400',
    placeholder: 'Teve uma ideia de melhoria ou de nova funcionalidade? Conta pra gente!',
  },
  other: {
    label: 'Outro',
    icon: 'comment',
    color: 'text-blue-400',
    placeholder: 'Queremos te ouvir. O que você gostaria de nos dizer?',
  },
}

type Params = {
  intent: string
  onSelectFile: (file: File) => void
}

export function useFeedbackFormStep({ intent, onSelectFile }: Params) {
  const metadata = intentMetadata[intent] ?? intentMetadata.other

  function handleFileInputChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.currentTarget.files?.[0]
    if (file) onSelectFile(file)
    event.currentTarget.value = ''
  }

  return { metadata, handleFileInputChange }
}
