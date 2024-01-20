import { Text } from '@/@types/text'
import { formatCode } from '@/utils/helpers'

function getProps(text: Text) {
  const props = Object.keys(text)
  const currentText: { [prop in string]: unknown } = text

  return props
    .filter((prop) => ['title', 'picture'].includes(prop))
    .map((prop) => `${prop}={'${currentText[prop]}'}`)
    .join(' ')
}

export function getMdxComponent(text: Text) {
  const props = getProps(text)

  const content = formatCode(text.content, 'encode')
  switch (text.type) {
    case 'default':
      return `<Text ${props} hasAnimation={undefined}>${content}</Text>`
    case 'alert':
      return `<Alert ${props} hasAnimation={undefined}>${content}</Alert>`
    case 'quote':
      return `<Quote ${props} hasAnimation={undefined}>${content}</Quote>`
    case 'image':
      return `<Image ${props} hasAnimation={undefined}>${content}</Image>`
    case 'user':
      return `<User ${props} hasAnimation={undefined}>${content}</User>`
    case 'code':
      return `<Code ${props} hasAnimation={undefined} isRunnable={${text.isRunnable}}>${content}</Code>`
    default:
      return `<Text ${props} hasAnimation={undefined}>${content}</Text>`
  }
}

/**
 * [
  {
    "type": "image",
    "content": "Vagando no espaço...",
    "picture": "foquete-viajando.jpg"
  },
  {
    "type": "default",
    "content": "Ok, parace que você não encontrou nada de interessante no espaço ainda.",
    "picture": "panda-triste.jpg"
  },
  {
    "type": "user",
    "content": "Mas por quê?"
  },
  {
    "type": "default",
    "content": "Justamente porque seu foguete ainda não sabe quem o está pilotando.",
    "picture": "panda-andando-com-bambu.jpg"
  },
  {
    "type": "default",
    "content": "Para resolver esse problema você terá que escrever um programa que exiba suas informações para ele, e para isso você terá que usar os comandos `leia()` e `escreva()` explicados anteriormente.",
    "picture": "panda.jpg"
  },
  {
    "type": "default",
    "content": "Porém, como você já sabe, para escrever seu nome na tela, é necessário, antes, armazená-lo em uma variável.",
    "picture": "panda-sorrindo.jpg"
  },
  {
    "type": "user",
    "content": "O que são variáveis mesmo?"
  },
  {
    "type": "default",
    "content": "Variáveis são espaços reservados na memória de um programa para algum tipo de dado.",
    "picture": "panda-segurando-bambu-de-pe.jpg"
  },
  {
    "type": "default",
    "content": "Para usá-las de fato é necessário fazer o que chamamos de declarar uma variável, escrevendo `var` e depois definir um nome que você deseja que a variável tenha.",
    "picture": "panda-segurando-bambu-de-pe.jpg"
  },
  {
    "type": "default",
    "content": "Como dessa forma:",
    "picture": "panda-olhando-computador.jpg"
  },
  {
    "type": "code",
    "content": "var nomeCompleto",
    "isRunnable": false
  },
  {
    "type": "user",
    "content": "Como colocar dados nelas?"
  },
  {
    "type": "default",
    "content": "Simples, basta colocar o sinal de igual (=) depois do nome da variável e, em seguida, colocar o valor que você deseja que a variável contenha:",
    "picture": "panda-fazendo-coracao.jpg"
  },
  {
    "type": "code",
    "content": "var nome = \"Kauê Cabess\"\nvar idade = 90",
    "isRunnable": false
  },
  {
    "type": "default",
    "content": "No exemplo acima, estamos criando duas variáveis, uma chamada \"nome\" que armazenará o valor \"Kauê Cabess\" e outra chamada \"idade\" que armazenará o valor 90.",
    "picture": "panda-oferecendo-bambu.jpg"
  },
  {
    "type": "alert",
    "content": "O valor 90 não tem aspas porque ele é não é um texto, mas sim um número, mas podemos falar sobre isso depois.",
    "picture": "panda-olhando-de-lado.jpg"
  },
  {
    "type": "default",
    "content": "Além disso, você também pode atribuir o valor de uma variável a uma outra variável.",
    "picture": "panda-sorrindo-sentado.jpg"
  },
  {
    "type": "code",
    "content": "var nome = \"Kauê Cabess\"\nvar nomeCompleto = nome\nescreva(nomeCompleto)\n\n// Resultado: Kauê Cabess",
    "isRunnable": true
  },
  {
    "type": "default",
    "content": "Agora, observe um exemplo completo utilizando tudo que vimos até agora.",
    "picture": "panda-deslumbrado.jpg"
  },
  {
    "type": "code",
    "content": "var nome = leia(\"Digite seu nome:\")\nvar idade = leia(\"Digite sua idade:\")\nvar nomeCompleto = nome\n\nescreva(\"seu nome completo é \", nomeCompleto)\nescreva(\"e sua idade é \", idade)\n\n// Veja o resultado pressionando o botão de executar",
    "isRunnable": true
  },
  {
    "type": "alert",
    "content": "Dica: você também pode fazer com que o programa escreva um texto e o conteúdo de uma variável ao mesmo tempo, basta separá-los entre vírgulas, assim como mostrado no exemplo acima.",
    "picture": "panda-andando-com-bambu.jpg"
  },
  {
    "type": "alert",
    "content": "ATENÇÃO: ao criar o nome de suas variáveis, é importante seguir 4 regras principais:",
    "picture": "panda-fazendo-coracao.jpg"
  },
  {
    "type": "quote",
    "content": "1 - O nome da variável deve iniciar com uma letra ou sublinhado `(_)`.",
    "picture": "panda-de-oculos.jpg"
  },
  {
    "type": "code",
    "content": "// Nada de iniciar nome de variaveis com números ❌\nvar 15Cavalos\n\n// Mas o nome pode conter números desde que não seja no começo do nome\nvar numero999",
    "isRunnable": true
  },
  {
    "type": "quote",
    "content": "2 - Nome de variável não pode conter espaços.",
    "picture": "panda-de-oculos.jpg"
  },
  {
    "type": "code",
    "content": "// Nada de fazer isso ❌\nvar minha variavel\n\n// Em vez disso, você pode separar usando sublinhado ✅\nvar minha_variavel\n\n// ou colocando a primeira letra da segunda palavra em maiúscula ✅\nvar minhaVariavel",
    "isRunnable": true
  },
  {
    "type": "quote",
    "content": "3 - O nome da variável não pode ser uma palavra já utilizada pela liguagem, por exemplo, um nome de um comando.",
    "picture": "panda-de-oculos.jpg"
  },
  {
    "type": "code",
    "content": "var leia // ❌\n\nvar escreva // ❌\n\nvar var // ❌",
    "isRunnable": true
  },
  {
    "type": "quote",
    "content": "4 - O nome da variável deve ser descritivo e fácil de entender, também, ser relacionado ao valor que está sendo armazenado nela.",
    "picture": "panda-de-oculos.jpg"
  },
  {
    "type": "code",
    "content": "// WHAT⁉\nvar hwrufh = \"Paz mundial!\" // ❌\n\nvar comida = 999 // ❌\n\nvar cor = \"azul\" // ✅",
    "isRunnable": true
  },
  {
    "type": "alert",
    "content": "A atribuição de variáveis é uma parte fundamental da programação, pois permite armazenar valores e acessá-los ao longo do programa. Ao seguir essas regras corretamente, você poderá atribuir valores a suas variáveis sem problemas em programas futuros.",
    "picture": "panda-sorrindo.jpg"
  },
  {
    "type": "quote",
    "content": "Agora que você aprendeu mais um pouco, que tal praticar tudo o que já vimos até agora?",
    "picture": "panda-fazendo-coracao.jpg"
  }
]
 */
