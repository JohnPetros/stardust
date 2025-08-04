import { TextEditor } from '@/ui/global/widgets/components/textEditor'
import { TextEditorContextProvider } from '@/ui/global/contexts/TextEditorContext'
import { Mdx } from '@/ui/global/widgets/components/Mdx'
import { Header } from './Header'
import { TextBlocks } from './TextBlocks'
import { ActionButton } from '@/ui/global/widgets/components/ActionButton'
import type { ActionButtonTitles } from '@/ui/global/widgets/components/ActionButton/types'

type Props = {
  story: string
  editorHeight: number
  onStoryChange: (story: string) => void
  onStorySave: () => Promise<void>
  isStorySaving: boolean
  canSaveStory: boolean
  isStorySaved: boolean
  isStorySaveFailure: boolean
  isStorySaveDisabled: boolean
}

export const LessonStoryPageView = ({
  story,
  editorHeight,
  isStorySaving,
  canSaveStory,
  isStorySaved,
  isStorySaveFailure,
  isStorySaveDisabled,
  onStoryChange,
  onStorySave,
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
        <Header>
          <ActionButton
            type='button'
            titles={ACTION_BUTTON_TITLES}
            isExecuting={isStorySaving}
            canExecute={canSaveStory}
            isSuccess={isStorySaved}
            isFailure={isStorySaveFailure}
            isDisabled={isStorySaveDisabled}
            onExecute={onStorySave}
            icon='edition'
            className='w-28'
          />
        </Header>
        <div className='grid grid-cols-[300px_1fr_1fr] gap-6 px-6'>
          <div className='space-y-2'>
            <h2 className='text-green-400 font-semibold'>Blocos de texto</h2>
            <TextBlocks />
          </div>
          <div className='space-y-2'>
            <h2 className='text-green-400 font-semibold'>Editor</h2>
            <TextEditor
              value={story}
              width='100%'
              height={editorHeight}
              onChange={onStoryChange}
            />
          </div>
          <div style={{ height: editorHeight }} className='overflow-y-auto space-y-2'>
            <h2 className='text-green-400 font-semibold'>Pré-visualização</h2>
            <Mdx className='w-full space-y-24'>{story.replaceAll('----', '')}</Mdx>
          </div>
        </div>
      </div>
    </TextEditorContextProvider>
  )
}
