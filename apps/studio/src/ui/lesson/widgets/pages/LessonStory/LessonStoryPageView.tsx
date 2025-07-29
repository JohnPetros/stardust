import { Header } from './Header'
import { TextBlocks } from './TextBlocks'

export const LessonStoryPageView = () => {
  return (
    <div>
      <Header />
      <div className='grid grid-cols-3 gap-6'>
        <TextBlocks />
      </div>
    </div>
  )
}
