import { FormProvider } from 'react-hook-form'

import { ChallengeField } from './ChallengeField'
import { ChallengeTitleField } from './ChallengeTitleField'
import { useChallengeEditorPage } from './useChallengeEditorPage'

export function ChallengeEditorPage() {
  const { form } = useChallengeEditorPage()

  return (
    <FormProvider {...form}>
      <ChallengeField title='Título' icon='title'>
        <ChallengeTitleField />
      </ChallengeField>
    </FormProvider>
  )
}
