import type { TextBlockDto } from '@stardust/core/global/entities/dtos'

export const texts: TextBlockDto[] = [
  {
    type: 'default',
    content: 'Estamos esperando a um tempão, e nada do foguete.',
    picture: 'panda-triste.jpg',
  },
  {
    type: 'default',
    content: 'Talvez ter usado engenharia reversa não tenha dado certo.',
    picture: 'panda-triste.jpg',
  },
  {
    type: 'default',
    content: 'Acho que o radar só transforma em listas mensagens que são recebidas.',
    picture: 'panda-pensando.jpg',
  },
  {
    type: 'default',
    content: 'Portanto, podemos enviar mensagens apenas em texto sem problema algum.',
    picture: 'panda-oferecendo-bambu.jpg',
  },
  {
    type: 'code',
    content: `var mensagem = "   Venha aqui, por f4vor   "`,
    isRunnable: false,
  },
  {
    type: 'default',
    content: 'Espera aí, o texto da mensagem tem espaços em branco.',
    picture: 'panda-olhando-de-lado.jpg',
  },
  {
    type: 'default',
    content: 'Mais um caso onde podemos solucionar usando um método de lista.',
    picture: 'panda-confuso.jpg',
  },
  {
    type: 'user',
    content: 'Lista? Mas estamos usando *texto*.',
  },
  {
    type: 'default',
    content: 'Isso pode explodir sua cabeça, mas textos também podem ser *listas*.',
    picture: 'panda-segurando-bambu-de-pe.jpg',
  },
  {
    type: 'user',
    content: 'Que??',
  },
  {
    type: 'code',
    content: `var meuTexto = "abc"
escreva(meuTexto[0])

// Resultado: a`,
    isRunnable: true,
  },
  {
    type: 'user',
    content:
      'Então, quer dizer que podemos os métodos de lista que vimos anteriormente em textos?',
  },
  {
    type: 'default',
    content:
      'A resposta é sim! Obviamente nem todos. Os métodos *remover()*, *adicionar()*, *ordenar()*, nem mesmo o *inverter()* são possíveis de serem usados em texto.',
    picture: 'panda-pulando-de-alegria.jpg',
  },
  {
    type: 'default',
    content: 'Mas podemos usar alguns, como *tamanho()*, *inclui()* e *concatenar()*',
    picture: 'panda-segurando-bambu-de-pe.jpg',
  },
  {
    type: 'code',
    content: `var meuTexto = "abc"
escreva(meuTexto.tamanho())
escreva(meuTexto.inclui("b"))
escreva(meuTexto.concatenar("d"))
    
// Resultado: 
//  3
//  verdadeiro
//  abcd

    `,
    isRunnable: true,
  },
  {
    type: 'default',
    content: 'Porém, existem métodos própios para textos.',
    picture: 'panda-segurando-bambu-de-pe.jpg',
  },
  {
    type: 'user',
    content: 'Sério?',
  },
  {
    type: 'default',
    content:
      'Por exemplo, nesse caso para retirar os espaços em branco da mensagem, podemos utilizar o método *aparar()*.',
    picture: 'panda-olhando-computador.jpg',
  },
  {
    type: 'quote',
    title: 'Método aparar()',
    content:
      'O método *aparar()* é usado para remover os espaços em branco do início e do final de um texto, ou seja, aparar as pontas do texto.',
    picture: 'panda-andando-com-bambu.jpg',
  },
  {
    type: 'code',
    content: `var mensagem = "   Venha aqui, por f4vor   "
        
var novaMensagem = mensagem.aparar()

escreva(mensagem.tamanho() == novaMensagem.tamanho())
// Resultado: falso
// Já que as mensagens já não são do mesmo tamanho.`,
    isRunnable: true,
    picture: 'panda-olhando-de-lado.jpg',
  },
  {
    type: 'default',
    content: 'Agora sim!',
    picture: 'panda-deslumbrado.jpg',
  },
  {
    type: 'default',
    content: 'Mas, espera aí de novo, há um número quatro na palavra "favor".',
    picture: 'panda-confuso.jpg',
  },
  {
    type: 'default',
    content: 'É melhor substituir o 4 pela letra "a".',
    picture: 'panda-olhando-de-lado.jpg',
  },
  {
    type: 'quote',
    title: 'substituir()',
    content:
      'O método de texto *substituir()* procura um subtexto dentro de um texto e o substitui por outro. Assim, um novo texto é gerado.',
    picture: 'panda-andando-com-bambu.jpg',
  },
  {
    type: 'quote',
    content:
      'Para usá-lo é simples: é preciso passar dois valores, o primeiro indica qual subtexto deve ser procurado e substituido, enquanto o segundo é o subtexto que deve ser colocado como substituto.',
    picture: 'panda-olhando-de-lado.jpg',
  },
  {
    type: 'default',
    content: 'Acho melhor você ver um exemplo de como ele funciona.',
    picture: 'panda-sorrindo-sentado.jpg',
  },
  {
    type: 'code',
    content: `var mensagem = "Venha aqui, por f4vor"

var novaMensagem =  mensagem.substituir("4", "a")
escreva(novaMensagem)

// Resultado: Venha aqui, por favor`,
    isRunnable: true,
  },
  {
    type: 'alert',
    content:
      'Aviso: o método *substituir()* só substitui o primeiro subtexto que ele encontrar. Isso quer dizer que se a mensagem tivesse mais números 4, apenas o primeiro 4 seria substituido.',
    picture: 'panda-rindo-deitado.jpg',
  },
  {
    type: 'code',
    content: `var mensagem = "Venh4 4qui, por f4vor"
        
var novaMensagem = mensagem.substituir("4", "a")
escreva(novaMensagem)

// Resultado: Venha 4qui, por f4vor`,
    isRunnable: true,
  },
  {
    type: 'default',
    content: 'Agora a nossa mensagem está bem melhor, mas podemos melhorá-la ainda mais.',
    picture: 'panda-olhando-de-lado.jpg',
  },
  {
    type: 'user',
    content: 'Como?',
  },
  {
    type: 'default',
    content:
      'Tirando esse texto "aqui, por favor". Acho que a palavra "Venha" basta, assim poupamos memória desse radar mequetrefe.',
    picture: 'panda-com-raiva.jpg',
  },
  {
    type: 'default',
    content:
      'Se cada caractere da mensagem fosse um item de uma lista, poderíamos usar o método *fatiar()*.',
    picture: 'panda-olhando-de-lado.jpg',
  },
  {
    type: 'default',
    content:
      'Mas, já que estamos usando texto, podemos usar o método *subtexto()* que literalmente consegue fazer o que o *fatiar()* faz, só que para textos.',
    picture: 'panda-olhando-de-lado.jpg',
  },
  {
    type: 'quote',
    title: 'Método subtexto()',
    content:
      'O método *subtexto()* permite extrair uma parte de um texto a partir de um índice inicial até um índice final.',
    picture: 'panda-andando-com-bambu.jpg',
  },
  {
    type: 'default',
    content:
      'Cada índice de um texto corresponde a um caractere. Então se quisermos pegar só a palavra "Venha" da mensagem:',
    picture: 'panda-abracando-bambu.jpg',
  },
  {
    type: 'code',
    content: `var mensagem = "Venha aqui, por favor"
         
// subtexto(0, 5) = extrair do primeiro caractere até o quinto caractere
var novaMensagem = mensagem.subtexto(0, 5)

escreva(novaMensagem)
// Resultado: Venha`,
    isRunnable: true,
  },
  {
    type: 'default',
    content:
      'Essa parte dos índices do *subtexto()* é bem igual ao *fatiar()* mesmo, ou seja, será extraido todos os caracteres nas posições que estão entre o primeiro e segundo indíces definidos entre parênteses, mas não contando o caractere que corresponde ao índice final.',
    picture: 'panda-segurando-bambu-de-pe.jpg',
  },
  {
    type: 'default',
    content: 'Veja eu extraindo a palavra "aqui"',
    picture: 'panda-segurando-bambu-de-pe.jpg',
  },
  {
    type: 'code',
    content: `var mensagem = "Venha aqui, por favor"

// extraindo do quinto caractere até o décimo caractere
var aqui = mensagem.subtexto(6, 10)
escreva(aqui)

// Resultado: aqui`,
    isRunnable: true,
  },
  {
    type: 'alert',
    content:
      'Se o índice final não for passado, o subtexto começará do indíce inicial e terminará até o último índice do lista, assim como acontece no *fatiar()*',
    picture: 'panda-andando-com-bambu.jpg',
  },
  {
    type: 'code',
    content: `var mensagem = "Venha aqui, por favor"

// extraindo do décimo segundo caractere (que é "p") até o último caractere
var meuSubtexto = mensagem.subtexto(12)
escreva(meuSubtexto)

// Resultado: por favor`,
    isRunnable: true,
  },
  {
    type: 'alert',
    content: 'E sim, o *subtexto()* não altera o texto original.',
    picture: 'panda-rindo-deitado.jpg',
  },
  {
    type: 'code',
    content: `var textoOriginal = "Venha aqui, por favor"

var meuSubtexto = textoOriginal.subtexto(12)

escreva(meuSubtexto)
escreva(textoOriginal)

// Resultado:
// por favor
// Venha aqui, por favor`,
    isRunnable: true,
  },
  {
    type: 'image',
    content: 'Opa! Acabamos de receber uma mensagem do foguete.',
    picture: 'celular.jpg',
  },
  {
    type: 'code',
    content: `var mensagem = ["Não", "quero"]
escreva(mensagem.juntar(" "))

// Resultado: Não quero`,
    picture: 'panda-olhando-de-lado.jpg',
    isRunnable: true,
  },
  {
    type: 'default',
    content: 'Pode não parecer, mas o foguete é bem espertinho.',
    picture: 'panda-piscando-sentado.jpg',
  },
  {
    type: 'code',
    content: `var mensagem = "Por favor, venha até aqui"`,
    isRunnable: false,
  },
  {
    type: 'image',
    content: 'Recebemos outra mensagem dele.',
    picture: 'celular.jpg',
  },
  {
    type: 'code',
    content: `var mensagem = ["Já", "falei", "que", "não", "quero"]
escreva(mensagem.juntar(" "))

// Resultado: Já falei que não quero`,
    isRunnable: true,
  },
  {
    type: 'default',
    content: 'É, parece que esse foguete está bem afoito.',
    picture: 'panda-confuso.jpg',
  },
  {
    type: 'default',
    content: 'Mande assim: Se não vier agora, irei te mandar para o ferro-velho!',
    picture: 'panda-com-raiva.jpg',
  },
  {
    type: 'default',
    content:
      'Mas antes, tranforme o texto em caixa alta, isto é, coloque tudo em letra MAIÚSCULA para ele entender bem.',
    picture: 'panda-piscando.jpg',
  },
  {
    type: 'quote',
    title: 'Método maiusculo()',
    content:
      'o método *maiusculo()* é bem simples: gera um texto com carecteres em maiúsculo a partir do texto original.',
    picture: 'panda-andando-com-bambu.jpg',
  },
  {
    type: 'code',
    content: `var mensagem = "Se não vier agora, irei te mandar para o ferro-velho!"

var novaMensagem = mensagem.maiusculo()
escreva(novaMensagem)

// Resultado: SE NÃO VIER AGORA, IREI TE MANDAR PARA O FERRO-VELHO!`,
    isRunnable: true,
  },
  {
    type: 'alert',
    content: 'Antes que pergunte, também existe o método *minusculo()*.',
    picture: 'panda-rindo-deitado.jpg',
  },
  {
    type: 'code',
    content: `var textoEmMaiusculo = "TUDO EM MAIÚSCULO"

escreva(textoEmMaiusculo.minusculo())
// Resultado: tudo em maiúsculo`,
    isRunnable: true,
  },
  {
    type: 'image',
    content: 'Acabamos de receber mais uma mensagem do foguete.',
    picture: 'celular.jpg',
  },
  {
    type: 'code',
    content: `var mensagem = [
  "não", 
  "vou", 
  "porque", 
  "não", 
  "faço", 
  "ideia", 
  "onde",
  "você",
  "está"
]
  
escreva(mensagem.juntar(" "))
// Resultado: não vou porque não faço ideia onde você está`,
    isRunnable: true,
  },
  {
    type: 'default',
    content: 'É, agora o foguete tem um ponto 🙄.',
    picture: 'panda-triste.jpg',
  },
]
