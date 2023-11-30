export const challenge = {
  title: 'Removendo sapos',
  difficulty: 'easy',
  downvotes: 0,
  upvotes: 0,
  total_completitions: 0,
  created_by: 'Apollo',
  topic_id: 'f60a0e67-c0b9-401a-a652-c9d5f8042ff1',
  code: `var alimentos = leia()

var alimentosSaudaveis = []

para cada alimento em alimentos {

}

escreva(alimentosSaudaveis)`,
  function_name: null,
  tests_cases: [
    {
      input: [["'manga'", "'sapo gasoso'", "'berinjela'"]],
      expectedOutput: 'manga,berinjela',
      isLocked: false,
    },
    {
      input: [
        [
          "'sapo condensado'",
          "'cebola doce'",
          "'camarão de batata'",
          "'sapo de morango'",
        ],
      ],
      expectedOutput: 'cebola doce,camarão de batata',
      isLocked: false,
    },
    {
      input: [["'sorvete de sapo'", "'requeijão'"]],
      expectedOutput: 'requeijão',
      isLocked: true,
    },
  ],
  texts: [
    {
      type: 'default',
      content: 'Enfim, são e salvos em nosso foguete. Está com fome?',
      picture: 'panda-andando-com-bambu.jpg',
    },
    {
      type: 'default',
      content:
        'O foguete no caminho ao resgate pegou vários alimentos para fazer nosso jantar, veja alguns:',
      picture: 'panda-sentado-com-mochila.jpg',
    },
    {
      type: 'code',
      content: `var alimentos = [
  "lentilha lunar"
  "sapo lunar"
  "iogurte de gelo"
  "sapo lácteo"
]`,
      picture: 'panda-andando-com-bambu.jpg',
      isRunnable: false,
    },
    {
      type: 'user',
      title: 'Sapo?',
    },
    {
      type: 'default',
      content:
        'Por algum motivo o foguete incluiu sapos entre os alimentos, eca!',
      picture: 'panda-espantado.jpg',
    },
    {
      type: 'quote',
      title: 'Desafio:',
      content:
        'Seu papel é remover todos os itens do vetor alimentos que incluam a palavra "sapo" no nome.',
      picture: 'panda-sorrindo.jpg',
    },
    {
      type: 'code',
      content: `
Entrada: [pimentão, sapo de só, melancia]
Resultado: [pimentão, melancia]

Entrada: [sapo de caju, sapo kiwi, milho de ricota]
Resultado: [milho de ricota]

Entrada: [cevada, tamarindo, sapo coalhado]
Resultado: [cevada, tamarindo]`,
      isRunnable: false,
    },
    {
      type: 'alert',
      content:
        'Para facilitar seu trabalho já coloquei um laço `para-cada` no seu código, mas você pode usar outro laço se preferir.',
      picture: 'panda-oferecendo-bambu.jpg',
    },
    {
      type: 'alert',
      content:
        'Lembre-se dos métodos de vetor, caso esqueça algum você pode conferir no dicionário na barra acima do editor de código.',
      picture: 'panda-fazendo-coracao.jpg',
    },
  ],
}
