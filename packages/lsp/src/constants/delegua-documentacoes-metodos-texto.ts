import type { LspDocumentation } from '@stardust/core/global/types'

export const DELEGUA_DOCUMENTACOES_METODOS_TEXTO: LspDocumentation[] = [
  {
    word: 'aparar',
    content: `### Descrição 

Remove espaços em branco no início e no fim de um texto.

### Exemplo de Código 
    var t = "   meu texto com espaços no início e no fim       "    
    escreva("|" + t.aparar() + "|") // "|meu texto com espaços no início e no fim|"    

### Formas de uso  `,
    example: 'texto.aparar()',
  },
  {
    word: 'apararFim',
    content: `### Descrição 

Remove espaços em branco no fim de um texto.

### Exemplo de Código 
    var t = "   meu texto com espaços no início e no fim       "    
    escreva("|" + t.apararFim() + "|") // "|   meu texto com espaços no início e no fim|"    

### Formas de uso  `,
    example: 'texto.apararFim()',
  },
  {
    word: 'apararInicio',
    content: `### Descrição 

Remove espaços em branco no início de um texto.

### Exemplo de Código 
    var t = "   meu texto com espaços no início e no fim       "    
    escreva("|" + t.apararInicio() + "|") // "|meu texto com espaços no início e no fim       |"    

### Formas de uso  `,
    example: 'texto.apararInicio()',
  },
  {
    word: 'concatenar',
    content: `### Descrição 

Realiza a junção de palavras/textos.

### Exemplo de Código 
    var t1 = "um"     
    var t2 = "dois três"    
    escreva(t1.concatenar(t2)) // "umdois três"    

### Formas de uso  `,
    example: 'texto.concatenar(outroTexto)',
  },
  {
    word: 'dividir',
    content: `### Descrição 

Divide o texto pelo separador passado como parâmetro.

### Exemplo de Código 
    var t = "um dois três"    
    t.dividir(' ') // ['um','dois','três']    

### Formas de uso  `,
    example: "texto.dividir('<delimitador (, ; ' ')>')",
  },
  {
    word: 'fatiar',
    content: `### Descrição 

Extrai uma fatia do texto, dadas posições de início e fim.

### Exemplo de Código 
    var t = "Um dois três quatro"    
    t.fatiar() // "um dois três quatro", ou seja, não faz coisa alguma.    
    t.fatiar(2, 7) // "dois"    
    t.fatiar(8, 12) // "três"    
    t.fatiar(8) // "três quatro", ou seja, seleciona tudo da posição 8 até o final do texto.    

### Formas de uso  `,
    example: `texto.fatiar(início, final)
    texto.fatiar(aPartirDaPosicao)`,
  },
  {
    word: 'inclui',
    content: `### Descrição 

Devolve verdadeiro se elemento passado por parâmetro está contido no texto, e falso em caso contrário.

### Exemplo de Código 
    var t = "um dois três"    
    t.inclui("dois") // verdadeiro    
    t.inclui("quatro") // falso    

### Formas de uso  `,
    example: "texto.inclui('palavra')",
  },
  {
    word: 'inverter',
    content: `### Descrição 

Inverte as letras de um texto.

### Exemplo de Código 
    var t = "um dois três"    
    t.inverter() // "sêrt siod mu"    

### Formas de uso  `,
    example: 'texto.inverter()',
  },
  {
    word: 'maiusculo',
    content: `### Descrição 

Converte todos os caracteres alfabéticos para suas respectivas formas em maiúsculo.

### Exemplo de Código 
    var t = "tudo em minúsculo"    
    escreva(t.maiusculo()) // "TUDO EM MINÚSCULO"    

### Formas de uso  `,
    example: 'texto.maiusculo()',
  },
  {
    word: 'minusculo',
    content: `### Descrição 

Converte todos os caracteres alfabéticos para suas respectivas formas em minúsculo.

### Exemplo de Código 
    var t = "TUDO EM MAIÚSCULO"    
    escreva(t.minusculo()) // "tudo em maiúsculo"    

### Formas de uso  `,
    example: 'texto.minusculo()',
  },
  {
    word: 'substituir',
    content: `### Descrição 

Substitui a primeira ocorrência no texto do primeiro parâmetro pelo segundo parâmetro.

### Exemplo de Código 
    var t = "Eu gosto de caju"    
    t.substituir("caju", "graviola") // Resultado será "Eu gosto de graviola"    

### Formas de uso  `,
    example: "texto.substituir('palavra a ser substituída', 'nova palavra')",
  },
  {
    word: 'subtexto',
    content: `### Descrição 

Extrai uma fatia do texto, dadas posições de início e fim.

### Exemplo de Código 
    var t = "Eu gosto de caju e de graviola"    
    t.subtexto(3, 16) // Resultado será "gosto de caju"    

### Formas de uso  `,
    example: 'texto.subtexto(posiçãoInicial, posiçãoFinal)',
  },
  {
    word: 'tamanho',
    content: `### Descrição 

Devolve um número inteiro com o número de caracteres do texto.

### Exemplo de Código 
    var t = "Um dois três quatro"    
    t.tamanho() // 19    

### Formas de uso  `,
    example: 'texto.tamanho()',
  },
]
