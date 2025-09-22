import type { LspDocumentation } from '@stardust/core/global/types'

export const DELEGUA_DOCUMENTACOES_METODOS_VETOR: LspDocumentation[] = [
  {
    word: 'mapear',
    content: 'Percorre um vetor executando uma função para cada item desse mesmo vetor.',
    example: null,
  },
  {
    word: 'adicionar',
    content: `### Descrição 

Escreve um ou mais argumentos na saída padrão da aplicação.

### Exemplo de Código 
    v.adicionar(7)    
    v.adicionar(5)    
    v.adicionar(3)    
    escreva(v) // [7, 5, 3]    

### Formas de uso  `,
    example: 'vetor.adicionar(elemento)',
  },
  {
    word: 'concatenar',
    content: `### Descrição 

Adiciona ao conteúdo do vetor um ou mais elementos

### Exemplo de Código 
    var v = [7, 5, 3]    
    escreva(v.concatenar([1, 2, 4])) // [7, 5, 3, 1, 2, 4]    

### Formas de uso  `,
    example: 'vetor.concatenar(...argumentos)',
  },
  {
    word: 'empilhar',
    content: `### Descrição 

Adiciona um elemento ao final do vetor.

### Exemplo de Código 
    var v = []     
    v.empilhar(7)    
    v.empilhar(5)    
    v.empilhar(3)    
    escreva(v) // [7, 5, 3]     

### Formas de uso  `,
    example: 'vetor.empilhar(conteúdo)',
  },
  {
    word: 'fatiar',
    content: `### Descrição 

Extrai uma fatia do vetor, dadas posições de início e fim. 

### Exemplo de Código 
    var v = [1, 2, 3, 4, 5]     
    escreva(v.fatiar()) // "[1, 2, 3, 4, 5]", ou seja, não faz coisa alguma.     
    escreva(v.fatiar(2, 4)) // "[3, 4]"    
    escreva(v.fatiar(2)) // "[3, 4, 5]", ou seja, seleciona tudo da posição 3 até o final do vetor.     

### Formas de uso  
Fatiar suporta sobrecarga do método
 `,
    example: `vetor.fatiar(a partir desta posicao)

    vetor.fatiar(a partir desta posicao, ate esta posicao)    `,
  },
  {
    word: 'inclui',
    content: `### Descrição 

Extrai uma fatia do vetor, dadas posições de início e fim. 

### Exemplo de Código 
    var v = [1, 2, 3]    
    escreva(v.inclui(2)) // verdadeiro    
    escreva(v.inclui(4)) // falso    

### Formas de uso  `,
    example: 'vetor.inclui(elemento)',
  },
  {
    word: 'inverter',
    content: `### Descrição 

Inverte a ordem dos elementos de um vetor.

### Exemplo de Código 
    var v = [1, 2, 3]     
    escreva(v.inverter()) // [3, 2, 1]     

### Formas de uso  `,
    example: 'vetor.inverter()',
  },
  {
    word: 'ordenar',
    content: `### Descrição 

Ordena valores em ordem crescente. Esta função só aceita vetores.

### Exemplo de Código 
    // A ordenação padrão é ascendente, ou seja, para o caso de números, a ordem fica do menor para o maior.    
    var v = [4, 2, 12, 5]     
    escreva(v.ordenar()) // [2, 4, 5, 12]     
    // Para o caso de textos, a ordenação é feita em ordem alfabética, caractere a caractere.    
    var v = ["aaa", "a", "aba", "abb", "abc"]    
    escreva(v.ordenar()) // ["a", "aaa", "aba", "abb", "abc"]    

### Formas de uso  `,
    example: 'vetor.ordenar()',
  },
  {
    word: 'remover',
    content: `### Descrição 

Remove um elemento do vetor caso o elemento exista no vetor.

### Exemplo de Código 
    var vetor = [1, 2, 3]     
    vetor.remover(2)     
    escreva(vetor) // [1, 3]     

### Formas de uso  `,
    example: 'vetor.remover(elemento)',
  },
  {
    word: 'removerPrimeiro',
    content: `### Descrição 

Remove o primeiro elemento do vetor caso o elemento exista no vetor.

### Exemplo de Código 
    var vetor = [1, 2, 3]    
    var primeiroElemento = vetor.removerPrimeiro()    
    escreva(primeiroElemento) // 1    
    escreva(vetor) // [2, 3]    

### Formas de uso  `,
    example: 'vetor.removerPrimeiro()',
  },
  {
    word: 'removerUltimo',
    content: `### Descrição 

Remove o último elemento do vetor caso o elemento exista no vetor.

### Exemplo de Código 
    var vetor = [1, 2, 3]    
    var ultimoElemento = vetor.removerUltimo()    
    escreva(ultimoElemento) // 3    
    escreva(vetor) // [1, 2]    

### Formas de uso  `,
    example: 'vetor.removerUltimo()',
  },
  {
    word: 'somar',
    content: `### Descrição 

Soma ou concatena todos os elementos do vetor (de acordo com o tipo de dados desses elementos) e retorna o resultado.

### Exemplo de Código 
    var vetor = [1, 2, 3, 4, 5]    
    escreva(vetor.somar()) // 15      

### Formas de uso  `,
    example: 'vetor.somar()',
  },
  {
    word: 'tamanho',
    content: `### Descrição 

Retorna o número de elementos que compõem o vetor.

### Exemplo de Código 
    var vetor = [0, 1, 2, 3, 4]     
    escreva(vetor.tamanho()) // 5     

### Formas de uso  `,
    example: 'vetor.tamanho()',
  },
  {
    word: 'juntar',
    content: `### Descrição 

Junta os elementos de um vetor em um literal de texto, separando os elementos pelo separados passado como parâmetro.

### Exemplo de Código 
    var vetor = ['maçã', 'laranja', 'banana', 'morango']     
    escreva(vetor.juntar(', ')) // maçã, laranja, banana, morango      

### Formas de uso  `,
    example: 'vetor.juntar(separador)',
  },
]
