export const challenge = {
  title: 'Chuva de asteroides',
  difficulty: 'easy',
  downvotes: 0,
  upvotes: 0,
  total_completitions: 0,
  created_by: 'Apollo',
  user_id: '38976417-7c77-44ff-9e26-5dc8b457f768',
  topic_id: 'f60a0e67-c0b9-401a-a652-c9d5f8042ff1',
  code: `var asteroideA = leia()
var asteroideB = leia()
var asteroideC = leia()
var escudoAtivo = leia()
  
var resistencia = 700

// Escreva seu código abaixo`,
  function_name: null,
  texts: [
    {
      type: 'image',
      picture: 'foquete-viajando.jpg',
      content: '...',
    },
    {
      content:
        'Faz alguns minutos que seu foguete saiu para o espaço, mas ele já encontrou um planeta à vista!.',
      type: 'default',
      picture: 'panda.jpg',
    },
    {
      content: 'Porém, há três asteroides gigantes vindo em sua direção.',
      type: 'default',
      picture: 'panda-triste.jpg',
    },
    {
      content: 'Que??',
      type: 'user',
    },
    {
      content:
        'Seu dever é testar se o escudo protetor do foguete está ativo (valor *verdadeiro*) e que a resistência (valor *700*) é maior que a soma das forças dos três asteroides: A, B e C',
      type: 'quote',
      picture: 'panda-abracando-bambu.jpg',
    },
    {
      type: 'code',
      content: `Entrada: 100, 200, 300, verdadeiro
Resultado: verdadeiro
/* Explicação: 
 a soma das forças dá 600 e a resistencia é 700 
 Como o escudo está ativo (verdadeiro) e essa soma é menor que 700,
 logo, o resultado é verdadeiro
*/
// --------------------------------------
Entrada: 500, 500, 500, verdadeiro
Resultado: falso
/* Explicação:
 a soma é 1500 e a resitência é 700
 logo, o resultado já é de cara falso
*/
// --------------------------------------
Entrada: 50, 100, 150, falso
Resultado: falso
/* Explicação: 
 a soma é 300 e a resitência é 700,
 porém o escudo não está ativo,
 então, o resultado é falso
*/`,
      isRunnable: false,
    },
    {
      content:
        'Dica: coloque a soma das forças em uma variável chamada *soma* e depois compare se ela é maior ou não que a resistência.',
      type: 'alert',
      picture: 'panda-olhando-de-lado.jpg',
    },
    {
      content:
        'Não se esqueça de comparar também se o escudo está ativo ou não.',
      type: 'alert',
      picture: 'panda-piscando-sentado.jpg',
    },
    {
      content:
        'O comando *leia()* é super importante para resolver o desafio. Então, por favor, não remova nenhum comando *leia()* no código.',
      type: 'alert',
      picture: 'panda-piscando.jpg',
    },
  ],
  testCases: [
    {
      input: [100, 100, 100, 'verdadeiro'],
      isLocked: false,
      expectedOutput: 'verdadeiro',
    },
    {
      input: [300, 400, 800, 'verdadeiro'],
      isLocked: false,
      expectedOutput: 'falso',
    },
    {
      input: [50, 200, 200, 'falso'],
      isLocked: false,
      expectedOutput: 'falso',
    },
    {
      input: [100, 500, 100, 'falso'],
      isLocked: false,
      expectedOutput: 'falso',
    },
  ],
}
