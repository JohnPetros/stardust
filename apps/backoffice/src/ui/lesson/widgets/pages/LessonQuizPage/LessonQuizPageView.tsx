import { TextEditorContextProvider } from '@/ui/global/contexts/TextEditorContext'
import { PageHeader } from '../../components/PageHeader'
import { QuizBank } from './QuizBank'
import { QuizArranger } from './QuizArranger'
import { QuizActionButton } from './QuizActionButton'
import { QuestionEditor } from './QuestionEditor'

export const LessonQuizPageView = () => {
  return (
    <TextEditorContextProvider>
      <div className='max-h-screen overflow-y-auto'>
        <PageHeader>
          <QuizActionButton />
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
            <QuestionEditor />
          </div>
        </div>
      </div>
    </TextEditorContextProvider>
  )
}
