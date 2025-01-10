import { FormProvider } from 'react-hook-form'

import type { ChallengeDto } from '@stardust/core/challenging/dtos'

import { ChallengeField } from './ChallengeField'
import { ChallengeTitleField } from './ChallengeTitleField'
import { useChallengeEditorPage } from './useChallengeEditorPage'

type ChallengeEditorPageProps = {
  savedChallengeDto?: ChallengeDto
}

export function ChallengeEditorPage({ savedChallengeDto }: ChallengeEditorPageProps) {
  const { form } = useChallengeEditorPage()

  return (
    <FormProvider {...form}>
      <ChallengeField title='Título' icon='title'>
        <ChallengeTitleField />
      </ChallengeField>
    </FormProvider>
  )
}
