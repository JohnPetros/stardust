export const DELEGUA_DOCUMENTACOES_METODOS_DICIONARIOS = [
  {
    word: 'chaves',
    content: `### Descrição 

Retorna uma lista de texto com todas as chaves de um dicionário.

### Exemplo de Código 
    var d = {"a": 1, "b": 2, "c": 3}    
    escreva(d.chaves()) // ["a", "b", "c"]    

### Formas de uso  `,
    example: 'dicionário.chaves()',
  },
  {
    word: 'contem',
    content: `### Descrição 

Retorna verdadeiro se o elemento passado como parâmetro existe como chave do dicionário. Devolve falso em caso contrário.

### Exemplo de Código 
    var d = {"a": 1, "b": 2, "c": 3}    
    escreva(d.contem("a")) // verdadeiro    
    escreva(d.contem("f")) // falso    

### Formas de uso  `,
    example: 'dicionário.contem("minhaChave")',
  },
  {
    word: 'contém',
    content: `### Descrição 

Retorna verdadeiro se o elemento passado como parâmetro existe como chave do dicionário. Devolve falso em caso contrário.

### Exemplo de Código 
    var d = {"a": 1, "b": 2, "c": 3}    
    escreva(d.contém("a")) // verdadeiro    
    escreva(d.contém("f")) // falso    

### Formas de uso  `,
    example: 'dicionário.contém("minhaChave")',
  },
  {
    word: 'remover',
    content: `### Descrição 

Remove uma chave e seu valor do dicionário.

### Exemplo de Código 
    var d = {"a": 1, "b": 2, "c": 3}    
    d.remover("b")    
    escreva(d) // {"a": 1, "c": 3}    

### Formas de uso  `,
    example: 'dicionário.remover(chave)',
  },
  {
    word: 'valores',
    content: `### Descrição 

Retorna uma lista com todos os valores de um dicionário.

### Exemplo de Código 
    var d = {"a": 1, "b": 2, "c": 3}    
    escreva(d.valores()) // [1, 2, 3]    

### Formas de uso  `,
    example: 'dicionário.valores()',
  },
]
