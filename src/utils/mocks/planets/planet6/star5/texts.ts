export const texts = [
  { body: 'Ok, mas ainda temos um problema.', type: 'default', title: null },
  {
    body: 'Eu disse que o método "fatiar()" não altera o vetor original, mas sim gera um novo.',
    type: 'default',
    title: null,
  },
  {
    body: 'A nossa sorte que é existe um método que pode fazer a mesma coisa que o "fatiar()" faz, mas alterando o vetor original.',
    type: 'default',
    title: 'E agora?',
  },
  { body: 'O método "encaixar()".', type: 'default', title: 'Fala logo qual!' },
  {
    body: 'O método "encaixar()" pode ser utilizado de várias maneiras, mas a principal é remover elementos de um vetor.',
    type: 'list',
    title: 'Encaixar()',
  },
  {
    body: 'Nos parênteses do "encaixar()" é necessário colocar 2 números obrigatórios.\nO primeiro indica a partir de qual índice/posição do vetor devem ser removidos os elementos.\n O segundo indica quantos elementos devem ser removidos.',
    type: 'list',
  },
  {
    body: 'var itens = [\n        "fruta",\n        "ovo de Icelope", \n        "amêndua",\n        "cristal", \n        "pirita", \n        "bastão laser quebrado", \n        "fóssil de urso anão",\n        "meteorito congelado"\n];\n    \nitens.encaixar(0, 3);\n    \nescreva(itens);\nescreva(itens.tamanho());\n// Resultado: 5\n    ',
    type: 'code',
    isRunnable: true,
  },
  {
    body: 'Percebeu? O vetor itens foi modificado, restando apenas 5 itens.',
    type: 'default',
    title: null,
  },
  {
    body: 'É método "encaixar()" retorna os elementos removidos por ele. Então, para pegar os alimentos removidos pelo "encaixar()" será preciso criar uma nova varíavel.',
    type: 'default',
    title: 'Mas e quanto aos alimentos?',
  },
  {
    body: 'var itens = [\n        "fruta",\n        "ovo de Icelope", \n        "amêndua",\n        "cristal", \n        "pirita", \n        "bastão laser quebrado", \n        "fóssil de urso anão",\n        "meteorito congelado"\n];\n    \n// encaixar(0, 3) = Começar a partir da posição 0 e remover 3 elementos\nvar alimentos = itens.encaixar(0, 3);\nescreva(alimentos);\n// Resultado: fruta, ovo de Icelope, amêndua',
    type: 'code',
    isRunnable: true,
  },
  {
    body: 'Agora sim! Conseguimos remover os alimentos do vetor principal e colocamos em um vetor separado.',
    type: 'default',
    title: null,
  },
  {
    body: 'Agora vamos fazer com os demais itens.',
    type: 'default',
    title: null,
  },
  {
    body: 'var itens = [\n        "fruta",\n        "ovo de Icelope", \n        "amêndua",\n        "cristal", \n        "pirita", \n        "bastão laser quebrado", \n        "fóssil de urso anão",\n        "meteorito congelado"\n];\n\nvar alimentos = itens.encaixar(0, 3);\nvar minerais = itens.encaixar(3, 5);\nvar ferramentas = itens.encaixar(5, 6);\nvar exoticos = itens.encaixar(6);\n\nescreva(alimentos);\nescreva(minerais);\nescreva(ferramentas);\nescreva(exoticos);\n\n// Aperte em executar para ver o resultado catastrófico',
    type: 'code',
    isRunnable: true,
  },
  {
    body: 'Sim. Acontece que toda vez que o "encaixar()" é executado, os itens são removidos do vetor original, correto? Então na próxima execução, o vetor itens terá menos elementos do que o esperado.',
    type: 'default',
    title: 'Pera aí, mas agora deu tudo errado!',
  },
  {
    body: 'Isso é para mostrar que o "encaixar()" não fuciona da mesma maneira que o "fatiar()".',
    type: 'default',
    title: null,
  },
  {
    body: 'Lembre-se: A diferença entre os dois é que o segundo número do "encaixar()" indica a QUANTIDADE de elementos que serão removidos, enquanto o do "fatiar()" indica o ponto de parada da fatia. E apenas o "encaixar()" consegue alterar o vetor original.',
    type: 'alert',
  },
  {
    body: 'Agora vamos fazer do jeito certo. Nesse caso, basta começarmos sempre da posição zero, já que estamos sempre removendo os primeiros itens do vetor itens.',
    type: 'default',
    title: null,
  },
  {
    body: 'var itens = [\n        "fruta",\n        "ovo de Icelope", \n        "amêndua",\n        "cristal", \n        "pirita", \n        "bastão laser quebrado", \n        "fóssil de urso anão",\n        "meteorito congelado"\n];\n\nvar alimentos = itens.encaixar(0, 3);\nvar minerais = itens.encaixar(0, 2);\nvar ferramentas = itens.encaixar(0, 1);\nvar exoticos = itens.encaixar(0);\n\nescreva(alimentos);\nescreva(minerais);\nescreva(ferramentas);\nescreva(exoticos);\n\nescreva(itens)',
    type: 'code',
    isRunnable: true,
  },
  { body: 'Agora sim!', type: 'default', title: null },
  {
    body: 'Veja que no último foi colocado apenas um número. Isso quer dizer que se você passar apenas um número no "encaixar()" ele vai remover todo os itens do vetor a partir desse índice.',
    type: 'default',
    title: null,
  },
  {
    body: 'Veja também que agora o vetor itens está vazio, então nos livramos completamente dele. Agora sim podemos continuar nossa exploração.',
    type: 'default',
    title: null,
  },
  { body: '...', type: 'default', title: null },
  {
    body: 'Já andamos faz algum tempo, mas ainda não encontramos mais nada interessante.',
    type: 'default',
    title: null,
  },
  {
    body: 'Pera aí! Acabamos de receber uma mensagem no nosso radar:',
    type: 'default',
    title: null,
  },
  {
    body: 'var mensagem = ["Saia", 1, "planeta", 0, 2];\nvar textos = ["é", "daí", "perigoso"];',
    type: 'code',
    isRunnable: false,
  },
  {
    body: 'Parece que compramos um radar bem vagabundo. A messagem veio toda em pedaços.',
    type: 'default',
    title: null,
  },
  {
    body: 'Para nossa sorte acabamos de conhecer o método "encaixar()".',
    type: 'default',
    title: null,
  },
  {
    body: 'Lembra que eu disse que o "encaixar()" tem várias funções? Você deve ter se perguntado, por que "encaixar" tem esse nome? É porque com ele podemos remontar qualquer vetor, removendo ou adicionando itens.',
    type: 'default',
    title: 'E daí?',
  },
  {
    body: 'Sim, podemos adicionar itens usando "encaixar()". Para isso, deve-se passar um terceiro valor, mas não um número e sim o item que você queira adicionar.',
    type: 'list',
  },
  {
    body: 'É possível ver que no vetor mensagem, há números indicando onde os itens do vetor textos devem ser colocados para completar a mensagem.',
    type: 'default',
    title: null,
  },
  {
    body: 'Então faremos isso: primeiro encaixaremos a palavra "daí" onde está o índice 1',
    type: 'default',
    title: null,
  },
  {
    body: 'var mensagem = ["Saia", 1, "planeta", 3];\n\nvar textos = ["perigoso", "daí"];\n\n// encaixar(1, 1, "daí") = A partir do índice 1 do vetor mensagem remover um elemento e adicionar o texto "daí"\nmensagem.encaixar(1, 1, "daí");\n\nescreva(mensagem);\n// Resultado: Saia, daí, planeta, 3',
    type: 'code',
    isRunnable: true,
  },
  {
    body: 'Se o número do meio fosse zero, nenhum elemento seria removido, ou seja, o resultado seria:\nSaia, 1, daí, planeta, 3.',
    type: 'alert',
  },
  {
    body: 'Mas ao colocar 1, o método "encaixar()" torna-se uma boa maneira também de substituir um valor de um vetor por outro.',
    type: 'alert',
  },
  { body: 'Agora colocaremos a outra palavra.', type: 'default', title: null },
  {
    body: 'var mensagem = ["Saia", "daí", "planeta", 3];\n\nvar textos = ["perigoso", "daí"];\n\n// encaixar(3, 1, "perigoso") = A partir do índice 3 remover um elemento e colocar o texto "perigoso"\nmensagem.encaixar(3, 1, "perigoso");\n\nescreva(mensagem);\n// Resultado: Saia, daí, planeta, perigoso',
    type: 'code',
    isRunnable: true,
  },
  {
    body: 'Agora temos uma resultado:\nSaia, daí, planeta, perigoso',
    type: 'default',
    title: null,
  },
  {
    body: 'Ok... Então esse planeta deve ser mais perigoso do que eu pensava. Mas agora eu pergunto: quem será que mandou essa mensagem?',
    type: 'default',
    title: null,
  },
]
