import { StoryImageInput } from './StoryImageInput'
import { TextBlockButton } from './TextBlockButton'

export const TextBlocksView = () => {
  return (
    <div>
      <h2 className='text-green-400 font-semibold'>Blocos de texto</h2>
      <p className='text-zinc-300'>
        Clique em um bloco abaixo para adicioná-lo ao editor.
      </p>
      <ul className='mt-4 space-y-2'>
        <li>
          <TextBlockButton endContent={<StoryImageInput />}>
            Bloco de texto padrão
          </TextBlockButton>
        </li>
        <li>
          <TextBlockButton endContent={null}>Bloco de alerta</TextBlockButton>
        </li>
        <li>
          <TextBlockButton endContent={null}>Bloco de código executável</TextBlockButton>
        </li>
        <li>
          <TextBlockButton endContent={null}>
            Bloco de código não executável
          </TextBlockButton>
        </li>
        <li>
          <TextBlockButton endContent={null}>Imagem</TextBlockButton>
        </li>
        <li>
          <TextBlockButton endContent={null}>Usuário</TextBlockButton>
        </li>
      </ul>
    </div>
  )
}
