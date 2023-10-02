export const texts = [
  {
    type: 'default',
    content:
      'Vish! Parece que o povo desse planeta não gostou da nossa cara e se afastou de nós.',
    picture: 'panda-confuso.jpg',
  },
  {
    type: 'default',
    content: 'Então, tudo o que resta a fazer é cair fora desse planeta.',
    picture: 'panda-sorrindo.jpg',
  },
  {
    type: 'user',
    content: '#Partiu',
  },
  {
    type: 'default',
    content:
      'No entanto, é preciso verificar se tudo está ok para fazer uma partida segura e manter uma viagem no espaço.',
    picture: 'panda-olhando-de-lado.jpg',
  },
  {
    type: 'user',
    content: 'Como assim?',
  },
  {
    type: 'default',
    content:
      'Por exemplo, é importante averiguar se a quantidade de combustível atualmente disponível é maior que a quantidade necessária para fazer a decolagem.',
    picture: 'panda-piscando-sentado.jpg',
  },
  {
    type: 'user',
    content: 'E como fazer isso?',
  },
  {
    type: 'default',
    content:
      'É aí que entra em cena os operadores relacionais! Eles servem justamente para fazer uma comparação (relação) entre dois valores.',
    picture: 'panda-deslumbrado.jpg',
  },
  {
    type: 'quote',
    title: 'Operador de maior que (>)',
    content:
      'Por exemplo, caso queira verificar se um número é maior que outro número, você pode utilizar o operador `maior que` representado pelo símbolo `>`.',
    picture: 'panda-andando-com-bambu.jpg',
  },
  {
    type: 'code',
    content: `var combAtual = 100
var combExigido = 5
escreva(combAtual > combExigido)

//  Resultado: verdadeiro`,
    isRunnable: true,
  },
  {
    type: 'default',
    content:
      'Perceba que o resultado da comparação entre dois valores é um valor do tipo lógico (`verdadeiro` ou `falso`), e isso vai acontecer toda vez você usar os operadores relacionais.',
    picture: 'panda-andando-com-bambu.jpg',
  },
  {
    type: 'alert',
    content:
      'Não se esqueça disso, pois isso vai ser bastante importante depois!',
    picture: 'panda-fazendo-coracao.jpg',
  },
  {
    type: 'default',
    content:
      'E é claro, se existe o operador de `maior que`, também existe o de `menor que`.',
    picture: 'panda-dando-risadinha.jpg',
  },
  {
    type: 'quote',
    title: 'Operador de menor que (<)',
    content:
      'Por exemplo, se quiséssemos fazer a mesma comparação anterior, só que verificando se a quantidade de combustível necessária é menor que a atual, teríamos que usar o operador `menor que` (<).',
    picture: 'panda-andando-com-bambu.jpg',
  },
  {
    type: 'code',
    content: `var combAtual = 100
var combExigido = 5
escreva(combAtual < combExigido)

//  Resultado: falso`,
    isRunnable: true,
  },
  {
    type: 'default',
    content:
      'Note que o resultado agora é `falso` justamente porque a quantidade atual é maior que a exigida.',
    picture: 'panda-piscando.jpg',
  },
  {
    type: 'image',
    content: 'Preparando para decolagem...',
    picture: 'foguete-decolando.jpg',
  },
  {
    type: 'default',
    content:
      'Enfim, começamos a decolar! Entretanto, é preciso checar agora se a velocidade atual do foguete é igual ou pelo menos superior que a velocidade de decolagem necessária para sair da atmosfera.',
    picture: 'panda-amando-bambu.jpg',
  },
  {
    type: 'default',
    content:
      'Para fazer isso não dá para usar operador `>` porque ele só verifica se um valor é maior ou não que outro valor.',
    picture: 'panda-triste.jpg',
  },
  {
    type: 'default',
    content:
      'E no nosso caso a velocidade não precisa ser tão superior, mas no mínimo igual.',
    picture: 'panda.jpg',
  },
  {
    type: 'quote',
    title: 'Operador maior ou igual a (>=)',
    content:
      'É aí que entra em cena o novo operador que verifca se um valor é igual ou maior que outro valor, e por isso o motivo de usarmos o símbolo `>=`.',
    picture: 'panda-andando-com-bambu.jpg',
  },
  {
    type: 'code',
    content: `var velocidadeAtual = 300
var velocidadeExigida = 300
escreva(velAtual >= velExigida)

//  Resultado: verdadeiro`,
    isRunnable: true,
  },
  {
    type: 'quote',
    title: 'Operador menor ou igual a (<=)',
    content:
      'Se o caso fosse checar se um valor é menor ou igual a outro, utilizaríamos o `<=`.',
    picture: 'panda-andando-com-bambu.jpg',
  },
  {
    type: 'code',
    content: `var velAtual = 300
var velExigida = 300
escreva(velAtual <= velExigida)

//  Resultado: verdadeiro`,
    isRunnable: true,
  },
  {
    type: 'default',
    content:
      'Perceba que o resultado é mesmo que usar o `>=`, pois ambos os operadores checam se é `verdadeiro` uma de duas verificações (se é maior/menor ou igual).',
    picture: 'panda-abracando-bambu.jpg',
  },
  {
    type: 'default',
    content: 'Beleza, mas ainda há outros questões a serem conferidas.',
    picture: 'panda-sorrindo.jpg',
  },
  {
    type: 'user',
    content: 'E quais seriam?',
  },
  {
    type: 'default',
    content:
      'Por exemplo, lembra-se que eu disse que os dois motores do foguete precisam usar a mesma quantidade de energia?',
    picture: 'panda-olhando-de-lado.jpg',
  },
  {
    type: 'user',
    content: 'Sim!',
  },
  {
    type: 'default',
    content:
      'Então, é possível fazer isso agora usando o operador de igual, porém não o sinal `=`, visto que este serve apenas para atribuir valores a variáveis.',
    picture: 'panda-piscando-sentado.jpg',
  },
  {
    type: 'quote',
    title: 'Operador de igual (==)',
    content:
      'Para verificar se um valor é igual a outro, a gente utiliza o símbolo de `==`, justamente para diferenciar do operador de `=`.',
    picture: 'panda-andando-com-bambu.jpg',
  },
  {
    type: 'code',
    content: `var energiaMotor1 = 501
var energiaMotor2 = 500
escreva(energiaMotor1 == energiaMotor2)

//  Resultado: falso`,
    isRunnable: true,
  },
  {
    type: 'default',
    content:
      'Como esperado, o resultado é `falso`, pois os dois não estão usando a mesma quantidade de energia!',
    picture: 'panda-triste.jpg',
  },
  {
    type: 'default',
    content:
      'O resultado seria `verdadeiro` se estivéssemos verificando se as quantidades são diferentes entre si',
    picture: 'panda-piscando-sentado.jpg',
  },
  {
    type: 'quote',
    title: 'Operador de diferente (!=)',
    content:
      'Para fazer isso, basta usar o operador de `!=`, que checa se dois valores são diferentes entre si.',
    picture: 'panda-andando-com-bambu.jpg',
  },
  {
    type: 'code',
    content: `var energiaMotor1 = 501
var energiaMotor2 = 500
escreva(energiaMotor1 != energiaMotor2)

//  Resultado: verdadeiro`,
    isRunnable: true,
  },
  {
    type: 'default',
    content:
      'Agora o resultado é `verdadeiro` porque os valores não são iguais entre si.',
    picture: 'panda-piscando-sentado.jpg',
  },
  {
    content: 'Se é verdadeiro, então está de boa?',
    type: 'user',
  },
  {
    type: 'default',
    content:
      'NÃO! Independentemente se é `verdadeiro` ou não, ainda estamos em uma fria porque o foguete tem chances de explodir, já que as quantidades de energia estão diferentes entre si 😢.',
    picture: 'panda-triste.jpg',
  },
]
