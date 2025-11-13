'use client'

import { FormProvider } from 'react-hook-form'

import type { Challenge, ChallengeCategory } from '@stardust/core/challenging/entities'
import type { NavigationProvider, ToastProvider } from '@stardust/core/global/interfaces'
import type { ChallengingService } from '@stardust/core/challenging/interfaces'
import type { Id } from '@stardust/core/global/structures'

import type { ActionButtonTitles } from '@/ui/global/widgets/components/ActionButton/types'
import { ActionButton } from '@/ui/global/widgets/components/ActionButton'
import { Icon } from '@/ui/global/widgets/components/Icon'
import { Button } from '@/ui/global/widgets/components/Button'
import { ChallengeTitleField } from './ChallengeTitleField'
import { useChallengeEditorPage } from './useChallengeEditorPage'
import { ChallengeFunctionField } from './ChallengeFunctionField'
import { ChallengeTestCasesField } from './ChallengeTestCasesField'
import { ChallengeDescriptionField } from './ChallengeDescriptionField'
import { ChallengeDifficultyLevelField } from './ChallengeDifficultyLevelField'
import { ChallengeCategoriesField } from './ChallengeCategoriesField'
import { AlertDialog } from '@/ui/global/widgets/components/AlertDialog'

type Props = {
  currentChallenge: Challenge | null
  userId: Id
  navigationProvider: NavigationProvider
  toastProvider: ToastProvider
  challengeCategories: ChallengeCategory[]
  service: ChallengingService
}

export const ChallengeEditorPageView = ({
  currentChallenge,
  challengeCategories,
  navigationProvider,
  toastProvider,
  service,
  userId,
}: Props) => {
  const {
    form,
    canSubmitForm,
    errorMessages,
    shouldEditChallenge,
    isFormSubmitting,
    isActionSuccess,
    isActionFailure,
    handleFormSubmit,
    handleBackButtonClick,
    handleDeleteChallengeButtonClick,
  } = useChallengeEditorPage({
    currentChallenge,
    userId,
    service,
    navigationProvider,
    toastProvider,
  })
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
        <div className='flex items-center justify-between w-full'>
          <button type='button' aria-label='Voltar' onClick={handleBackButtonClick}>
            <Icon name='simple-arrow-left' size={24} className='text-green-400' />
          </button>
          <div className='flex items-center space-x-4'>
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
            {currentChallenge && (
              <AlertDialog
                title='Seu desafio está preste a ser removido'
                type='crying'
                body={
                  <div className='mt-3'>
                    <p className='text-gray-50'>
                      Tem certeza que deseja deletar essa desafio?
                    </p>
                    <p className='text-gray-50'>
                      Todos os dados do seus desafio serão perdidos.
                    </p>
                  </div>
                }
                action={
                  <Button
                    onClick={handleDeleteChallengeButtonClick}
                    className='bg-red-800 text-gray-50'
                  >
                    Deletar meu desafio
                  </Button>
                }
                cancel={
                  <Button autoFocus className='bg-green-400 text-gray-900'>
                    Cancelar
                  </Button>
                }
                shouldPlayAudio={false}
              >
                <Button
                  type='button'
                  className='w-32 bg-red-500 text-white'
                  onClick={handleDeleteChallengeButtonClick}
                >
                  Deletar
                </Button>
              </AlertDialog>
            )}
          </div>
        </div>
        {errorMessages.map((message) => (
          <p key={message} className='text-red-500'>
            {message}
          </p>
        ))}
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
