import type { ChallengeDto } from '@stardust/core/challenging/entities/dtos'

export const challenge: Omit<ChallengeDto, 'author'> = {
  id: 'Reconhecendo raça alienígena',
  slug: 'reconhecendo-raca-alienígena',
  description: '',
  starId: '4',
  categories: [],
  title: 'Reconhecendo raça alienígena',
  difficultyLevel: 'easy',
  initialCode: `// Lembre-se:
// Trox: se tiver 3 olhos e cor verde
// Blonk: se tiver 2 olhos e cor laranja
// Plimp: se tiver 6 olhos e cor marrom
  
var olhos = leia()
var cor = leia()

// Escreva sua solução abaixo`,
  testCases: [
    { position: 1, inputs: [3, "'verde'"], isLocked: false, expectedOutput: 'Trox' },
    {
      position: 2,
      inputs: [2, "'laranja'"],
      isLocked: false,
      expectedOutput: 'Blonk',
    },
    { position: 3, inputs: [6, "'marrom'"], isLocked: false, expectedOutput: 'Plimp' },
    {
      position: 4,
      inputs: [4, "'preto'"],
      isLocked: false,
      expectedOutput: 'raça desconhecida',
    },
  ],
  //   texts: [
  //     {
  //       type: 'image',
  //       content: 'Saindo do portal com sucesso!',
  //       picture: 'foguete-saindo-do-portal.jpg',
  //     },
  //     {
  //       type: 'default',
  //       content:
  //         'Conseguimos sair pelo portal roxo 🚀! Só que agora paramos em um planeta desconhecido.',
  //       picture: 'panda-pulando-de-alegria.jpg',
  //     },
  //     {
  //       type: 'image',
  //       content: 'Hahaha!',
  //       picture: 'alien-de-um-olho.jpg',
  //     },
  //     {
  //       type: 'default',
  //       content:
  //         'Está vindo uma raça estranha em nossa direção, e o foguete está com problema em reconhecê-la.',
  //       picture: 'panda-espantado.jpg',
  //     },
  //     {
  //       type: 'default',
  //       content:
  //         'Contudo, ela possui caracteríscas comuns com outras raças no banco de dados (várias olhos e cor diferenciada)',
  //       picture: 'panda-olhando-computador.jpg',
  //     },
  //     {
  //       type: 'quote',
  //       content: '*Trox*: se tiver 3 olhos e cor verde',
  //       picture: 'panda-de-oculos.jpg',
  //     },
  //     {
  //       type: 'quote',
  //       content: '*Blonk*: se tiver 2 olhos e cor laranja',
  //       picture: 'panda-de-oculos.jpg',
  //     },
  //     {
  //       type: 'quote',
  //       content: '*Plimp*: se tiver 6 olhos e cor marrom',
  //       picture: 'panda-de-oculos.jpg',
  //     },
  //     {
  //       type: 'quote',
  //       title: 'O que fazer?',
  //       content:
  //         'O seu desafio é escrever um programa que escreva o nome da raça de acordo com esses dados. Se não se encaixarem em nenhuma das raças conhecidas, o programa deve escrever "raça desconhecida" em minúsculo.',
  //       picture: 'panda-segurando-bambu-de-pe.jpg',
  //     },
  //     {
  //       type: 'code',
  //       content: `Entrada: 3, "verde"
  // Resultado: Trox

  // Entrada: 2, "laranja"
  // Resultado: Blonk

  // Entrada: 6, "marrom"
  // Resultado: Plimp

  // Entrada: 10, "preto"
  // Resultado: raça desconhecida`,
  //       isRunnable: false,
  //     },
  //     {
  //       type: 'alert',
  //       content:
  //         'Eu te pergunto: para fazer esse desafio é melhor usar estrutura *se, se senao, senao* ou *escolha caso*. Deixe sua resposta na aba de comentários depois de resolver esse desafio. 😉',
  //       picture: 'panda-andando-com-bambu.jpg',
  //     },
  //     {
  //       type: 'alert',
  //       content:
  //         'Caso você tenha esquecido como se escreve esses comandos, você pode visualizar todos os comandos disponíveis apertando *Ctrl + K* no editor de código ao lado que a documentação sobre nossa linguagem de programação se abrirá.',
  //       picture: 'panda-andando-com-bambu.jpg',
  //     },
  //     {
  //       type: 'alert',
  //       content: 'Faça o programa escrever apenas uma vez.',
  //       picture: 'panda-andando-com-bambu.jpg',
  //     },
  //     {
  //       type: 'alert',
  //       content:
  //         'Por favor, não remova nenhum comando *leia()*, pois será a partir deles que virão os dados para o seu programa.',
  //       picture: 'panda-andando-com-bambu.jpg',
  //     },
  //   ],
}

/**
 * // Lembre-se:
// Trox: se tiver 3 olhos e cor verde
// Blonk: se tiver 2 olhos e cor laranja
// Plimp: se tiver 6 olhos e cor marrom
  
var olhos = leia()
var cor = leia()

// Escreva sua solução abaixo
se (cor == 'verde' e olhos == 3) {
    escreva("Trox")
} senao se (cor == 'laranja' e olhos == 2) {
    escreva("Blonk")
} senao se (cor == 'marrom' e olhos == 6) {
    escreva("Plimp")
} senao {
    escreva("raça desconhecida")
}
 * 
 */
