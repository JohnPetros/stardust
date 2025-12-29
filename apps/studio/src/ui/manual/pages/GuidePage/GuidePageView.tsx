import { ActionButton } from '@/ui/global/widgets/components/ActionButton'
import type { ActionButtonTitles } from '@/ui/global/widgets/components/ActionButton/types'
import { ContentEditor } from '@/ui/global/widgets/components/ContentEditor'
import { TextEditorContextProvider } from '@/ui/global/contexts/TextEditorContext'

const ACTION_BUTTON_TITLES: ActionButtonTitles = {
  canExecute: 'salvar?',
  executing: 'salvando...',
  default: 'salvar',
  success: 'salvo',
  failure: 'erro',
}

type Props = {
  title: string
  content: string
  editorHeight: number
  isSaveDisabled: boolean
  onContentChange: (content: string) => void
  onSave: () => Promise<void>
}

export const GuidePageView = ({
  title,
  content,
  editorHeight,
  isSaveDisabled,
  onContentChange,
  onSave,
}: Props) => {
  return (
    <TextEditorContextProvider>
      <div className='max-h-screen overflow-y-auto'>
        <div className='flex items-center justify-between p-6'>
          <h1 className='text-2xl font-bold text-zinc-100'>{title}</h1>
          <ActionButton
            type='button'
            titles={ACTION_BUTTON_TITLES}
            isDisabled={isSaveDisabled}
            onExecute={onSave}
            icon='edition'
            className='w-28'
          />
        </div>

        <div className='px-6 pb-6'>
          <ContentEditor
            content={content}
            onChange={onContentChange}
            height={editorHeight}
          />
        </div>
      </div>
    </TextEditorContextProvider>
  )
}
