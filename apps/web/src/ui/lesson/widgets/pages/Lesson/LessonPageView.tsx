import { PageTransitionAnimation } from '@/ui/global/widgets/components/PageTransitionAnimation'
import { Loading } from '@/ui/global/widgets/components/Loading'
import { LessonHeader } from './LessonHeader'
import { StoryStage } from './StoryStage'
import { QuizStage } from './QuizStage'

type Props = {
  starId: string
  starName: string
  starNumber: number
  isTransitionVisible: boolean
  scrollRef: React.RefObject<HTMLDivElement>
  stage: string
  onLeavePage: () => void
}

export const LessonPageView = ({
  starName,
  starNumber,
  isTransitionVisible,
  scrollRef,
  stage,
  onLeavePage,
}: Props) => {
  return (
    <>
      <PageTransitionAnimation isVisible={isTransitionVisible} />
      <div ref={scrollRef} className='relative overflow-x-hidden'>
        {stage !== 'rewarding' && <LessonHeader onLeavePage={onLeavePage} />}

        <main>
          {stage === 'story' && <StoryStage title={starName} number={starNumber} />}
          {stage === 'quiz' && <QuizStage leaveLesson={onLeavePage} />}
          {stage === 'rewarding' && <Loading isSmall={false} />}
        </main>
      </div>
    </>
  )
}
