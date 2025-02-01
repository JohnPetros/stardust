'use client'

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
import { ChallengeDifficultyLevelField } from './ChallengeDifficultyLevelField'
import { ChallengeCategoriesField } from './ChallengeCategoriesField'
import { ChallengeCodeField } from './ChallengeCodeField'

type ChallengeEditorPageProps = {
  challengeDto?: ChallengeDto
  challengeCategoriesDto: ChallengeCategoryDto[]
}

export function ChallengeEditorPage({
  challengeDto,
  challengeCategoriesDto,
}: ChallengeEditorPageProps) {
  const categories = challengeCategoriesDto.map(ChallengeCategory.create)
  const {
    form,
    canSubmitForm,
    shouldEditChallenge,
    isFormSubmitting,
    isActionSuccess,
    isActionFailure,
    handleFormSubmit,
  } = useChallengeEditorPage(challengeDto)
  const ACTION_BUTTON_TITLES: ActionButtonTitles = {
    canExecute: shouldEditChallenge ? 'atualizar?' : 'postar?',
    executing: shouldEditChallenge ? 'atualizando...' : 'postando...',
    default: shouldEditChallenge ? 'atualizar' : 'postar',
    success: shouldEditChallenge ? 'atualizado' : 'postado',
    failure: 'erro',
  }

  return (
    <FormProvider {...form}>
      <form onSubmit={handleFormSubmit} className='mx-auto max-w-5xl py-6 space-y-12'>
        <ActionButton
          type='submit'
          titles={ACTION_BUTTON_TITLES}
          canExecute={canSubmitForm}
          isExecuting={isFormSubmitting}
          isDisabled={!canSubmitForm}
          isSuccess={isActionSuccess}
          isFailure={isActionFailure}
          icon='send'
          className='w-max'
        />
        <ChallengeTitleField />
        <ChallengeFunctionField />
        <ChallengeTestCasesField />
        <ChallengeDescriptionField />
        <ChallengeCategoriesField categories={categories} />
        <ChallengeDifficultyLevelField />
      </form>
    </FormProvider>
  )
}
