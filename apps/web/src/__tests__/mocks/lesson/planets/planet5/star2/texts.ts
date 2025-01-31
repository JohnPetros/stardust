import type { TextBlockDto } from '@stardust/core/global/dtos'

export const texts: TextBlockDto[] = [
  {
    type: 'default',
    content: 'Com as amostras coletadas e o analisador pronto, resta analisá-las.',
    picture: 'panda-amando-bambu.jpg',
  },
  {
    type: 'default',
    content:
      'Porém, para o foguete fazer a análise ele precisa abrir uma conexão com o analisador. Além disso, a conexão em si precisa estar ativa enquanto ocorre a análise.',
    picture: 'panda-piscando-sentado.jpg',
  },
  {
    type: 'default',
    content:
      'Para fazer o programa a partir disso podemos usar outro tipo de laço, conhecido como *enquanto*.',
    picture: 'panda-piscando-sentado.jpg',
  },
  {
    type: 'default',
    content: 'Para escrever esse laço será mais facil que o *para*.',
    picture: 'panda-dando-risadinha.jpg',
  },
  {
    type: 'quote',
    title: 'enquanto',
    content:
      'O *enquanto* apenas precisa de uma condição, que enquanto for verdadeira, será executado tudo o que estiver no seu bloco de código repetidas vezes.',
    picture: 'panda-olhando-de-lado.jpg',
  },
  {
    type: 'default',
    content:
      'No nosso caso, como temos no total 10 amostras, sempre que uma for analisada, será subtraído 1 do total.',
    picture: 'panda-piscando-sentado.jpg',
  },
  {
    type: 'code',
    content: `var conexaoAtiva = verdadeiro
var totalAmostras = 10

enquanto(conexaoAtiva) {
  totalAmostras--
}

escreva(totalAmostras)
// Resultado: 0`,
    isRunnable: false,
  },
  {
    type: 'alert',
    content:
      'Perceba que foi utilizado outro operador especial, no caso o operador de *decremento*, ou seja, ao contrario do de *incremento*, ele subtrai 1 do valor atual de uma variável.',
    picture: 'panda-olhando-computador.jpg',
  },
  {
    type: 'image',
    content: 'Erro!',
    picture: 'analisador-zangado.jpg',
  },
  {
    type: 'user',
    content: 'O que houve?',
  },
  {
    type: 'default',
    content:
      'Como dito, o comando *enquanto* executará tudo que estiver no seu bloco enquanto sua condição for verdadeira.',
    picture: 'panda-de-oculos.jpg',
  },
  {
    type: 'default',
    content:
      'O que acontece é que com o código desse jeito, a execução nunca terminará, pois a variável *conexaoAtiva* sempre será verdadeira até o fim do programa.',
    picture: 'panda-triste.jpg',
  },
  {
    type: 'user',
    content: 'Vish...',
  },
  {
    type: 'default',
    content:
      'Chamamos isso de laço infinito, o que sempre deve ser evitado em qualquer programa. ',
    picture: 'panda-triste.jpg',
  },
  {
    type: 'default',
    content:
      'Para evitar isso podemos modificar a condição, de modo que haja uma variável de controle.',
    picture: 'panda-olhando-de-lado.jpg',
  },
  {
    type: 'default',
    content:
      'Neste caso, podemos colocar a variavel `totalAmostras` na condição, dizendo que enquanto ela for maior que zero continue executando o que estiver em seu bloco.',
    picture: 'panda-segurando-bambu-de-pe.jpg',
  },
  {
    type: 'code',
    content: `var conexaoAtiva = verdadeiro
var totalAmostras = 10

enquanto(conexaoAtiva e totalAmostras > 0) {
  totalAmostras--
}

escreva(totalAmostras)
// Resultado: 0`,
    isRunnable: true,
  },
  {
    type: 'default',
    content:
      'Assim, a partir do momento em que `totalAmostras` for igual a zero, o enquanto é encerrado. ',
    picture: 'panda-sorrindo.jpg',
  },
  {
    type: 'default',
    content:
      'É possivel também forçar o `enquanto` parar de ser executado. Para isso, é preciso usar um comando especial chamada `pausa`.',
    picture: 'panda-olhando-de-lado.jpg',
  },
  {
    type: 'default',
    content:
      'Por exemplo, caso queiramos que apenas cinco amostras sejam analisadas, podemos colocar o *pausa* quando a variável *totalAmostras* for igual a esse valor:',
    picture: 'panda-sorrindo.jpg',
  },
  {
    type: 'code',
    content: `var conexaoAtiva = verdadeiro
var totalAmostras = 10

enquanto (conexaoAtiva e totalAmostras > 0) {
  se (totalAmostras == 5) {
    pausa
  }

  totalAmostras--
}

escreva(totalAmostras)
// Resultado: 5`,
    isRunnable: true,
  },
  {
    type: 'user',
    content: 'Legal!',
  },
  {
    type: 'default',
    content: 'É claro, isso também funciona para outros tipos de laço, como o *para*.',
    picture: 'panda-andando-com-bambu.jpg',
  },
  {
    type: 'default',
    content:
      'Por exemplo, é totalmente possível realizar o que acabamos de fazer usando um *para* também.',
    picture: 'panda-andando-com-bambu.jpg',
  },
  {
    type: 'code',
    content: `var conexaoAtiva = verdadeiro
var totalAmostras = 10

para (;totalAmostras > 0 e conexaoAtiva; totalAmostras--) {
  se (totalAmostras == 5) {
    pausa
  }
}

escreva(totalAmostras)
// Resultado: 5`,
    picture: 'panda-andando-com-bambu.jpg',
    isRunnable: true,
  },
  {
    type: 'user',
    content: 'Espera aí, o *para* só está com 2 parâmetros?',
  },
  {
    type: 'alert',
    content:
      'Sim, veja que não há inicialização nesse *para*, pois a variável de controle, no caso *totalAmostras*, foi declarada fora dele, e ao invés de incremetá-la na expressão final, estamos decrementando-a.',
    picture: 'panda-piscando-sentado.jpg',
  },
  {
    type: 'user',
    content: 'Mas quando usar *para* ou *enquanto*?',
  },
  {
    type: 'alert',
    content:
      'Boa pergunta, usamos o *enquanto* apenas em situações que não sabemos quantas repetições o laço irá ter, e o *para* quando já sabemos disso.',
    picture: 'panda.jpg',
  },
  {
    type: 'user',
    content: 'Entendi!',
  },
  {
    type: 'image',
    content: 'Ok. Análise feita com sucesso!',
    picture: 'analisador-analisando.jpg',
  },
  {
    type: 'default',
    content:
      'Agora com as amostras devidamente analisadas, já temos a reposta de qual planeta estamos.',
    picture: 'panda-fazendo-coracao.jpg',
  },
]
