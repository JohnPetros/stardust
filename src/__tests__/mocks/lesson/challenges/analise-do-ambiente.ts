import { Challenge } from '@/@types/challenge'

export const challenge: Challenge = {
  id: 'Análise do ambiente',
  slug: 'analise-do-ambiente',
  description: '',
  star_id: '2',
  created_at: '',
  categories: [],
  total_completitions: 0,
  isCompleted: true,
  title: 'Análise do ambiente',
  difficulty: 'easy',
  downvotes: 0,
  upvotes: 0,
  user_slug: 'apollo',
  doc_id: 'f60a0e67-c0b9-401a-a652-c9d5f8042ff1',
  code: `var nome = "Datahon"
var temperatura = 53.5
var temOxigenio = falso

var tipoNome
var tipoTemperatura
var tipoOxigenio

escreva()`,
  function_name: null,
  test_cases: [
    {
      id: 1,
      input: [],
      isLocked: false,
      expectedOutput: 'Datahon: texto, 53.5: número, falso: lógico',
    },
  ],
  texts: [
    {
      type: 'default',
      content: 'Parece que permitiram você adentrar no planeta Datahon!',
      picture: 'panda.jpg',
    },
    {
      type: 'default',
      content:
        'Entretanto, é melhor fazer uma análise do ambiente antes de fazer um pouso seguro.',
      picture: 'panda-piscando.jpg',
    },
    {
      type: 'default',
      content:
        'Isso o seu foguete já fez de antemão, retornando para você dados do planeta como *nome*, *temperatura* e *se tem tipo Oxigênio*.',
      picture: 'panda-olhando-computador.jpg',
    },
    {
      type: 'quote',
      content:
        'Sua missão é escrever qual o tipo de cada um dos dados na ordem em que são declarados, veja um exemplo:',
      picture: 'panda-olhando-computador.jpg',
    },
    {
      type: 'code',
      content: `
var nomeEstrela = "Proxima Centauri"
var temperatura = 100
var temCorAmarela = falso

escreva(
  "\${nomeEstrela}: texto, \${temperatura}: numero, \${temCorAmarela}: falso"
)

/* Resultado: 
   Proxima Centauri: texto, 100: número, falso: lógico
*/

`,
      picture: 'panda.jpg',
      isRunnable: false,
    },
    {
      type: 'alert',
      content:
        'Dica: você pode colocar o nome dos tipos em variáveis e concatená-las com os textos usando *interpolação* ou *operador de adição*.',
      picture: 'panda-sorrindo.jpg',
    },
    {
      type: 'alert',
      content:
        'Você pode ver como deve ser o resultado esperado clicando na aba de *resultado* acima',
      picture: 'panda-sorrindo.jpg',
    },
    {
      type: 'alert',
      content:
        'Por favor, não remova os comando *leia()*, pois será a partir deles que virão os dados para o seu programa.',
      picture: 'panda-andando-com-bambu.jpg',
    },
  ],
}
