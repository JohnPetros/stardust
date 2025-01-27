import { Paragraph } from '../Paragraph'
import { SectionTitle } from '../SectionTitle'
import { TrophyAnimation } from './TrophyAnimation'

export function RankingSection() {
  return (
    <section id='#ranking'>
      <SectionTitle>Seja ranqueado com outros viajantes</SectionTitle>
      <div className='flex items-center'>
        <TrophyAnimation />
        <div className='flex-1'>
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
      </div>
    </section>
  )
}
