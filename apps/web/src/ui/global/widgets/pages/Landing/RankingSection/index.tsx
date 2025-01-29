import { RankingUser } from '@/ui/ranking/widgets/pages/Ranking/RankingUsersList/RankingUser'

import { SectionTitle } from '../SectionTitle'
import { Animation } from '../../../components/Animation'
import { AnimatedBorder } from '../../../components/AnimatedBorder'
import { Paragraph } from '../Paragraph'

export function RankingSection() {
  return (
    <section id='#ranking'>
      <SectionTitle>Seja ranqueado com outros viajantes</SectionTitle>
      <AnimatedBorder>
        <div className='flex justify-between'>
          <Animation name='podium' size={120} />

          <div className='space-y-2'>
            <RankingUser
              id='1'
              name='Felipe nogueira'
              position={1}
              xp={1100}
              avatarName='apollo'
              avatarImage='apollo.jpg'
              losersPositionOffset={100}
            />
            <RankingUser
              id='2'
              name='Felipe nogueira'
              position={2}
              xp={950}
              avatarName='apollo'
              avatarImage='apollo.jpg'
              losersPositionOffset={100}
            />
            <RankingUser
              id='3'
              name='Felipe nogueira'
              position={3}
              xp={625}
              avatarName='apollo'
              avatarImage='apollo.jpg'
              losersPositionOffset={100}
            />
            <RankingUser
              id='4'
              name='Felipe nogueira'
              position={4}
              xp={500}
              avatarName='apollo'
              avatarImage='apollo.jpg'
              losersPositionOffset={100}
            />
          </div>
        </div>

        <div className='flex items-center justify-between w-full mt-6'>
          <Paragraph>
            Aqueles que exploram os planetas e que conseguem resolver mais desafios de
            código ganham mais pontos de{' '}
            <strong className='text-green-500 font-medium'>ranking</strong>.
          </Paragraph>
          <Paragraph>
            Os primeiros do ranking ganham{' '}
            <strong className='text-green-500 font-medium'>recompensas</strong> e sobem
            para o próximo tier.
          </Paragraph>
        </div>
      </AnimatedBorder>
    </section>
  )
}
