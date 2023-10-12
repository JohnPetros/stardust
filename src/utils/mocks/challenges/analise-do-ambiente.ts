export const challenge = {
  title: 'Análise do ambiente',
  difficulty: 'easy',
  downvotes: 0,
  upvotes: 0,
  total_completitions: 0,
  created_by: '38976417-7c77-44ff-9e26-5dc8b457f768',
  topic_id: 'f60a0e67-c0b9-401a-a652-c9d5f8042ff1',
  code: `var nome = "Datahon"
var temperatura = 53.5
var temOxigenio = falso

var tipoNome
var tipoTemperatura
var tipoOxigenio

escreva()`,
  function_name: null,
  tests_cases: [
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
        'Isso o seu foguete já fez de antemão, retornando para você dados do planeta como nome, temperatura e se tem ar respirável.',
      picture: 'panda-olhando-computador.jpg',
    },
    {
      type: 'quote',
      content:
        'Sua missão é escrever qual o tipo de cada um dos daods na ordem em que são declarados, veja um exemplo:',
      picture: 'panda-olhando-computador.jpg',
    },
    {
      type: 'code',
      content: `
var nomeEstrela = "Proxima Centauri"
var temperatura = 100
var temCorAmarela = falso
escreva("\${nomeEstrela}: texto, \${temperatura}: numero, \${temCorAmarela}: falso")

// Resultado: Proxima Centauri: texto, 100: número, falso: lógico`,
      picture: 'panda.jpg',
    },
    {
      type: 'alert',
      content:
        'Dica: você pode colocar o nome dos tipos em variáveis e concatená-las com os textos usando `interpolação` ou operador de adição.',
      picture: 'panda-sorrindo.jpg',
    },
  ],
}
