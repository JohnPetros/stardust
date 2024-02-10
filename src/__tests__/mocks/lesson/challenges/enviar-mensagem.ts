import { Challenge } from '@/@types/Challenge'

export const challenge: Partial<Challenge> = {
  title: 'Enviar mensagem',
  difficulty: 'easy',
  downvotes: 0,
  upvotes: 0,
  total_completitions: 0,
  doc_id: 'f60a0e67-c0b9-401a-a652-c9d5f8042ff1',
  code: `var msg = leia()
// Escreva seu código abaixo`,
  function_name: null,
  test_cases: [
    {
      id: 1,
      input: ["'Olá, mundo!'"],
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
}
