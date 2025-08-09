import { TextEditor } from '@/ui/global/widgets/components/textEditor'
import { TextEditorContextProvider } from '@/ui/global/contexts/TextEditorContext'
import { ActionButton } from '@/ui/global/widgets/components/ActionButton'
import type { ActionButtonTitles } from '@/ui/global/widgets/components/ActionButton/types'
import { PageHeader } from '../../components/PageHeader'
import { QuizBank } from './QuizBank'
import { QuizArranger } from './QuizArranger'

type Props = {
  isSaving: boolean
  canSave: boolean
  isSaved: boolean
  isSaveFailure: boolean
  isSaveDisabled: boolean
  onSave: () => Promise<void>
}

export const LessonQuestionsPageView = ({
  isSaving,
  canSave,
  isSaved,
  isSaveFailure,
  isSaveDisabled,
  onSave,
}: Props) => {
  const ACTION_BUTTON_TITLES: ActionButtonTitles = {
    canExecute: 'salvar?',
    executing: 'salvando...',
    default: 'salvar',
    success: 'salvo',
    failure: 'erro',
  }

  return (
    <TextEditorContextProvider>
      <div className='max-h-screen overflow-y-auto  '>
        <PageHeader>
          <ActionButton
            type='button'
            titles={ACTION_BUTTON_TITLES}
            isExecuting={isSaving}
            canExecute={canSave}
            isSuccess={isSaved}
            isFailure={isSaveFailure}
            isDisabled={isSaveDisabled}
            onExecute={onSave}
            icon='edition'
            className='w-28'
          />
        </PageHeader>
        <div className='grid grid-cols-[380px_1fr] gap-6 px-6'>
          <div className='space-y-2'>
            <h2 className='text-green-400 font-semibold'>Questões</h2>
            <div className='flex flex-col gap-6 mt-3 max-h-[80vh] overflow-y-scroll overflow-x-hidden scrollbar scrollbar-thumb-zinc-700 scrollbar-track-transparent'>
              <QuizArranger />
              <QuizBank />
            </div>
          </div>
          <div className='space-y-2'>
            <h2 className='text-green-400 font-semibold'>Editor de questão</h2>
          </div>
        </div>
      </div>
    </TextEditorContextProvider>
  )
}
