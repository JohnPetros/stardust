import type { TextBlockDto } from '@stardust/core/global/dtos'

export const texts: TextBlockDto[] = [
  {
    type: 'default',
    content:
      'Muito bem, já que eles não entendem mensagem do *tipo texto*, vamos tentar com o *tipo número*.',
    picture: 'panda-olhando-computador.jpg',
  },
  {
    type: 'default',
    content: 'Dados do tipo *número* em um programa podem ser inteiros ou decimais.',
    picture: 'panda.jpg',
  },
  {
    type: 'default',
    content: 'Primeiramente, vamos falar sobre os números inteiros.',
    picture: 'panda-piscando.jpg',
  },
  {
    type: 'quote',
    title: 'Inteiros',
    content:
      'Os números inteiros dizem respeito aos números sem parte decimal, como -5, 0, 1, 2, 3 etc.',
    picture: 'panda.jpg',
  },
  {
    type: 'default',
    content: 'Podemos declarar uma variável com valor inteiro dessa forma:',
    picture: 'panda-segurando-bambu-de-pe.jpg',
  },
  {
    content: 'var numero = 2370',
    type: 'code',
    isRunnable: false,
  },
  {
    type: 'alert',
    content:
      'Perceba que diferentemente do *tipo texto*, é necessário que o valor numérico não esteja entre aspas.',
    picture: 'panda-andando-com-bambu.jpg',
  },
  {
    type: 'default',
    content: 'Números negativos também são permitidos:',
    picture: 'panda-segurando-bambu-de-pe.jpg',
  },
  {
    content: 'var negativo = -999',
    type: 'code',
    isRunnable: false,
  },
  {
    type: 'quote',
    title: 'Reais',
    content:
      'Além dos inteiros, há os números decimais, que nada mais são do que números com parte decimal, veja:',
    picture: 'panda-segurando-bambu-de-pe.jpg',
  },
  {
    content: 'var serie = 8.5',
    type: 'code',
    isRunnable: false,
  },
  {
    type: 'alert',
    content:
      'Cuidado: devemos sempre escrever os números decimais sempre com ponto e não com vírgula.',
    picture: 'panda-piscando-sentado.jpg',
  },
  {
    content: `var numero = 8,5 // Isso não existe ❌
var numero = 8.5 // Agora sim ✅`,
    type: 'code',
    isRunnable: false,
  },
  {
    type: 'quote',
    title: 'Juntando Números e Textos',
    content:
      'Algo interessante é que ao tentar somar dois números, sendo um de tipo *número* e outro de tipo *texto*, acontece algo peculiar: o tipo *número* se converte para tipo *texto*, formando, assim, outro dado do tipo *texto*.',
    picture: 'panda-segurando-bambu-de-pe.jpg',
  },
  {
    type: 'default',
    content: 'Veja um exemplo disso para ficar mais claro:',
    picture: 'panda-andando-com-bambu.jpg',
  },
  {
    content: `var rg = "2370" + 30
escreva("o rg do meu foguete é " + rg)

// Resultado: o rg do meu foguete é 237030`,
    type: 'code',
    isRunnable: true,
  },
  {
    type: 'default',
    content:
      'Perceba que deu *237030* em vez de *2400*, justamente porque o número *30* foi convertido para tipo *texto* e depois foi concatenado com *"2370"*, formando o *"237030"*.',
    picture: 'panda-piscando-sentado.jpg',
  },
  {
    type: 'quote',
    title: 'Conversão de números',
    content:
      'Também é possível converter um número inteiro para decimal, basta que o resultado de uma operação com um inteiro (uma divisão, por exemplo) resulte em um número decimal.',
    picture: 'panda-segurando-bambu-de-pe.jpg',
  },
  {
    content: `var codigo = 467 / 2
escreva("Enviar código: ", codigo)

// Resultado: Enviar código: 233.5`,
    type: 'code',
    isRunnable: true,
  },
  {
    type: 'default',
    content: 'O contrário também é possível:',
    picture: 'panda-segurando-bambu-de-pe.jpg',
  },
  {
    content: `var numero = 0.5 + 0.5
escreva("Novo número inteiro: ", numero)

// Resultado: Novo número inteiro: 1`,
    type: 'code',
    isRunnable: true,
  },
  {
    type: 'alert',
    content: 'Ok, porém, podemos falar sobre operações aritméticas mais tarde.',
    picture: 'panda-dando-risadinha.jpg',
  },
  {
    type: 'quote',
    content: 'Por enquanto, vamos testar o que você aprendeu sobre o tipo *número*!',
    picture: 'panda-deslumbrado.jpg',
  },
]
