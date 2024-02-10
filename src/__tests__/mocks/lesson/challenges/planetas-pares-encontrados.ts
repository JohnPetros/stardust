import { Challenge } from '@/@types/Challenge'

export const challenge: Partial<Challenge> = {
  id: '5',
  title: 'Planetas pares encontrados',
  slug: 'Planetas pares encontrados',
  description: '',
  star_id: '4',
  created_at: '',
  categories: [],
  total_completitions: 0,
  isCompleted: true,
  difficulty: 'easy',
  downvotes: 0,
  upvotes: 0,
  user_slug: 'apollo',
  doc_id: 'f60a0e67-c0b9-401a-a652-c9d5f8042ff1',
  function_name: null,
  test_cases: [
    { id: 1, input: [10], isLocked: false, expectedOutput: 5 },
    { id: 2, input: [7], isLocked: false, expectedOutput: 3 },
    { id: 3, input: [1], isLocked: false, expectedOutput: 0 },
    { id: 4, input: [0], isLocked: false, expectedOutput: 0 },
  ],
  code: `var totalPlanetas = leia();
var totalPlanetasSeguros = 0;
  
// Utilize o escreva abaixo dentro do seu laço
escreva(totalPlanetasSeguros)`,
  texts: [
    {
      type: 'default',
      content:
        'Escapamos da explosão por um triz. Só que agora resta procurar outro planeta para explorar.',
      picture: 'panda-abracando-bambu.jpg',
    },
    {
      type: 'default',
      content:
        'O radar do foguete indentificou uma quantidade de planetas, porém ele diz que apenas os planetas pares realmente são seguros',
      picture: 'panda-olhando-de-lado.jpg',
    },
    {
      content:
        'Da quantidade total de planetas identificados (começando pelo 1) o seu papel é mostrar a quantidade de planetas que são seguros.',
      type: 'quote',
      title: 'Seu desafio',
      picture: 'panda.jpg',
    },
    {
      type: 'code',
      content: `Entrada: 8
// Resultado: 4
// Explicacao: entre 1 e 8, há 4 números pares

Entrada: 13
// Resultado: entre 1 e 13 há 6 números pares

Entrada: 1
Resultado: 0
// Explicacao: entre 1 e 1 não há números pares`,
      isRunnable: false,
    },
    {
      content:
        'Para resolver esse desafio, você pode usar qualquer um dos 3 tipos de laço (`para`, `enquanto` ou `fazer enquanto`)',
      type: 'alert',
      picture: 'panda-piscando-sentado.jpg',
    },
    {
      content:
        'Dica: para saber se um número é par, você pode verificar o módulo do número por 2, usando o operador `%`, ou seja, dividir por dois e verificar se há resto de divisão. Por exemplo: 4 é par, pois 4 módulo 2 (`4 % 2`) é igual a zero; 5 é ímpar, pois 5 módulo 2 é diferente de zero (`5 % 2`).',
      type: 'alert',
      picture: 'panda-piscando.jpg',
    },
  ],
}
