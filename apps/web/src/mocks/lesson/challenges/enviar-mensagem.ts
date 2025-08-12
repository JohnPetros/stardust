import type { ChallengeDto } from '@stardust/core/challenging/entities/dtos'

export const challenge: Omit<ChallengeDto, 'author'> = {
  id: 'Enviar mensagem',
  slug: 'enviar-mensagem',
  description: '',
  title: 'Enviar mensagem',
  difficultyLevel: 'easy',
  categories: [],
  code: `var msg = leia()
// Escreva seu código abaixo`,
  testCases: [
    {
      position: 1,
      inputs: ['"Olá, mundo!"'],
      expectedOutput: 'Olá, mundo!',
      isLocked: false,
    },
  ],
  //   texts: [
  //     {
  //       type: 'default',
  //       content: 'Parece que finalmente você encontrou um planeta à vista!',
  //       picture: 'panda-comemorando.jpg',
  //     },
  //     {
  //       type: 'default',
  //       content:
  //         'Para verifcar se há vida inteligente, você pode enviar uma mensagem dizendo: "Olá, mundo!".',
  //       picture: 'panda.jpg',
  //     },
  //     {
  //       type: 'default',
  //       content:
  //         'Para fazer isso você deve escrever um programa no editor de código ao lado que receba essa mensagem e a escreva, sendo a entrada e saída de dados respectivamente.',
  //       picture: 'panda-andando-com-bambu.jpg',
  //     },
  //     {
  //       type: 'default',
  //       content: 'Veja o exemplo para entender melhor:',
  //       picture: 'panda-sorrindo.jpg',
  //     },
  //     {
  //       type: 'code',
  //       content: `Entrada: "Olá, mundo!"
  // Saida: "Olá, mundo!"`,
  //       isRunnable: false,
  //     },
  //     {
  //       type: 'default',
  //       content:
  //         'Se o resultado do seu código passar no teste de caso na aba de *resultado*, você conclui o desafio 🎉.',
  //       picture: 'panda-comemorando.jpg',
  //     },
  //     {
  //       type: 'alert',
  //       content:
  //         'Lembre-se de manter o comando *leia()* (que já está no código) para capturar os dados de entrada.',
  //       picture: 'panda-piscando-sentado.jpg',
  //     },
  //   ],
}
