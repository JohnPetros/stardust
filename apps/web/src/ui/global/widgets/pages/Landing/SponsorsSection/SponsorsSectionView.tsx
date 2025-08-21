import Image from 'next/image'
import { SectionTitle } from '../SectionTitle'

export const SponsorsSectionView = () => {
  return (
    <section className='max-w-6xl mx-auto px-6 md:px-0 h-[50vh]'>
      <SectionTitle>Patrocinadores</SectionTitle>

      <div className='grid place-content-center mt-24'>
        <a
          href='https://designliquido.com.br'
          target='_blank'
          rel='noopener noreferrer'
          className='block relative md:w-[500px] md:h-[105px] w-[300px] h-[65px]'
        >
          <Image src='/images/design-liquido-logo.png' alt='Design Líquido' fill />
        </a>
      </div>
    </section>
  )
}
