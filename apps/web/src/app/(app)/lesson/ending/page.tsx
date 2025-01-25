import { LessonPage } from '@/ui/lesson/widgets/pages/Lesson'
import { lessonActions } from '@/server/next-safe-action'

export default async function Ending() {
  await lessonActions.accessEndingPage()

  return (
    <LessonPage
      starId={star.id}
      starName={star.name}
      starNumber={star.number}
      storyContent={story}
      questionsDto={questions}
      textsBlocksDto={textsBlocks}
    />
  )
}
