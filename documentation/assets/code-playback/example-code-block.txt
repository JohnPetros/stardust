import type { TextBlockDto } from '@stardust/core/global/entities/dtos'

export const texts: TextBlockDto[] = [
  {
    type: 'image',
    content: 'Aqui estamos mais uma vez no espaço.',
    picture: 'foquete-viajando.jpg',
  },
  {
    type: 'default',
    content: 'Só que agora temos que procurar quem mandou aquela mensagem de ajuda.',
    picture: 'panda-pensando.jpg',
  },
  {
    type: 'default',
    content:
      'E agora, com o radar do próprio foguete, não precisamos mais daquele que compramos.',
    picture: 'panda-comemorando.jpg',
  },
  {
    type: 'image',
    content: 'E por falar em mensagem, acabamos de receber mais uma.',
    picture: 'celular.jpg',
  },
  {
    type: 'default',
    content: 'Para visualizar a mensagem, é necessário seguir alguns passos.',
    picture: 'panda-amando-bambu.jpg',
  },
  {
    type: 'quote',
    content: '1 -> Ligar todos os sensores do radar;',
    picture: 'panda.jpg',
  },
  {
    type: 'quote',
    content: '2 -> Verificar se a mensagem contém algum script malicioso;',
    picture: 'panda.jpg',
  },
  {
    type: 'quote',
    content: '3 -> Aumentar a resolução em 20;',
    picture: 'panda.jpg',
  },
  {
    type: 'quote',
    content: '4 -> Verificar se a tela está acesa;',
    picture: 'panda.jpg',
  },
  {
    type: 'quote',
    content: '5 -> Escrever a mensagem na tela.',
    picture: 'panda.jpg',
  },
  {
    type: 'code',
    content: `var mensagem = 'Por favor, me ajudem!'
    
var sensores = [falso, falso, falso]
var resolucao = 10
var telaAcesa = verdadeiro

para (var i = 0; i < sensores.tamanho(); i++) {
  sensores[i] = verdadeiro
}

resolucao += 20

se (!mensagem.inclui('script') e telaAcesa) {
  escreva(mensagem)
}

// Resultado: Por favor, me ajudem!`,
    isRunnable: true,
  },
  {
    type: 'default',
    content:
      'Ok, já entendemos que essa pessoa precisa da nossa ajuda, mas por que ela não fala onde está?',
    picture: 'panda-confuso.jpg',
  },
  {
    type: 'default',
    content:
      'Só nos resta perguntar. Mande uma mensagem escrita: "Quais são suas coordenadas?"',
    picture: 'panda-de-oculos.jpg',
  },
  {
    type: 'default',
    content:
      'Só que, para mandar uma mensagem com o radar, é preciso seguir os mesmos passos de receber uma, por motivos de segurança, é claro.',
    picture: 'panda-sorrindo.jpg',
  },
  {
    type: 'code',
    content: `var mensagem = 'Quais são suas coordenadas?'
    
var sensores = [falso, falso, falso]
var resolucao = 10
var telaAcesa = verdadeiro

para (var i = 0; i < sensores.tamanho(); i++) {
  sensores[i] = verdadeiro
}

resolucao += 20

se (!mensagem.inclui('script') e telaAcesa) {
  escreva(mensagem)
}

// Resultado: Quais são suas coordenadas?`,
    isRunnable: true,
  },
  {
    type: 'default',
    content: 'Isso! Acabamos de receber uma resposta.',
    picture: 'panda-deslumbrado.jpg',
  },
  {
    type: 'code',
    content: `var mensagem = 'Mas por que você quer saber?'
    
var sensores = [falso, falso, falso]
var resolucao = 10
var telaAcesa = verdadeiro

para (var i = 0; i < sensores.tamanho(); i++) {
  sensores[i] = verdadeiro
}

resolucao += 20

se (!mensagem.inclui('script') e telaAcesa) {
  escreva(mensagem)
}
// Resultado: Mas por que você quer saber?`,
    isRunnable: true,
  },
  {
    type: 'default',
    content: 'Ok, responda que é para sabermos onde ela está.',
    picture: 'panda-deslumbrado.jpg',
  },
  {
    type: 'code',
    content: `var mensagem = 'É para saber onde você está'
    
var sensores = [falso, falso, falso]
var resolucao = 10
var telaAcesa = verdadeiro

para (var i = 0; i < sensores.tamanho(); i++) {
  sensores[i] = verdadeiro
}

resolucao += 20

se (!mensagem.inclui('script') e telaAcesa) {
  escreva(mensagem)
}

// Resultado: É para saber onde você está

var mensagem = 'Tem certeza?'
    
var sensores = [falso, falso, falso]
var resolucao = 10
var telaAcesa = verdadeiro

para (var i = 0; i < sensores.tamanho(); i++) {
  sensores[i] = verdadeiro
}

resolucao += 20

se (!mensagem.inclui('script') e telaAcesa) {
  escreva(mensagem)
}

// Resultado: Tem certeza?`,
    isRunnable: true,
  },
  {
    type: 'default',
    content:
      'Ok, isso já está ficando chato. E o código nem cabe mais na sua tela de tão grande.',
    picture: 'panda-triste.jpg',
  },
  {
    type: 'default',
    content: 'Percebeu que estamos repetindo um monte de código?',
    picture: 'panda-segurando-bambu-de-pe.jpg',
  },
  {
    type: 'user',
    content: 'Sim... 😩',
    picture: 'panda-de-oculos.jpg',
  },
  {
    type: 'default',
    content:
      'Então, esta é uma boa ocasião para explicar um conceito importantíssimo na programação.',
    picture: 'panda-de-oculos.jpg',
  },
  {
    type: 'user',
    content: 'Funções?',
  },
  {
    type: 'default',
    content: 'Isso... É, o nome deste módulo já entregou tudo.',
    picture: 'panda-triste.jpg',
  },
  {
    type: 'default',
    content: 'Mas, como prometido, vou explicar o que são funções 🎉.',
    picture: 'panda-sorrindo.jpg',
  },
  {
    type: 'quote',
    title: 'Funções',
    content:
      'Funções nada mais são do que blocos de código que executam uma determinada tarefa e que podem ser reutilizados em diferentes partes de um programa.',
    picture: 'panda-piscando.jpg',
  },
  {
    type: 'quote',
    content: 'As funções são escritas utilizando a palavra-chave *funcao* (sem o ~).',
    picture: 'panda-piscando.jpg',
  },
  {
    type: 'code',
    content: 'funcao',
    isRunnable: false,
  },
  {
    type: 'quote',
    content: 'Seguida pelo nome da função e um conjunto de parênteses.',
    picture: 'panda-piscando.jpg',
  },
  {
    type: 'code',
    content: 'funcao usarRadar()',
    isRunnable: false,
  },
  {
    type: 'alert',
    content:
      'O nome da função pode ser qualquer coisa, mas o ideal é que seja algo relacionado ao que ela faz, né?',
    picture: 'panda-segurando-bambu-de-pe.jpg',
  },
  {
    type: 'alert',
    content: 'Uma boa prática é começar o nome da função com um verbo no infinitivo 😁.',
    picture: 'panda-pulando-de-alegria.jpg',
  },
  {
    type: 'quote',
    content:
      'Por fim, é só colocar todo o bloco de código que a função executará entre chaves.',
    picture: 'panda-segurando-bambu-de-pe.jpg',
  },
  {
    type: 'code',
    content: `funcao usarRadar() {
  var mensagem = 'Mande suas coordenadas, por favor'

  var sensores = [falso, falso, falso]
  var resolucao = 10
  var telaAcesa = verdadeiro

  para (var i = 0; i < sensores.tamanho(); i++) {
      sensores[i] = verdadeiro
  }

  resolucao += 20

  se (!mensagem.inclui('script') e telaAcesa) {
      escreva(mensagem)
  }
}`,
    isRunnable: true,
  },
  {
    type: 'user',
    content: 'Mas não aconteceu absolutamente nada!',
  },
  {
    type: 'default',
    content:
      'Isso é porque não dissemos para a função `usarRadar()` executar o seu bloco de código.',
    picture: 'panda-rindo-deitado.jpg',
  },
  {
    type: 'default',
    content:
      'Para fazer isso, devemos "chamar a função", o que consiste em escrever o nome dela depois de criá-la.',
    picture: 'panda-segurando-bambu-de-pe.jpg',
  },
  {
    type: 'code',
    content: `funcao usarRadar() {
  var mensagem = 'Mande suas coordenadas, por favor'

  var sensores = [falso, falso, falso]
  var resolucao = 10
  var telaAcesa = verdadeiro

  para (var i = 0; i < sensores.tamanho(); i++) {
      sensores[i] = verdadeiro
  }

  resolucao += 20

  se (!mensagem.inclui('script') e telaAcesa) {
      escreva(mensagem)
  }
}

usarRadar()
// Resultado: Mande suas coordenadas, por favor`,
    isRunnable: true,
  },
  {
    type: 'default',
    content: 'Aí sim! Temos nossa primeira função criada.',
    picture: 'panda-deslumbrado.jpg',
  },
  {
    type: 'alert',
    content:
      'Cuidado: funções também têm seu próprio escopo, o que quer dizer que variáveis criadas dentro de uma função não podem ser acessadas de fora dela.',
    picture: 'panda-segurando-bambu-de-pe.jpg',
  },
  {
    type: 'code',
    content: `funcao minhaFuncao() {
  var minhaVariavel = ['Petros']
}
    
escreva(minhaVariavel[0])
// Resultado: Erro: Variável não definida: 'minhaVariavel'`,
    isRunnable: true,
  },
  {
    type: 'default',
    content: 'Tudo bem, mas podemos melhorar nossa função.',
    picture: 'panda-sorrindo-sentado.jpg',
  },
  {
    type: 'user',
    content: 'Como?',
  },
  {
    type: 'default',
    content:
      'Sabe para que servem os parênteses de uma função? Servem para passar valores para o código dentro dela.',
    picture: 'panda-sorrindo.jpg',
  },
  {
    type: 'user',
    content: 'Oi?',
  },
  {
    type: 'default',
    title: 'Parâmetros de função',
    content:
      'É isso mesmo! Ao chamar uma função, podemos passar qualquer valor entre seus parênteses.',
    picture: 'panda-segurando-bambu-de-pe.jpg',
  },
  {
    type: 'code',
    content: `funcao mostrarMensagem() {

}

mostrarMensagem("Olá, mundo!")`,
    isRunnable: false,
  },
  {
    type: 'default',
    content:
      'Para usar o "Olá, mundo!" dentro da função `mostrarMensagem()`, devemos declarar uma variável em seus parâmetros.',
    picture: 'panda-segurando-bambu-de-pe.jpg',
  },
  {
    type: 'code',
    content: `funcao mostrarMensagem(mensagem) {
  escreva(mensagem)
}

mostrarMensagem("Olá, mundo!")

// Resultado: Olá, mundo!
`,
    isRunnable: true,
  },
  {
    type: 'default',
    content:
      'Essa variável entre parênteses é chamada de *parâmetro de função*. Ela pode ter qualquer nome de variável válido e, caso queira passar mais valores, você terá que criar mais parâmetros.',
    picture: 'panda-piscando.jpg',
  },
  {
    type: 'code',
    content: `funcao somar(numero1, numero2, numero3) {
  var soma = numero1 + numero2 + numero3
  escreva(soma)
}

somar(1, 2, 3)
// Resultado: 6
`,
    isRunnable: true,
  },
  {
    type: 'default',
    content:
      'É por meio dos parâmetros que podemos criar resultados dinâmicos com uma mesma função.',
    picture: 'panda-piscando.jpg',
  },
  {
    type: 'default',
    content:
      'No nosso caso, podemos passar a mensagem que queremos como parâmetro da função `usarRadar()`',
    picture: 'panda-segurando-bambu-de-pe.jpg',
  },
  {
    type: 'default',
    content:
      'Assim, a função fará todo o trabalho de configurar o radar, usando qualquer tipo de mensagem, seja de resposta ou de envio. Veja:',
    picture: 'panda-sorrindo.jpg',
  },
  {
    type: 'code',
    content: `funcao usarRadar(mensagem) {
  var sensores = [falso, falso, falso]
  var resolucao = 10
  var telaAcesa = verdadeiro

  para (var i = 0; i < sensores.tamanho(); i++) {
      sensores[i] = verdadeiro
  }

  resolucao += 20

  se (!mensagem.inclui('script') e telaAcesa) {
      escreva(mensagem)
  }
}

usarRadar("Ok, vou procurar")
usarRadar("Tudo bem, estarei te esperando")
usarRadar("Minhas coordenadas são: x:42y:84")
usarRadar("Muito obrigado")

// Resultado:
// Ok, vou procurar
// Tudo bem, estarei te esperando
// Minhas coordenadas são: x:42y:84
// Muito obrigado`,
    isRunnable: true,
  },
  {
    type: 'default',
    content:
      'Viu só? Enviamos e recebemos várias mensagens diferentes e precisamos escrever o código de configuração do radar apenas uma vez 😆.',
    picture: 'panda-deslumbrado.jpg',
  },
  {
    type: 'default',
    content: 'Isso não é incrível? Agora temos um código bem mais limpo e organizado.',
    picture: 'panda-comemorando.jpg',
  },
  {
    type: 'default',
    content:
      'Mas, voltando ao que interessa... Vamos em direção a essa pessoa desconhecida.',
    picture: 'panda-sorrindo-sentado.jpg',
  },
]
