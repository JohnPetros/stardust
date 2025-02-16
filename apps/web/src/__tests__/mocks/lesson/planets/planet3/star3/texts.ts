import type { TextBlockDto } from '@stardust/core/global/dtos'

export const texts: TextBlockDto[] = [
  {
    content:
      'Ok, agora com as verificações já feitas, a prioridade agora é concertar os motores do foguete!',
    type: 'default',
    picture: 'panda-de-oculos.jpg',
  },
  {
    content: 'Acessando compartimento dos motores',
    type: 'image',
    picture: 'motor-do-foguete.png',
  },
  {
    content:
      'Estamos no compartimento dos motores, e agora devemos verificar o funcionamento de um motor de cada vez.',
    type: 'default',
    picture: 'panda-olhando-de-lado.jpg',
  },
  {
    content: 'Como fazer isso?',
    type: 'user',
  },
  {
    content:
      'Cada motor possui duas turbinas e elas devem estar girando ao mesmo tempo para o motor funcionar corretamente.',
    type: 'default',
    picture: 'panda-segurando-bambu-de-pe.jpg',
  },
  {
    content:
      'Para conferir se tanto um, quanto o outro está girando, você pode usar um operador lógico.',
    type: 'default',
    picture: 'panda-segurando-bambu-de-pe.jpg',
  },
  {
    content: 'E... Como fazer isso?',
    type: 'user',
  },
  {
    content:
      'Operadores lógicos são utilizados para comparar valores do tipo lógico, diferentemente dos relacionais, que só comparam números.',
    type: 'default',
    picture: 'panda-confuso.jpg',
  },
  {
    content:
      'Para testar se dois valores são verdadeiros, você deve usar o operador *e*, que verifica se o primeiro valor é igual a *verdadeiro* E se o segundo também é *verdadeiro*.',
    type: 'quote',
    title: 'Operador (e)',
    picture: 'panda-andando-com-bambu.jpg',
  },
  {
    type: 'code',
    content: `var girandoTurbina1 = verdadeiro
var girandoTurbina2 = falso
escreva(girandoTurbina1 e girandoTurbina2)

//  Resultado: falso`,
    isRunnable: true,
  },
  {
    content:
      'O resultado é *falso*, pois apenas a turbina 1 está girando e para que o código resultasse em *verdadeiro*, ambos os valores deveriam ser iguais a *verdadeiro*.',
    type: 'default',
    picture: 'panda-piscando.jpg',
  },
  {
    content:
      'Pois bem, ao concertar a turbina 1, você deve verificar novamente, mas dessa vez você pode colocar o resultado da comparação em uma variável à parte.',
    type: 'default',
    picture: 'panda-sorrindo.jpg',
  },
  {
    type: 'code',
    content: `var girandoTurbina1 = verdadeiro
var girandoTurbina2 = falso

var turbinasGirando = girandoTurbina1 e girandoTurbina2

escreva(turbinasGirando)

//  Resultado: verdadeiro`,
    isRunnable: true,
  },
  {
    content: 'Mas é possível isso?',
    type: 'user',
  },
  {
    content:
      'Sim! Lembre-se que esses operadores comparam valores do tipo lógico, então qualquer expressão que resulta em um valor lógico pode ser utilizado para comparar com outro valor.',
    type: 'default',
    picture: 'panda-confuso.jpg',
  },
  {
    content:
      'Por exemplo, você pode testar se o nível de combustível atual está acima do nível mínimo para o funcionamento, ou seja *combustivelAtual > combustivelMinimo*.',
    type: 'default',
    picture: 'panda.jpg',
  },
  {
    type: 'code',
    content: `var girandoTurbina1 = verdadeiro

var combustivelAtual = 90
var combustivelMinimo = 10

escreva(girandoTurbina1 e combustivelAtual > combustivelMinimo)

//  Resultado: verdadeiro`,
    isRunnable: true,
  },
  {
    content:
      'Como *girandoTurbina1* é *verdadeiro*, assim como *combustivelAtual > combustivelMinimo* resulta em *verdadeiro*, então o resultado final também é *verdadeiro*.',
    type: 'default',
    picture: 'panda-sorrindo.jpg',
  },
  {
    content: 'Hmm...',
    type: 'user',
  },
  {
    content:
      'Cuidado! Nem tente achar que falso com falso resulta em verdadeiro! Isso aqui não é matemática, é puramente lógica.',
    type: 'alert',
    picture: 'panda-piscando-sentado.jpg',
  },
  {
    content: `escreva(falso e falso) 

//  Resultado: falso`,
    type: 'code',
    isRunnable: true,
  },
  {
    content:
      'Beleza! O motor 1 está funcionado corretamente. Agora resta verificar o motor 2.',
    type: 'alert',
    picture: 'panda-comemorando.jpg',
  },
  {
    content: 'O segundo também está funcionando.',
    type: 'user',
  },
  {
    content:
      'É... realmente, as turbinas do motor 2 estão girando. Então, pode haver um problema no tipo de combustível que está sendo consumido pelo motor.',
    type: 'alert',
    picture: 'panda-confuso.jpg',
  },
  {
    content: 'Como assim no tipo de combustível?',
    type: 'user',
  },
  {
    content:
      'O motor pode aceitar apenas dois tipos de combustível: Etherium e Plasmatron.',
    type: 'default',
    picture: 'panda-olhando-de-lado.jpg',
  },
  {
    content: 'Logo, apenas uma condição precisa ser verdadeira para o motor funcionar.',
    type: 'default',
    picture: 'panda-fazendo-coracao.jpg',
  },
  {
    content:
      'Para fazer tal façanha, é só usar o operador *ou*, que verifica se o primeiro valor é igual a *verdadeiro* OU o segundo é igual a *verdadeiro*.',
    type: 'quote',
    title: 'Operador (ou)',
    picture: 'panda-andando-com-bambu.jpg',
  },
  {
    content: `var combustivel = "Quantum"
escreva(combustivel == "Etherium" ou combustivel == "Plasmatron")

//  Resultado: falso`,
    type: 'code',
    isRunnable: true,
  },
  {
    content: 'Como esperado, o combustível consumido por esse motor não é aceitável',
    type: 'default',
    picture: 'panda-triste.jpg',
  },
  {
    content: 'Mas agora se trocarmos o combustível para "Plasmatron"...',
    type: 'default',
    picture: 'panda-segurando-bambu-de-pe.jpg',
  },
  {
    content: `var combustivel = "Plasmatron"

escreva(combustivel == "Etherium" ou combustivel == "Plasmatron")

//  Resultado: verdadeiro`,
    type: 'code',
    isRunnable: true,
  },
  {
    content: 'Mas e o Etherium?',
    type: 'user',
  },
  {
    content:
      'Como você percebeu, o resultado é *verdadeiro* porque apenas uma das duas comparações precisa resultar em verdadeiro.',
    type: 'default',
    picture: 'panda-sorrindo.jpg',
  },
  {
    content:
      'Nesse caso, o combustível não é do tipo "Etherium", mas é do tipo "Plasmatron", o que também é aceitável.',
    type: 'default',
    picture: 'panda-segurando-bambu-de-pe.jpg',
  },
  {
    picture: 'apollo-encima-do-foguete.jpg',
    content: 'Trocando combustíveis.',
    type: 'image',
  },
  {
    content: 'Troca feita com sucesso!',
    type: 'user',
  },
  {
    content: 'Agora sim, o motor 2 está funcionando corretamente.',
    type: 'default',
    picture: 'panda-comemorando.jpg',
  },
  {
    content: 'Ufa!',
    type: 'user',
  },
  {
    content:
      'Calma aí! É bom verificar antes se agora os dois motores estão funcionando corretamente:',
    type: 'default',
    picture: 'panda-piscando.jpg',
  },
  {
    content: `var motor1Funcionando = verdadeiro
var motor2Funcionando = verdadeiro

var tudoOk = !motor1Funcionando e motor2Funcionando

escreva(tudoOk)

//  Resultado: falso`,
    type: 'code',
    isRunnable: true,
  },
  {
    content: 'Falso!? Mas as duas variáveis são *verdadeiro*!',
    type: 'user',
  },
  {
    content: 'Sim! Acontece que há um operador extra sendo utilizado.',
    type: 'default',
    picture: 'panda-olhando-computador.jpg',
  },
  {
    content: 'Como assim? Onde?',
    type: 'user',
  },
  {
    content:
      'Perceba que antes da variável *motor1Funcionando* há um ponto de exclamação. E sua similaridade com o operador *!=* não é coincidência.',
    type: 'default',
    picture: 'panda-sorrindo.jpg',
  },
  {
    content:
      'Esse operador serve para inverter valores do tipo lógico. Ou seja, se colocado antes de um valor, ele inverte o seu valor lógico.',
    type: 'quote',
    title: 'Operador de negação (!)',
    picture: 'panda-segurando-bambu-de-pe.jpg',
  },
  {
    content: 'Sério?',
    type: 'user',
  },
  {
    content:
      'Sim! Por exemplo, se o valor inicial for *falso*, ele será invertido para *verdadeiro*, e vice-versa.',
    type: 'default',
    picture: 'panda-piscando.jpg',
  },
  {
    content: `escreva(!falso)

//  Resultado: verdadeiro`,
    type: 'code',
    isRunnable: true,
  },
  {
    content: 'Logo, basta tirar esse operador de negação.',
    type: 'default',
    picture: 'panda-sorrindo.jpg',
  },
  {
    content: `var motor1Funcionando = verdadeiro
var motor2Funcionando = verdadeiro
var tudoOk = motor1Funcionando e motor2Funcionando

escreva(tudoOk)

//  Resultado: verdadeiro`,
    type: 'code',
    isRunnable: true,
  },
  {
    content: 'Entendi!',
    type: 'user',
  },
]
