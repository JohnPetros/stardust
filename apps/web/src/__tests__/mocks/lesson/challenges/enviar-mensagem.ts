import { Challenge } from '@/@types/Challenge'

export const challenge: Challenge = {
  id: 'Enviar mensagem',
  slug: 'enviar-mensagem',
  description: '',
  title: 'Enviar mensagem',
  difficulty: 'easy',
  userSlug: 'apollo',
  createdAt: '',
  starId: '',
  categories: [],
  isCompleted: false,
  downvotesCount: 0,
  upvotesCount: 0,
  totalCompletitions: 0,
  docId: 'f60a0e67-c0b9-401a-a652-c9d5f8042ff1',
  code: `var msg = leia()
// Escreva seu código abaixo`,
  functionName: null,
  testCases: [
    {
      id: 1,
      input: ['"Olá, mundo!"'],
      expectedOutput: 'Olá, mundo!',
      isLocked: false,
    },
  ],
  texts: [
    {
      type: 'default',
      content: 'Parece que finalmente você encontrou um planeta à vista!',
      picture: 'panda-comemorando.jpg',
    },
    {
      type: 'default',
      content:
        'Para verifcar se há vida inteligente, você pode enviar uma mensagem dizendo: "Olá, mundo!".',
      picture: 'panda.jpg',
    },
    {
      type: 'default',
      content:
        'Para fazer isso você deve escrever um programa no editor de código ao lado que receba essa mensagem e a escreva, sendo a entrada e saída de dados respectivamente.',
      picture: 'panda-andando-com-bambu.jpg',
    },
    {
      type: 'default',
      content: 'Veja o exemplo para entender melhor:',
      picture: 'panda-sorrindo.jpg',
    },
    {
      type: 'code',
      content: `Entrada: "Olá, mundo!"
Saida: "Olá, mundo!"`,
      isRunnable: false,
    },
    {
      type: 'default',
      content:
        'Se o resultado do seu código passar no teste de caso na aba de *resultado*, você conclui o desafio 🎉.',
      picture: 'panda-comemorando.jpg',
    },
    {
      type: 'alert',
      content:
        'Lembre-se de manter o comando *leia()* (que já está no código) para capturar os dados de entrada.',
      picture: 'panda-piscando-sentado.jpg',
    },
  ],
  description: `
    <Text picture='panda-comemorando.jpg'>Parece que finalmente você encontrou um planeta à vista!</Text>
    <Text picture='panda.jpg'>Para verifcar se há vida inteligente, você pode enviar uma mensagem dizendo: "Olá, mundo!".</Text>
    <Text picture='panda.jpg'>Para fazer isso você deve escrever um programa no editor de código ao lado que receba essa mensagem e a escreva, sendo a entrada e saída de dados respectivamente.</Text>
    <Text picture='panda.jpg'>Veja o exemplo para entender melhor:</Text>
    <Code>
    Entrada: "Olá, mundo!" 
    Saida: "Olá, mundo!"
    </Code>
    <Text picture='panda-comemorando.jpg'>Se o resultado do seu código passar no teste de caso na aba de *resultado*, você conclui o desafio 🎉.</Text>
    <Alert picture='panda-comemorando.jpg'>Lembre-se de manter o comando *leia()* (que já está no código) para capturar os dados de entrada.</Alert>
  `,
}
