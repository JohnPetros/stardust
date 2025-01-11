import { FormProvider } from 'react-hook-form'

import type { ChallengeCategoryDto, ChallengeDto } from '@stardust/core/challenging/dtos'
import { ChallengeCategory } from '@stardust/core/challenging/entities'

import { ActionButton } from '@/ui/global/widgets/components/ActionButton'
import type { ActionButtonTitles } from '@/ui/global/widgets/components/ActionButton/types'
import { ChallengeTitleField } from './ChallengeTitleField'
import { useChallengeEditorPage } from './useChallengeEditorPage'
import { ChallengeFunctionField } from './ChallengeFunctionField'
import { ChallengeTestCasesField } from './ChallengeTestCasesField'
import { ChallengeDescriptionField } from './ChallengeDescriptionField'
import { ChallengeDifficultyLevelField } from './ChallengeDifficultyLevel'
import { ChallengeCategoriesField } from './ChallengeCategoriesField'
import { ChallengeCodeField } from './ChallengeCodeField'

type ChallengeEditorPageProps = {
  savedChallengeDto?: ChallengeDto
  challengeCategoriesDto: ChallengeCategoryDto[]
}

export function ChallengeEditorPage({
  savedChallengeDto,
  challengeCategoriesDto,
}: ChallengeEditorPageProps) {
  const categories = challengeCategoriesDto.map(ChallengeCategory.create)
  const {
    form,
    canSubmitForm,
    shouldUpdateChallenge,
    isFormSubmitting,
    isSubmitSuccess,
    isSubmitFailure,
    handleFormSubmit,
  } = useChallengeEditorPage(savedChallengeDto)
  const ACTION_BUTTON_TITLES: ActionButtonTitles = {
    canExecute: shouldUpdateChallenge ? 'atualizar?' : 'postar?',
    executing: shouldUpdateChallenge ? 'atualizando...' : 'postando...',
    default: shouldUpdateChallenge ? 'atualizado' : 'postar',
    success: shouldUpdateChallenge ? 'atualizado' : 'postado',
    failure: 'erro',
  }

  return (
    <FormProvider {...form}>
      <form onSubmit={handleFormSubmit}>
        <ActionButton
          titles={ACTION_BUTTON_TITLES}
          canExecute={canSubmitForm}
          isExecuting={isFormSubmitting}
          isDisabled={!canSubmitForm}
          isSuccess={isSubmitSuccess}
          isFailure={isSubmitFailure}
          icon='send'
        />
        <ChallengeTitleField />
        <ChallengeFunctionField />
        <ChallengeTestCasesField />
        <ChallengeDescriptionField />
        <ChallengeCodeField />
        <ChallengeCategoriesField categories={categories} />
        <ChallengeDifficultyLevelField />
      </form>
    </FormProvider>
  )
}
