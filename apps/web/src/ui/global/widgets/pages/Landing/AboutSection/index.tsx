import { Animation } from '../../../components/Animation'
import { Separator } from '../../../components/Separator'
import { SectionTitle } from '../SectionTitle'
import { TextBlock } from './TextBlock'

export function AbountSection() {
  return (
    <section id='about' className='max-w-6xl mx-auto'>
      <SectionTitle>Chamada à missão espacial</SectionTitle>
      <div className='flex mt-6'>
        <Animation name='planets-exploration' size={610} />
        <div className='w-96 flex flex-col gap-6 mt-6'>
          <TextBlock title='Aprenda de Forma Divertida e Acessível' icon='smile'>
            Nosso principal objetivo é tornar o aprendizado de lógica de programação
            acessível e prazeroso, utilizando uma didática envolvente e divertida.
          </TextBlock>
          <Separator className='w-full h-px' />
          <TextBlock title='Trilhas Estruturadas para Sua Jornada' icon='rocket'>
            Siga uma trilha de aprendizado organizada, onde cada planeta representa um
            conceito essencial de lógica de programação.
          </TextBlock>
          <Separator className='w-full h-px' />
          <TextBlock title='Histórias que Dão Vida à Programação' icon='book'>
            Embarque em aventuras interativas em que cada planeta traz desafios únicos, e
            aplique a programação para superar obstáculos ao longo do caminho.
          </TextBlock>
        </div>
      </div>
    </section>
  )
}
