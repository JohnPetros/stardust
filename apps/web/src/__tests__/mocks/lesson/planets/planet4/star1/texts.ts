import { Text } from '@/@types/Text'

export const texts: Text[] = [
  {
    type: 'image',
    content: 'Muito bem!! você se salvou da chuva de asteroides gigantes 🎉!.',
    picture: 'foquete-viajando.jpg',
  },
  {
    type: 'default',
    content:
      'Agora, resta visitar o novo planeta que você descobriu, e por sorte ele é totalmente amigável!',
    picture: 'panda-deslumbrado.jpg',
  },
  {
    type: 'user',
    content: 'Pera aí! Como você sabe disso?',
  },
  {
    type: 'default',
    content:
      'Simples, o foguete entende estruturas condicionais sempre que a situação pede.',
    picture: 'panda-piscando-sentado.jpg',
  },
  {
    type: 'user',
    content: 'Que? Estruturas condicionais?',
  },
  {
    content:
      'Sim! Estruturas condicionais são recursos da programação que permitem que um trecho de código seja executado apenas se uma determinada condição for verdadeira.',
    type: 'default',
    picture: 'panda-piscando.jpg',
  },
  {
    content: 'Há 3 maneiras de criar uma instrução condicional:',
    items: ['1 - se', '2 - senão', '3 - senão se'],
    type: 'list',
    picture: 'panda-andando-com-bambu.jpg',
  },
  {
    content: 'Por enquanto, vamos começar pelo básico.',
    type: 'alert',
    picture: 'panda-piscando.jpg',
  },
  {
    content:
      'A forma mais básica é escrever *se* e depois a condição que deve ser verificada entre parênteses. Em seguida você abre e fecha chaves *{ }* e coloca o bloco de código que você deseja que seja executado.',
    type: 'quote',
    picture: 'panda-andando-com-bambu.jpg',
    title: 'Estrutura condicional simples (se)',
  },
  {
    type: 'code',
    content: `var planetaAmigavel = verdadeiro

se (planetaAmigavel) {
  escreva(planetaAmigavel)
}

//  Resultado: verdadeiro`,
    isRunnable: true,
  },
  {
    content:
      'Perceba que a condição, ou seja tudo aquilo escrito em parênteses após o *se*, deve resultar em *verdadeiro* para que o código entre chaves seja executado.',
    type: 'default',
    picture: 'panda-deslumbrado.jpg',
  },
  {
    content: 'Mas se não for?',
    type: 'user',
  },
  {
    content:
      'Simples: tudo que está entre chaves do *se* é ignorado, enquanto o resto do programa é executado.',
    type: 'default',
    picture: 'panda-dando-risadinha.jpg',
  },
  {
    content: `var souBonito = falso
    
se (souBonito) {
  escreva(souBonito)
}

escreva(souBonito)`,
    picture: 'panda-deslumbrado.jpg',
    isRunnable: true,
    type: 'code',
  },
  {
    content: 'Só isso?',
    type: 'user',
  },
  {
    content:
      'Além disso, nós podemos usar tudo que vimos anteriormente que consegue resultar em valores lógicos dentro do bloco de código do *se*.',
    type: 'default',
    picture: 'panda-de-oculos.jpg',
  },
  {
    content: `var poder = 8000 * 1000
    
se (poder > 8000) {
  escreva('Seu poder é mais de 8 mil!')
}

//  Resultado: Seu poder é mais de 8 mil!`,
    picture: 'panda-deslumbrado.jpg',
    isRunnable: true,
    type: 'code',
  },
  {
    content: 'Entendi!',
    type: 'user',
  },
  {
    content:
      'Bacana, mas acho que já é hora de você entender o que é escopo de variável.',
    type: 'default',
    picture: 'panda-deslumbrado.jpg',
  },
  {
    content: 'Esopo?!',
    type: 'user',
  },
  {
    content:
      'Não, escopo. No geral, o escopo é a região do código em que uma variável pode ser acessada dentro do programa.',
    type: 'default',
    picture: 'panda-andando-com-bambu.jpg',
  },
  {
    content: 'Como assim?',
    type: 'user',
  },
  {
    content:
      'Em programação, normalmente existem dois tipos de escopo de variável: *global* e *local*.',
    type: 'default',
    picture: 'panda-sorrindo.jpg',
  },
  {
    content:
      'As variáveis globais são aquelas que são declaradas fora de qualquer tipo de instrução como *se*, *para*, *função* e por aí vai.',
    type: 'default',
    picture: 'panda-andando-com-bambu.jpg',
  },
  {
    content: 'Como assim? Para? Função?',
    type: 'user',
    picture: 'panda-deslumbrado.jpg',
  },
  {
    content:
      'No momento se concentre apenas na instrução *se* que estamos aprendendo agora.',
    type: 'alert',
    picture: 'panda-deslumbrado.jpg',
  },
  {
    content:
      'Por exemplo, caso tentemos acessar uma variável declarada dentro de *se*, o código resultará em *variável não definida*',
    type: 'default',
    picture: 'panda-sorrindo.jpg',
  },
  {
    content: `var planetaAmigavel = verdadeiro // variável global

se (verdadeiro) {
  var planetaNome = "Ifthenia" // variável local
}

escreva(planetaNome)

//  Resultado: Variável não definida: planetaNome`,
    isRunnable: true,
    type: 'code',
  },
  {
    content:
      'O erro no código acima ocorre, pois *planetaNome* é uma variável local porque ela foi declarada dentro do bloco de código do *se*.',
    type: 'default',
    picture: 'panda-fazendo-coracao.jpg',
  },
  {
    content: 'Então, é só colocar para fora do *se*?',
    type: 'user',
  },
  {
    content:
      'Sim! Aí você tranformaria ela em uma variável de escopo *global*, assim como a variável *planetaAmigavel*.',
    type: 'default',
    picture: 'panda-deslumbrado.jpg',
  },
  {
    content: `var planetaAmigavel = verdadeiro // variável global
var planetaNome = "Ifthenia"// variável global

se (verdadeiro) {
  escreva(planetaNome)
}

escreva(planetaAmigavel)

//  Resultado: Ifthenia verdadeiro`,
    isRunnable: true,
    type: 'code',
  },
  {
    content: 'Humm...',
    type: 'user',
  },
  {
    content:
      'É como se os escopos fossem dois universos paralelos: Pode haver uma variável *local* com o mesmo nome de uma *global*, porém elas ainda vão ser diferentes entre si.',
    type: 'default',
    picture: 'panda-olhando-de-lado.jpg',
  },
  {
    content: 'Entendi tudo!',
    type: 'user',
  },
  {
    content:
      'Legal! Então, que tal conhecer mais sobre esse novo planeta chamado *Ifthenia*?',
    type: 'default',
    picture: 'panda-sorrindo.jpg',
  },
]
