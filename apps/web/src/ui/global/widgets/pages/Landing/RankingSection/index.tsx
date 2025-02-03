import { RankingUser } from '@/ui/ranking/widgets/pages/Ranking/RankingUsersList/RankingUser'

import { SectionTitle } from '../SectionTitle'
import { AnimatedBorder } from '../../../components/AnimatedBorder'
import { AnimatedRankingUser } from './AnimatedRankingUser'
import { Paragraph } from '../Paragraph'
import { PodiumAnimation } from './PodiumAnimation'

export function RankingSection() {
  return (
    <section id='ranking' className='max-w-6xl mx-auto px-6 md:px-0'>
      <SectionTitle>Seja ranqueado com outros viajantes</SectionTitle>

      <AnimatedBorder className='mt-6 p-8'>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
          <div>
            <PodiumAnimation />

            <div>
              <Paragraph>
                Aqueles que exploram os planetas e que conseguem resolver mais desafios de
                código ganham mais pontos de{' '}
                <strong className='text-green-500 font-medium'>ranking</strong>.
              </Paragraph>
              <Paragraph>
                Os primeiros do ranking ganham{' '}
                <strong className='text-green-500 font-medium'>recompensas</strong> e
                sobem para o próximo tier.
              </Paragraph>
            </div>
          </div>

          <ul className='space-y-2'>
            <AnimatedRankingUser index={0}>
              <RankingUser
                id='1'
                name='Leonel Sanches'
                position={1}
                xp={1100}
                avatarName='apollo'
                avatarImage='apollo.jpg'
                losersPositionOffset={100}
              />
            </AnimatedRankingUser>
            <AnimatedRankingUser index={1}>
              <RankingUser
                id='2'
                name='Samuel Renan'
                position={2}
                xp={950}
                avatarName='apollo'
                avatarImage='apollo.jpg'
                losersPositionOffset={100}
              />
            </AnimatedRankingUser>

            <AnimatedRankingUser index={2}>
              <RankingUser
                id='3'
                name='Ítalo Brandão'
                position={3}
                xp={625}
                avatarName='apollo'
                avatarImage='apollo.jpg'
                losersPositionOffset={100}
              />
            </AnimatedRankingUser>

            <AnimatedRankingUser index={3}>
              <RankingUser
                id='4'
                name='Aristides da costa'
                position={4}
                xp={500}
                avatarName='apollo'
                avatarImage='apollo.jpg'
                losersPositionOffset={100}
              />
            </AnimatedRankingUser>
          </ul>
        </div>
      </AnimatedBorder>
    </section>
  )
}
