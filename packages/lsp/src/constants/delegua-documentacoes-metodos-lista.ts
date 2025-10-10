import type { LspDocumentation } from '@stardust/core/global/types'

export const DELEGUA_DOCUMENTACOES_METODOS_LISTA: LspDocumentation[] = [
  {
    word: 'adicionar',
    content: `### Descrição 

Adiciona um ou mais elementos em uma lista.

### Exemplo de Código 
    lista.adicionar(7)    
    lista.adicionar(5)    
    lista.adicionar(3)    
    escreva(lista) // [7, 5, 3]    

### Formas de uso  `,
    example: 'lista.adicionar(elemento)',
  },
  {
    word: 'concatenar',
    content: `### Descrição 

Adiciona ao conteúdo do lista um ou mais elementos.

### Exemplo de Código 
    var lista = [7, 5, 3]    
    escreva(lista.concatenar([1, 2, 4])) // [7, 5, 3, 1, 2, 4]    

### Formas de uso  `,
    example: 'lista.concatenar(...argumentos)',
  },
  {
    word: 'empilhar',
    content: `### Descrição 

Adiciona um elemento ao final do lista, como se o lista fosse uma pilha na vertical.

### Exemplo de Código 
    var lista = []     
    lista.empilhar(7)    
    lista.empilhar(5)    
    lista.empilhar(3)    
    escreva(lista) // [7, 5, 3]     

### Formas de uso  `,
    example: 'lista.empilhar(elemento)',
  },
  {
    word: 'encaixar',
    content: `### Descrição 

Remove elementos do lista e opcionalmente adiciona novos elementos no lugar.

### Exemplo de Código 
    var lista = [1, 2, 3, 4, 5]    
    lista.encaixar(1, 2, 'a', 'b')    
    escreva(lista) // [1, 'a', 'b', 4, 5]    

### Formas de uso  `,
    example: 'lista.encaixar(inicio, excluirQuantidade, ...itens)',
  },
  {
    word: 'fatiar',
    content: `### Descrição 

Extrai uma fatia do lista, dadas posições de início e fim. 

### Exemplo de Código 
    var lista = [1, 2, 3, 4, 5]     
    escreva(lista.fatiar()) // "[1, 2, 3, 4, 5]", ou seja, não faz coisa alguma.     
    escreva(lista.fatiar(2, 4)) // "[3, 4]"    
    escreva(lista.fatiar(2)) // "[3, 4, 5]", ou seja, seleciona tudo da posição 3 até o final do lista.     

### Formas de uso  
Fatiar suporta sobrecarga do método
 `,
    example: `lista.fatiar(aPartirDestaPosicao)
    lista.fatiar(aPartirDestaPosicao, ateEstaPosicao)`,
  },
  {
    word: 'filtrarPor',
    content: `### Descrição 

Dada uma função passada como parâmetro, executa essa função para cada elemento do lista. Elementos cujo retorno da função é falso são excluídos.

### Exemplo de Código 
    var lista = [1, 2, 3, 4, 5]    
    var funcaoNumerosImpares = funcao (n) { retorna n % 2 > 0 }    
    escreva(lista.filtrarPor(funcaoNumerosImpares)) // "[1, 3, 5]"    

### Formas de uso  `,
    example: 'lista.filtrarPor(funcao (argumento) { <corpo da função com retorna> })',
  },
  {
    word: 'inclui',
    content: `### Descrição 

Verifica se o elemento existe no lista. Devolve verdadeiro se existe, e falso em caso contrário.

### Exemplo de Código 
    var lista = [1, 2, 3]    
    escreva(lista.inclui(2)) // verdadeiro    
    escreva(lista.inclui(4)) // falso    

### Formas de uso  `,
    example: 'lista.inclui(elemento)',
  },
  {
    word: 'inverter',
    content: `### Descrição 

Inverte a ordem dos elementos de uma lista.

### Exemplo de Código 
    var lista = [1, 2, 3]     
    escreva(lista.inverter()) // [3, 2, 1]     

### Formas de uso  `,
    example: 'lista.inverter()',
  },
  {
    word: 'juntar',
    content: `### Descrição 

Junta todos os elementos de uma lista em um texto, separando cada elemento pelo separador passado como parâmetro.

### Exemplo de Código 
    var lista = [1, 2, 3]    
    escreva(lista.juntar(":")) // "1:2:3"    

### Formas de uso  `,
    example: 'lista.juntar(separador)',
  },
  {
    word: 'mapear',
    content: `### Descrição 

Dada uma função passada como parâmetro, executa essa função para cada elemento do lista. Cada elemento retornado por esta função é adicionado ao lista resultante.

### Exemplo de Código 
    var lista = [1, 2, 3, 4, 5]    
    var funcaoPotenciasDeDois = funcao (n) { retorna n ** 2 }    
    escreva(lista.mapear(funcaoPotenciasDeDois)) // [1, 4, 9, 16, 25]    

### Formas de uso  `,
    example: 'lista.mapear(funcao (argumento) { <corpo da função com retorna> })',
  },
  {
    word: 'ordenar',
    content: `### Descrição 

Ordena valores de uma lista em ordem crescente.

### Exemplo de Código 
    // A ordenação padrão é ascendente, ou seja, para o caso de números, a ordem fica do menor para o maior.    
    var lista = [4, 2, 12, 5]     
    escreva(lista.ordenar()) // [2, 4, 5, 12]     
    // Para o caso de textos, a ordenação é feita em ordem alfabética, caractere a caractere.    
    var lista = ["aaa", "a", "aba", "abb", "abc"]    
    escreva(lista.ordenar()) // ["a", "aaa", "aba", "abb", "abc"]    

### Formas de uso  `,
    example: 'lista.ordenar()',
  },
  {
    word: 'remover',
    content: `### Descrição 

Remove um elemento do lista caso o elemento exista no lista.

### Exemplo de Código 
    var lista = [1, 2, 3]     
    lista.remover(2)     
    escreva(lista) // [1, 3]     

### Formas de uso  `,
    example: 'lista.remover(elemento)',
  },
  {
    word: 'removerPrimeiro',
    content: `### Descrição 

Remove o primeiro elemento do lista caso o elemento exista no lista.

### Exemplo de Código 
    var lista = [1, 2, 3]    
    var primeiroElemento = lista.removerPrimeiro()    
    escreva(primeiroElemento) // 1    
    escreva(lista) // [2, 3]    

### Formas de uso  `,
    example: 'lista.removerPrimeiro()',
  },
  {
    word: 'removerUltimo',
    content: `### Descrição 

Remove o último elemento do lista caso o elemento exista no lista.

### Exemplo de Código 
    var lista = [1, 2, 3]    
    var ultimoElemento = lista.removerUltimo()    
    escreva(ultimoElemento) // 3    
    escreva(lista) // [1, 2]    

### Formas de uso  `,
    example: 'lista.removerUltimo()',
  },
  {
    word: 'somar',
    content: `### Descrição 

Soma ou concatena todos os elementos do lista (de acordo com o tipo de dados desses elementos) e retorna o resultado.

### Exemplo de Código 
    var lista = [1, 2, 3, 4, 5]    
    escreva(lista.somar()) // 15      

### Formas de uso  `,
    example: 'lista.somar()',
  },
  {
    word: 'tamanho',
    content: `### Descrição 

Retorna o número de elementos que compõem o lista.

### Exemplo de Código 
    var lista = [0, 1, 2, 3, 4]     
    escreva(lista.tamanho()) // 5     

### Formas de uso  `,
    example: 'lista.tamanho()',
  },
]
