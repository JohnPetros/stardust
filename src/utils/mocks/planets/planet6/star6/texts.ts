import { Text } from '@/@types/text'

export const texts: Text[] = [
  {
    type: 'image',
    content: 'Ei, acabamos de receber mais uma mensagem no nosso radar.',
    picture: 'celular.jpg',
  },
  {
    type: 'code',
    content: `var mensagem = ["Preciso", "de", "ajuda"]`,
    isRunnable: false,
  },
  {
    type: 'default',
    content:
      'Já que todas as mensagens estão sendo recebidas como vetor, podemos juntar os itens para formar um texto.',
    picture: 'panda-olhando-de-lado.jpg',
  },
  {
    type: 'quote',
    title: 'juntar()',
    content:
      'O método `juntar()` permite unir os elementos de um vetor, transformando em um único texto.',
    picture: 'panda-triste.jpg',
  },
  {
    type: 'default',
    content:
      'Só que para usar o `juntar()`, é preciso passar um elemento de texto nos parênteses para que ele use esse texto como separador para cada elemento.',
    picture: 'panda-de-oculos.jpg',
  },
  {
    type: 'quote',
    content:
      'Além disso, o método `juntar()` não altera o vetor original, então será preciso colocar o texto gerado em uma nova variável.',
    picture: 'panda-de-oculos.jpg',
  },
  {
    type: 'code',
    content: `var mensagem = ["Preciso", "de", "ajuda"]
                
var mensagemCerta = mensagem.juntar("")
escreva(mensagemCerta)
// Resultado: Precisodeajuda
`,
    isRunnable: true,
  },
  {
    type: 'default',
    content:
      'Não é exatamente isso que queremos. Isso aconteceu porque colocamos o separador como um texto vazio.',
    picture: 'panda-confuso.jpg',
  },
  {
    type: 'default',
    content:
      'Mas queremos que as palavras estejam separadas por um espaço, correto?',
    picture: 'panda-pensando.jpg',
  },
  {
    type: 'default',
    content: 'Então, por exemplo, se colocarmos um traço (-) no `juntar()`:',
    picture: 'panda-pensando.jpg',
  },
  {
    type: 'code',
    content: `var mensagem = ["Preciso", "de", "ajuda"]
                
var mensagemCerta = mensagem.juntar("-")
escreva(mensagemCerta)
// Resultado: Preciso-de-ajuda`,
    isRunnable: true,
  },
  {
    type: 'default',
    content: 'Em cada palavra será inserido um traço separando elas.',
    picture: 'panda-olhando-computador.jpg',
  },
  {
    type: 'default',
    content:
      'Logo, para separar cada palavra adequadamente, usando espaço, basta colocar um texto que seja um espaço no `juntar()`.',
    picture: 'panda-olhando-computador.jpg',
  },
  {
    type: 'code',
    content: `var mensagem = ["Preciso", "de", "ajuda"]

var mensagemCerta = mensagem.juntar(" ")
escreva(mensagemCerta)
// Resultado: Preciso de ajuda`,
    isRunnable: true,
  },
  {
    type: 'default',
    content: 'Assim fica bem melhor para ler as mensagens.',
    picture: 'panda-comemorando.jpg',
  },
  {
    type: 'default',
    content:
      'Algum desconhecido está querendo que saiamos desse planeta para ajudá-lo. Então, mande uma mensagem para o foguete vir nos pegar.',
    picture: 'panda-confuso.jpg',
  },
  {
    type: 'default',
    content:
      'Só que, como radar está tranformando as mensagens recebidas em vetores, então é de se presumir que ele também transformará as que serão enviadas quando chegar ao foguete.',
    picture: 'panda-triste.jpg',
  },
  {
    type: 'default',
    content:
      'Então podemos tentar engenharia reversa. Talvez se mandarmos a mensagem já como vetor, ele se transformará em texto quando chegar ao foguete.',
    picture: 'panda-pensando.jpg',
  },
  {
    type: 'default',
    content:
      'Para nossa sorte (de novo), existe um método que faz literalmente isso: o método `dividir()`.',
    picture: 'panda-segurando-bambu-de-pe.jpg',
  },
  {
    type: 'quote',
    title: 'dividir()',
    content:
      'O método `dividir()` divide um texto em subtextos, transformando-o em um vetor.',
    picture: 'panda-olhando-de-lado.jpg',
  },
  {
    type: 'code',
    content: `var mensagem = "Venha já aqui"
var mensagemCerta = mensagem.dividir()       
escreva(mensagemCerta)
// Resultado: Venha já aqui
    `,
    isRunnable: true,
  },
  {
    type: 'user',
    content: 'Mas não aconteceu nada!',
  },
  {
    type: 'default',
    content:
      'Isso porque é também é preciso passar nos parênteses do `juntar()` um texto que servirá como separador da divisão.',
    picture: 'panda-olhando-computador.jpg',
  },
  {
    type: 'default',
    content: 'Por exemplo, se passarmos a letra "a" como separador:',
    picture: 'panda-olhando-computador.jpg',
  },
  {
    type: 'code',
    content: `var mensagem = "Venha já aqui"

var mensagemCerta = mensagem.dividir("a")       
escreva(mensagemCerta)
// Resultado: [ Venh, já, qui ]
    `,
    isRunnable: true,
  },
  {
    type: 'default',
    content:
      'Veja que toda letra "a" foi removida do texto, e os textos que estavam envolta de cada letra "a" se tranformaram em um elemento de um vetor.',
    picture: 'panda-triste.jpg',
  },
  {
    type: 'alert',
    content:
      'O caractere "à" não foi removido por causa do acento, ou seja, "à" é diferente de "a", então cuidado com isso.',
    picture: 'panda-sorrindo-sentado.jpg',
  },
  {
    type: 'user',
    content: 'Mas, como separar as palavras da forma correta?',
  },
  {
    type: 'code',
    content: `var mensagem = "Venha já aqui"

var mensagemCerta = mensagem.dividir(" ")       
escreva(mensagemCerta)

// Resultado: [ Venha, já, aqui ]`,
    isRunnable: true,
  },
  {
    type: 'default',
    content: 'Agora temos um vetor decente.',
    picture: 'panda-comemorando.jpg',
  },
  {
    type: 'default',
    content:
      'Mas, para chamar o foguete, podemos encurtar a mensagem, mandando apenas "Venha".',
    picture: 'panda-dando-risadinha.jpg',
  },
  {
    type: 'default',
    content:
      'Para facilitar podemos dizer para o `dividir()` que apenas gere um vetor com apenas 1 elemento.',
    picture: 'panda-olhando-de-lado.jpg',
  },
  {
    type: 'default',
    content: 'Como?',
    picture: 'panda-triste.jpg',
  },
  {
    type: 'default',
    content:
      'Através do segundo valor passado nos parênteses do `dividir()`, que difine quantos itens o vetor gerado deve conter.',
    picture: 'panda-olhando-computador.jpg',
  },
  {
    type: 'code',
    content: `var mensagem = "Venha já aqui"

// Nesse caso, vetor gerado por dividir() terá apenas 1 palavra
var mensagemCerta = mensagem.dividir(" ", 1)    

escreva(mensagemCerta)
// Resultado: [ Venha ]
`,
    isRunnable: true,
  },
  {
    type: 'default',
    content:
      'Agora sim! Só resta esperar que o foguete venha, caso ele tenha recebido a mensagem, é claro.',
    picture: 'panda-segurando-bambu-de-pe.jpg',
  },
]
