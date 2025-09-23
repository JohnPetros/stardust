import type { LspDocumentation } from '@stardust/core/global/types'

export const DELEGUA_DOCUMENTACOES_METODOS_VETOR: LspDocumentation[] = [
  {
    word: 'adicionar',
    content: `### Descrição 

Adiciona um ou mais elementos em um vetor.

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

Adiciona ao conteúdo do vetor um ou mais elementos.

### Exemplo de Código 
    var v = [7, 5, 3]    
    escreva(v.concatenar([1, 2, 4])) // [7, 5, 3, 1, 2, 4]    

### Formas de uso  `,
    example: 'vetor.concatenar(...argumentos)',
  },
  {
    word: 'empilhar',
    content: `### Descrição 

Adiciona um elemento ao final do vetor, como se o vetor fosse uma pilha na vertical.

### Exemplo de Código 
    var v = []     
    v.empilhar(7)    
    v.empilhar(5)    
    v.empilhar(3)    
    escreva(v) // [7, 5, 3]     

### Formas de uso  `,
    example: 'vetor.empilhar(elemento)',
  },
  {
    word: 'encaixar',
    content: `### Descrição 

Remove elementos do vetor e opcionalmente adiciona novos elementos no lugar.

### Exemplo de Código 
    var v = [1, 2, 3, 4, 5]    
    v.encaixar(1, 2, 'a', 'b')    
    escreva(v) // [1, 'a', 'b', 4, 5]    

### Formas de uso  `,
    example: 'vetor.encaixar(inicio, excluirQuantidade, ...itens)',
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
    example: `vetor.fatiar(aPartirDestaPosicao)
    vetor.fatiar(aPartirDestaPosicao, ateEstaPosicao)`,
  },
  {
    word: 'filtrarPor',
    content: `### Descrição 

Dada uma função passada como parâmetro, executa essa função para cada elemento do vetor. Elementos cujo retorno da função é falso são excluídos.

### Exemplo de Código 
    var v = [1, 2, 3, 4, 5]    
    var funcaoNumerosImpares = funcao (n) { retorna n % 2 > 0 }    
    escreva(v.filtrarPor(funcaoNumerosImpares)) // "[1, 3, 5]"    

### Formas de uso  `,
    example: 'vetor.filtrarPor(funcao (argumento) { <corpo da função com retorna> })',
  },
  {
    word: 'inclui',
    content: `### Descrição 

Verifica se o elemento existe no vetor. Devolve verdadeiro se existe, e falso em caso contrário.

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
    word: 'juntar',
    content: `### Descrição 

Junta todos os elementos de um vetor em um texto, separando cada elemento pelo separador passado como parâmetro.

### Exemplo de Código 
    var v = [1, 2, 3]    
    escreva(v.juntar(":")) // "1:2:3"    

### Formas de uso  `,
    example: 'vetor.juntar(separador)',
  },
  {
    word: 'mapear',
    content: `### Descrição 

Dada uma função passada como parâmetro, executa essa função para cada elemento do vetor. Cada elemento retornado por esta função é adicionado ao vetor resultante.

### Exemplo de Código 
    var v = [1, 2, 3, 4, 5]    
    var funcaoPotenciasDeDois = funcao (n) { retorna n ** 2 }    
    escreva(v.mapear(funcaoPotenciasDeDois)) // [1, 4, 9, 16, 25]    

### Formas de uso  `,
    example: 'vetor.mapear(funcao (argumento) { <corpo da função com retorna> })',
  },
  {
    word: 'ordenar',
    content: `### Descrição 

Ordena valores de um vetor em ordem crescente.

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
]
