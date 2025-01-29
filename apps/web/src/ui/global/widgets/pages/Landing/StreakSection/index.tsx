import { WeekStatus } from '@stardust/core/profile/structs'
import { Animation } from '../../../components/Animation'
import { StreakBoard } from '../../../components/StreakBoard'
import { AnimatedCounter } from '../../../components/AnimatedCounter'
import { SectionTitle } from '../SectionTitle'
import { AnimatedReveal } from '../AnimatedReveal'
import { Paragraph } from '../Paragraph'
import { AnimatedBoard } from './AnimatedBoard'

export function StreakSection() {
  return (
    <section id='streak'>
      <SectionTitle>Tenha constância na sua jornada espacial!</SectionTitle>
      <div className='flex flex-col items-center justify-center gap-6'>
        <AnimatedBoard>
          <StreakBoard
            weekStatus={WeekStatus.create([
              'done',
              'done',
              'todo',
              'todo',
              'todo',
              'todo',
              'todo',
            ])}
          />
          <div>
            <Animation name='streak' size={96} />
            <AnimatedCounter from={0} to={524} />
          </div>
        </AnimatedBoard>

        <AnimatedReveal>
          <Paragraph>
            Matenha sua Sequência espacial intacta, estudando e praticando todos os dias.
          </Paragraph>
        </AnimatedReveal>
      </div>
    </section>
  )
}
