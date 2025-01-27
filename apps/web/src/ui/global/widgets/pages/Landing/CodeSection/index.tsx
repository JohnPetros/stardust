import { PlaygroundCodeEditor } from '../../../components/PlaygroundCodeEditor'
import { SectionTitle } from '../SectionTitle'
import { Feature } from './Feature'

export function CodeSection() {
  return (
    <section id='code'>
      <div className='sticky top-0'>
        <SectionTitle>Código</SectionTitle>
      </div>

      <Feature
        title='Linguagem de programação em português'
        paragraph='Lorem ipsum dolor sit amet consectetur adipisicing elit. Iusto quasi ipsum, aut, vitae accusantium dolorum rem eligendi rerum quibusdam enim officiis deleniti voluptatum veritatis obcaecati dignissimos expedita ad corporis. Debitis.'
      >
        <PlaygroundCodeEditor code='' height={400} />
      </Feature>
      <Feature
        title='Linguagem de programação em português'
        paragraph='Lorem ipsum dolor sit amet consectetur adipisicing elit. Iusto quasi ipsum, aut, vitae accusantium dolorum rem eligendi rerum quibusdam enim officiis deleniti voluptatum veritatis obcaecati dignissimos expedita ad corporis. Debitis.'
      >
        <PlaygroundCodeEditor code='' height={400} />
      </Feature>
      <Feature
        title='Linguagem de programação em português'
        paragraph='Lorem ipsum dolor sit amet consectetur adipisicing elit. Iusto quasi ipsum, aut, vitae accusantium dolorum rem eligendi rerum quibusdam enim officiis deleniti voluptatum veritatis obcaecati dignissimos expedita ad corporis. Debitis.'
      >
        <PlaygroundCodeEditor code='' height={400} />
      </Feature>
    </section>
  )
}
