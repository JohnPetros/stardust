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
import { AlertDialog } from '@/ui/global/widgets/components/AlertDialog'
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
  isEditingAsAdmin: boolean
  navigationProvider: NavigationProvider
  toastProvider: ToastProvider
  challengeCategories: ChallengeCategory[]
  service: ChallengingService
}

export const ChallengeEditorPageView = ({
  currentChallenge,
  challengeCategories,
  isEditingAsAdmin,
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
    isEditingAsAdmin,
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
        className='mx-auto max-w-6xl px-6 md:px-0 py-6 space-y-12'
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
                title={
                  isEditingAsAdmin
                    ? 'Este desafio está prestes a ser removido'
                    : 'Seu desafio está prestes a ser removido'
                }
                type='crying'
                body={
                  <div className='mt-3'>
                    <p className='text-gray-50'>
                      {isEditingAsAdmin
                        ? 'Tem certeza que deseja deletar este desafio de outro autor?'
                        : 'Tem certeza que deseja deletar esse desafio?'}
                    </p>
                    <p className='text-gray-50'>
                      {isEditingAsAdmin
                        ? 'Todos os dados desse desafio serão perdidos.'
                        : 'Todos os dados do seu desafio serão perdidos.'}
                    </p>
                  </div>
                }
                action={
                  <Button
                    onClick={handleDeleteChallengeButtonClick}
                    className='bg-red-800 text-gray-50'
                  >
                    {isEditingAsAdmin ? 'Deletar desafio' : 'Deletar meu desafio'}
                  </Button>
                }
                cancel={
                  <Button autoFocus className='bg-green-400 text-gray-900'>
                    Cancelar
                  </Button>
                }
                shouldPlayAudio={false}
              >
                <Button type='button' className='w-32 bg-red-500 text-white'>
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
        {isEditingAsAdmin && (
          <p className='text-amber-400'>
            Você está editando o desafio de outro autor como administrador.
          </p>
        )}
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
