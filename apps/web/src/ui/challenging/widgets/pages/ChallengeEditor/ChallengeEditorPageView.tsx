'use client'

import { FormProvider } from 'react-hook-form'

import type { Challenge, ChallengeCategory } from '@stardust/core/challenging/entities'
import type { NavigationProvider } from '@stardust/core/global/interfaces'
import type { ChallengingService } from '@stardust/core/challenging/interfaces'
import type { Id } from '@stardust/core/global/structures'

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

type Props = {
  currentChallenge: Challenge | null
  userId: Id
  navigationProvider: NavigationProvider
  challengeCategories: ChallengeCategory[]
  service: ChallengingService
}

export const ChallengeEditorPageView = ({
  currentChallenge,
  challengeCategories,
  navigationProvider,
  service,
  userId,
}: Props) => {
  const {
    form,
    canSubmitForm,
    shouldEditChallenge,
    isFormSubmitting,
    isActionSuccess,
    isActionFailure,
    handleFormSubmit,
    handleBackButtonClick,
  } = useChallengeEditorPage({ currentChallenge, userId, service, navigationProvider })
  const ACTION_BUTTON_TITLES: ActionButtonTitles = {
    canExecute: shouldEditChallenge ? 'atualizar?' : 'postar?',
    executing: shouldEditChallenge ? 'atualizando...' : 'postando...',
    default: shouldEditChallenge ? 'atualizar' : 'postar',
    success: shouldEditChallenge ? 'atualizado' : 'postado',
    failure: 'erro',
  }

  console.log('errors', form.formState.errors)

  return (
    <FormProvider {...form}>
      <form
        onSubmit={handleFormSubmit}
        className='mx-auto max-w-5xl px-6 md:px-0 py-6 space-y-12'
      >
        <div className='flex items-center justify-between w-full'>
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
            className='w-32'
          />
        </div>
        <p className='text-gray-200'>
          Certifique-se de preencher todos os campos adequadamente.
        </p>
        <ChallengeTitleField />
        <ChallengeFunctionField />
        <ChallengeTestCasesField />
        <ChallengeDescriptionField />
        <ChallengeCategoriesField categories={challengeCategories} />
        <ChallengeDifficultyLevelField />
      </form>
    </FormProvider>
  )
}
