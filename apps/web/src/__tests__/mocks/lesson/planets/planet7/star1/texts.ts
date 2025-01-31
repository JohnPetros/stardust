import type { Text } from '@/@types/Text'

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
      'E agora com o radar do próprio foguete não precimos mais daquele que compramos.',
    picture: 'panda-comemorando.jpg',
  },
  {
    type: 'image',
    content: 'E por falar em mensagem, acabamos de receber mais uma.',
    picture: 'celular.jpg',
  },
  {
    type: 'default',
    content: 'Para visualizar a mensagem é necessário fazer alguns passos.',
    picture: 'panda-amando-bambu.jpg',
  },
  {
    type: 'quote',
    content: '1 -> ligar todos sensores do radar;',
    picture: 'panda.jpg',
  },
  {
    type: 'quote',
    content: '2 -> Verificar se a mensagem contém script malicioso;',
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
    content: '5 -> Escrever a mensagem.',
    picture: 'panda.jpg',
  },
  {
    type: 'code',
    content: `var mensagem = 'Por favor, me ajundem!'
    
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

// Resultado: Por favor, me ajundem!`,
    isRunnable: true,
  },
  {
    type: 'default',
    content:
      'Ok, já entendemos que essa pessoa precisa da nossa ajuda, mas porque ela não fala onde ela está?',
    picture: 'panda-confuso.jpg',
  },
  {
    type: 'default',
    content:
      'Só resta perguntar isso, mande uma mensagem escrito: "Quais são suas coordenadas?"',
    picture: 'panda-de-oculos.jpg',
  },
  {
    type: 'default',
    content:
      'Só que para mandar uma mensagem com o radar é preciso seguir os mesmos passos de receber uma mensagem, por motivos de segurança, é claro.',
    picture: 'panda-sorrindo.jpg',
  },
  {
    type: 'code',
    content: `var mensagem = 'Quais são suas coordenadas?'
    
var sensores = [falso, falso, falso]
var resolucao = 10
var telaAcesa = verdadeiro

para (var i = 0 i < sensores.tamanho() i++) {
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
    content: 'Isso, acabamos de receber uma resposta.',
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
    content: 'Tá, responda que é para saber onde ela está.',
    picture: 'panda-deslumbrado.jpg',
  },
  {
    type: 'code',
    content: `var mensagem = 'É para saber onde você está'
    
var sensores = [falso, falso, falso]
var resolucao = 10
var telaAcesa = verdadeiro

para (var i = 0i < sensores.tamanho() i++) {
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
    content: 'Ok, isso já está ficando chato.',
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
      'Então, essa é uma boa ocasição para explicar um conceito importantíssemo na programação.',
    picture: 'panda-de-oculos.jpg',
  },
  {
    type: 'user',
    content: 'Funções?',
  },
  {
    type: 'default',
    content: 'Isso... É, o nome desse módulo já entregou tudo.',
    picture: 'panda-triste.jpg',
  },
  {
    type: 'default',
    content: 'Mas como prometido vou explicar o que são funções 🎉.',
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
    content: 'As funções são escrita utilizando a palavra-chave *funcao* (sem ~)',
    picture: 'panda-piscando.jpg',
  },
  {
    type: 'code',
    content: 'funcao',
    isRunnable: false,
  },
  {
    type: 'quote',
    content: 'seguida pelo nome da função e um conjunto de parênteses.',
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
      'O nome da função pode ser qualquer coisa, mas é ideal que seja algo relacionado ao o que ela faz, né?',
    picture: 'panda-segurando-bambu-de-pe.jpg',
  },
  {
    type: 'alert',
    content: 'Uma boa prática é começar o nome da função com um verbo no imperativo 😁.',
    picture: 'panda-pulando-de-alegria.jpg',
  },
  {
    type: 'quote',
    content:
      'Por fim, é só colocar todo o bloco de código que a funcão executará entre suas chaves.',
    picture: 'panda-segurando-bambu-de-pe.jpg',
  },
  {
    type: 'code',
    content: `funcao useRadar() {
  var mensagem = 'Mande suas coordenadas, por favor'

  var sensores = [falso, falso, falso]
  var resolucao = 10
  var telaAcesa = verdadeiro

  para (var i = 0i < sensores.tamanho() i++) {
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
      'Isso porque não falamos para a função "useRadar()" executar o seu bloco de código.',
    picture: 'panda-rindo-deitado.jpg',
  },
  {
    type: 'default',
    content:
      'Para fazer isso, devemos fazer o que chamamos de "chamar uma função", que é escrever o nome dela depois que a criamos.',
    picture: 'panda-segurando-bambu-de-pe.jpg',
  },
  {
    type: 'code',
    content: `funcao useRadar() {
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

useRadar()
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
      'Cuidado: funções também tem o seu próprio escopo, o que quer dizer que variáveis criadas dentro de uma função não podem ser acessadas de fora dela.',
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
    content: `funcao mostreMensagem() {

}

mostreMensagem("Olá, mundo!")`,
    isRunnable: false,
  },
  {
    type: 'default',
    content:
      'Para usar esse "Olá, mundo!" dentro da função "mostreMensagem()", devemos criar variáveis no bloco da função',
    picture: 'panda-segurando-bambu-de-pe.jpg',
  },
  {
    type: 'code',
    content: `funcao mostreMensagem(mensagem) {
  escreva(mensagem)
}

mostreMensagem("Olá, mundo!")

// Resultado: Olá, mundo!
`,
    isRunnable: true,
  },
  {
    type: 'default',
    content:
      'Essas variáveis entre parênteses se chamam *parâmetros de função* e elas podem ter qualquer nome, e caso você queira passar mais valores para a função, você terá que criar mais parâmetros.',
    picture: 'panda-piscando.jpg',
  },
  {
    type: 'code',
    content: `funcao some(numero1, numero2, numero3) {
  var soma = numero1 + numero2 + numero3
  escreva(soma)
}

some(1, 2, 3)
// Resultado: 6
`,
    isRunnable: true,
  },
  {
    type: 'default',
    content:
      'É por meio dos parâmetros é que podemos criar resultados dinâmicos com uma mesma função.',
    picture: 'panda-piscando.jpg',
  },
  {
    type: 'default',
    content:
      'No nosso caso, podemos passar a mensagem que queremos como parâmetro da função *useRadar()*',
    picture: 'panda-segurando-bambu-de-pe.jpg',
  },
  {
    type: 'default',
    content:
      'Assim, a função irá fazer todo o trabalho de configurar o radar usando qualquer tipo de mensagem, seja de resposta ou de envio, veja:',
    picture: 'panda-sorrindo.jpg',
  },
  {
    type: 'code',
    content: `funcao useRadar(mensagem) {
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

useRadar("Ok, vou procurar")
useRadar("Tudo bem, vou estar te esperando")
useRadar("Minhas coordenadas são: x:42y:84")
useRadar("Muito obrigado")

/* Resultado: 
Ok, vou procurar
Tudo bem, vou estar te esperando
Minhas coordenadas são: x:42y:84
Muito obrigado
*/`,
    isRunnable: true,
  },
  {
    type: 'default',
    content:
      'Viu só, enviamos e recebemos várias mensagens diferentes, e precisamos escrever o código de configuração do radar apenas uma vez 😆.',
    picture: 'panda-deslumbrado.jpg',
  },
  {
    type: 'default',
    content: 'Isso não é incrível? Agora temos um código bem mais limpo e organizado.',
    picture: 'panda-comemorando.jpg',
  },
  {
    type: 'default',
    content: 'Mas voltando... Agora vamos em direção a essa pessoa desconhecida.',
    picture: 'panda-sorrindo-sentado.jpg',
  },
]
