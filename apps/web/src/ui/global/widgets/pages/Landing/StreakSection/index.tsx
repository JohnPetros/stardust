import { WeekStatus } from '@stardust/core/profile/structs'
import { StreakBoard } from '../../../components/StreakBoard'
import { SectionTitle } from '../SectionTitle'
import { AnimatedReveal } from '../AnimatedReveal'
import { Paragraph } from '../Paragraph'
import { AnimatedBoard } from './AnimatedBoard'

export function StreakSection() {
  return (
    <section id='streak' className='max-w-6xl mx-auto'>
      <SectionTitle>Tenha constância na sua jornada</SectionTitle>
      <div className='flex flex-col items-center justify-center gap-6 max-w-lg mx-auto mt-12'>
        <AnimatedBoard>
          <StreakBoard
            weekStatus={WeekStatus.create([
              'undone',
              'undone',
              'done',
              'done',
              'todo',
              'todo',
              'todo',
            ])}
          />
        </AnimatedBoard>

        <AnimatedReveal>
          <Paragraph className='text-center'>
            Matenha sua{' '}
            <strong className='text-green-500 font-medium'>Sequência Espacial</strong>{' '}
            intacta, estudando e praticando todos os dias.
          </Paragraph>
        </AnimatedReveal>
      </div>
    </section>
  )
}
