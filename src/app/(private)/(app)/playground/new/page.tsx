import { PlaygroundLayout } from '../[playgroundId]/components/PlaygroundLayout'

export default function NewPlaygroundPage() {
  return (
    <PlaygroundLayout
      playgroundTitle="Sem título"
      playgroundCode=""
      playgroundId=""
      playgroundUser={null}
      isPlaygroundPublic={true}
    />
  )
}
