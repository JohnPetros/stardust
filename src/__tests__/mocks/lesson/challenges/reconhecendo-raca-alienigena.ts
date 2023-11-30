export const challenge = {
  title: 'Reconhecendo raca alienigena',
  difficulty: 'easy',
  downvotes: 0,
  upvotes: 0,
  total_completitions: 0,
  created_by: 'Apollo',
  topic_id: 'f60a0e67-c0b9-401a-a652-c9d5f8042ff1',
  code: `// Lembre-se:
// Trox: se tiver 3 olhos e cor verde
// Blonk: se tiver 2 olhos e cor laranja
// Plimp: se tiver 6 olhos e cor marrom
  
var olhos = leia()
var cor = leia()

// Escreva sua solução abaixo`,
  function_name: null,
  tests_cases: [
    { input: [3, "'verde'"], isLocked: false, expectedOutput: 'Trox' },
    { input: [2, "'laranja'"], isLocked: false, expectedOutput: 'Blonk' },
    { input: [6, "'marrom'"], isLocked: false, expectedOutput: 'Plimp' },
    { input: [4, "'preto'"], isLocked: false, expectedOutput: 'desconhecido' },
  ],
  texts: [
    {
      type: 'image',
      content: 'Saindo do portal com sucesso!',
      picture: 'fogete-saindo-do-portal.jpg',
    },
    {
      type: 'default',
      content:
        'Conseguimos sair pelo portal roxo 🚀! Só que agora paramos em um planeta desconhecido.',
      picture: 'panda-andando-com-bambu.jpg',
    },
    {
      type: 'image',
      content: 'Hahaha!',
      picture: 'alien-de-um-olho.jpg',
    },
    {
      type: 'default',
      content:
        'Está vindo uma raça estranha em nossa direção, e o foguete está com problema em reconhecê-la.',
      picture: 'panda-andando-com-bambu.jpg',
    },
    {
      type: 'default',
      content:
        'Está vindo uma raça estranha em nossa direção, mas o foguete está com problema em reconhecê-la.',
      picture: 'panda-andando-com-bambu.jpg',
    },
    {
      type: 'default',
      content:
        'Contudo, ela possui caracteríscas comuns com outras raças no banco de dados (várias olhos e cor diferenciada)',
      picture: 'panda-andando-com-bambu.jpg',
    },
    {
      type: 'list',
      content: 'Existem 3 raças com esse fenótipo:',
      items: [
        'Trox: se tiver 3 olhos e cor verde',
        'Blonk: se tiver 2 olhos e cor laranja',
        'Blonk: se tiver 2 olhos e cor laranja',
        'Plimp: se tiver 6 olhos e cor marrom',
      ],
      picture: 'panda-andando-com-bambu.jpg',
    },
    {
      type: 'quote',
      title: 'O que fazer?',
      content:
        'O seu desafio é escrever um programa que escreva o nome da raça de acordo com esses dados. Se não se encaixarem em nenhuma das raças conhecidas, o programa deve escrever "desconhecido".',
      picture: 'panda-andando-com-bambu.jpg',
    },
    {
      type: 'code',
      content: `Entrada: 3, "verde"
Resultado: Trox

Entrada: 2, "laranja"
Resultado: Blonk

Entrada: 6, "marrom"
Resultado: Plimp`,
      isRunnable: false,
    },
    {
      type: 'alert',
      content:
        'Você pode resolver esse desafio usando tanto estrutura `se senao` `se e senao`, quanto `escolha caso`.',
      picture: 'panda-andando-com-bambu.jpg',
    },
    {
      type: 'alert',
      content:
        'Caso você tenha esquecido como se escreve esses comandos, você pode visualizar todos os comandos disponíveis apertando `Shift + K` no editor de código ao lado',
      picture: 'panda-andando-com-bambu.jpg',
    },
    {
      type: 'alert',
      content:
        'Por favor, não remova os comando `leia()`, pois será a partir deles que virão os dados para o seu programa.',
      picture: 'panda-andando-com-bambu.jpg',
    },
  ],
}
