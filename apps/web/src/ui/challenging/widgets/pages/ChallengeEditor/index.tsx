'use client'

import { FormProvider } from 'react-hook-form'

import type { ChallengeCategoryDto, ChallengeDto } from '@stardust/core/challenging/dtos'
import { ChallengeCategory } from '@stardust/core/challenging/entities'

import type { ActionButtonTitles } from '@/ui/global/widgets/components/ActionButton/types'
import { ActionButton } from '@/ui/global/widgets/components/ActionButton'
import { Icon } from '@/ui/global/widgets/components/Icon'
import { ChallengeTitleField } from './ChallengeTitleField'
import { useChallengeEditorPage } from './useChallengeEditorPage'
import { ChallengeFunctionField } from './ChallengeFunctionField'
import { ChallengeTestCasesField } from './ChallengeTestCasesField'
import { ChallengeDescriptionField } from './ChallengeDescriptionField'
import { ChallengeDifficultyLevelField } from './ChallengeDifficultyLevelField'
import { ChallengeCategoriesField } from './ChallengeCategoriesField'

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
    handleBackButtonClick,
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
      <form
        onSubmit={handleFormSubmit}
        className='mx-auto max-w-5xl px-6 md:px-0 py-6 space-y-12'
      >
        <div>
          <button type='button' aria-label='Voltar' onClick={handleBackButtonClick}>
            <Icon name='simple-arrow-left' size={24} className='text-green-400' />
          </button>
          <ActionButton
            type='submit'
            titles={ACTION_BUTTON_TITLES}
            canExecute={canSubmitForm}
            isExecuting={isFormSubmitting}
            isDisabled={!canSubmitForm}
            isSuccess={isActionSuccess}
            isFailure={isActionFailure}
            icon='send'
            className='w-max px-3 mt-6'
          />
        </div>
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
