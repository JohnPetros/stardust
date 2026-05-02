import type { LspSnippet } from '@stardust/core/global/types'

export const DELEGUA_EXAMPLE_SNIPPETS = [
  {
    label: 'Ola mundo',
    code: 'escreva("Ola, mundo!")',
  },
  {
    label: 'Variaveis e tipos',
    code: `var nome = "Ana"
var idade = 16
var aprovado = verdadeiro

escreva(nome)
escreva(idade)
escreva(aprovado)`,
  },
  {
    label: 'Condicional se/senao',
    code: `var idade = 17

se (idade >= 18) {
  escreva("Maior de idade")
} senao {
  escreva("Menor de idade")
}`,
  },
  {
    label: 'Laco para',
    code: `para (var i = 1; i <= 5; i = i + 1) {
  escreva(i)
}`,
  },
  {
    label: 'Laco enquanto',
    code: `var contador = 1

enquanto (contador <= 3) {
  escreva(contador)
  contador = contador + 1
}`,
  },
  {
    label: 'Funcao com retorno',
    code: `funcao dobro(numero) {
  retorna numero * 2
}

var resultado = dobro(8)
escreva(resultado)`,
  },
  {
    label: 'Lista e repeticao',
    code: `var frutas = ["maca", "banana", "uva"]

para (var i = 0; i < frutas.tamanho(); i = i + 1) {
  escreva(frutas[i])
}`,
  },
  {
    label: 'Dicionario e acesso por chave',
    code: `var pessoa = {
  "nome": "Carla",
  "idade": 20
}

escreva(pessoa["nome"])
escreva(pessoa["idade"])`,
  },
  {
    label: 'Entrada do usuario',
    code: `escreva("Qual e o seu nome?")
var nome = leia()

escreva("Ola, " + nome + "!")`,
  },
  {
    label: 'Mini algoritmo: numero par',
    code: `var num = numero(leia())

se (num % 2 == 0) {
  escreva("O número e par")
} senao {
  escreva("O número e impar")
}`,
  },
] as const satisfies readonly LspSnippet[]
