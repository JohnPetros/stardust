# Regras da Camada Delegua

# Visao Geral

Delégua é a linguagem executada pelos desafios, lições, soluções oficiais e
exemplos educacionais da StarDust. Todo código Delégua deve respeitar a
sintaxe e o vocabulário em português definidos pela linguagem.

## Objetivo

Padronizar a escrita, a execução, a apresentação e a validação de código
Delégua no projeto.

## Responsabilidades

- Escrever exemplos e soluções em Delégua válido e idiomático.
- Manter palavras reservadas, valores lógicos, tipos e funções nativas em
  português.
- Validar código Delégua pelo interpretador/LSP utilizado pelo projeto.
- Diferenciar código Delégua de TypeScript, JavaScript ou textos que apenas
  armazenam código Delégua.

## Limites

- Estas regras se aplicam ao conteúdo executado como Delégua, incluindo strings
  de código, fixtures, mocks, desafios, soluções oficiais, snippets e testes.
- Elas não substituem as regras de TypeScript, React ou persistência que cercam
  esse conteúdo.
- A versão do interpretador disponível no projeto é a autoridade final para
  recursos versionados da linguagem.

# Estrutura de Diretorios Globais

O código Delégua pode aparecer em diferentes áreas do monorepo:

- `packages/lsp/`: execução, análise sintática, análise semântica e integração
  com o editor.
- `packages/core/`: contratos, entidades e DTOs que transportam código,
  entradas e resultados.
- `apps/web/src/mocks/`: exemplos educacionais e dados de lições que contêm
  código Delégua.
- `apps/web/src/ui/`: editores, snippets e componentes que exibem ou enviam
  código Delégua.
- `apps/server/`: execução de submissões e integração com o provedor LSP.
- `documentation/`: exemplos normativos e documentação da linguagem no
  contexto do projeto.

## Organização

- Código Delégua deve ser mantido como texto apenas na borda que precisa
  transportá-lo ou persistí-lo.
- A lógica de execução não deve ser reimplementada em TypeScript para simular
  o resultado de um programa Delégua.
- Fixtures devem deixar explícito quando um campo contém código Delégua,
  entrada Delégua ou saída esperada.
- Nomes de arquivos e símbolos TypeScript seguem as regras gerais do projeto;
  nomes escritos dentro do programa Delégua seguem as regras desta camada.

# Principios Fundamentais

## Deve conter

### Simplicidade primeiro

As soluções de desafios devem priorizar a abordagem correta mais simples,
legível e didática para o objetivo proposto. Simplicidade não significa apenas
ter menos linhas: significa reduzir decisões, abstrações e estruturas que não
ajudam a explicar ou resolver o problema.

- Comece pela solução direta antes de considerar uma otimização.
- Prefira fluxo de controle claro e nomes descritivos a construções compactas
  ou engenhosas.
- Não adicione mapas, conjuntos, conversões, funções auxiliares ou etapas
  extras sem uma necessidade real do algoritmo.
- Use uma abordagem mais complexa somente quando o enunciado, as restrições de
  entrada ou o objetivo pedagógico justificarem a complexidade.
- Quando uma otimização for necessária, a solução oficial deve explicar a
  motivação e o custo-benefício da escolha.

### Português como regra obrigatória

Todo código Delégua deve usar o vocabulário em português. Isso inclui:

- palavras reservadas e estruturas de controle;
- valores lógicos `verdadeiro` e `falso`;
- o valor vazio `nulo`;
- nomes de funções, variáveis, parâmetros e chaves criados para o domínio do
  desafio;
- comentários e textos de apoio inseridos no próprio código.

Desafios também devem usar português em seus títulos, enunciados, explicações,
rótulos de painéis, mensagens, entradas, saídas e resultados. Um termo em
inglês não deve aparecer na experiência do desafio quando houver um equivalente
claro em português.

Não se deve escrever booleanos em inglês dentro de código Delégua. O resultado
de comparações e funções lógicas também deve ser representado por
`verdadeiro` ou `falso`.

Quando o código Delégua estiver dentro de uma string TypeScript, a regra ainda
se aplica ao conteúdo da string:

```ts
const codigo = `funcao ehPar(numero) {
  retorna numero % 2 == 0
}

escreva(ehPar(4))`
```

O programa acima deve produzir `verdadeiro`, e não um literal booleano em
inglês.

### Vocabulário canônico

Use as formas abaixo nos novos códigos do projeto:

| Conceito | Delégua |
| --- | --- |
| variável | `var` ou `variavel` |
| constante | `const` ou `constante` |
| função | `funcao` |
| retorno | `retorna` |
| condicional | `se`, `senao se`, `senao` |
| laço condicional | `enquanto` |
| laço contado | `para` |
| saída | `escreva()` |
| entrada | `leia()` |
| verdadeiro | `verdadeiro` |
| falso | `falso` |
| vazio | `nulo` |
| conjunção | `e` |
| disjunção | `ou` |
| pertencimento | `em` ou `contem()`/`contém()` |

Delégua aceita algumas formas acentuadas e não acentuadas como equivalentes.
Para manter compatibilidade com os exemplos existentes e evitar problemas de
digitação, o projeto deve preferir as formas não acentuadas nas palavras
reservadas (`funcao`, `senao`, `variavel`). Textos exibidos ao usuário devem
seguir a ortografia normal do português.

### Nomes no código Delégua

- Nomes de domínio devem ser escritos em português e ser descritivos.
- Funções devem começar, sempre que possível, com um verbo no infinitivo ou
  uma ação clara: `calcularMedia`, `encontrarMaior`, `verificarPalindromo`.
- Variáveis booleanas devem comunicar uma condição: `ehValido`, `encontrou`,
  `estaOrdenado`.
- Use camelCase para identificadores compostos e não use acentos em
  identificadores, mesmo quando a linguagem aceitar lexemas acentuados.
- Nomes de bibliotecas, APIs externas ou conceitos que são necessariamente
  próprios podem permanecer como nomes externos, mas não devem alterar o
  vocabulário da linguagem.

### Tipos e valores

Os tipos básicos usados nos desafios são texto, número, lógico, vetor,
dicionário, tupla e nulo. Delégua normalmente infere tipos, mas permite
anotações explícitas quando o contexto exigir.

```delegua
var nome = "Stardust"
var tentativas = 3
var concluido = falso
var itens = [1, 2, 3]
var configuracao = { "modo": "pratica", "ativo": verdadeiro }
```

Vetores devem ser tratados como listas no vocabulário da interface e da
documentação do projeto, embora a sintaxe e a documentação oficial também
usem o termo vetor.

### Entrada e conversões

`leia()` retorna texto. Quando a lógica precisar de número, a entrada deve ser
convertida explicitamente:

```delegua
var texto = leia()
var numero = inteiro(texto)
escreva(numero + 1)
```

Use as funções nativas adequadas (`inteiro`, `numero`, `real`, `texto`) em vez
de assumir que a entrada já possui o tipo desejado.

### Saída e resultados

Use `escreva()` para saída observável. Em desafios que esperam retorno de uma
função, use `retorna` dentro da função e não dependa de efeitos colaterais para
representar a resposta.

```delegua
funcao ehCodigoValido(codigo) {
  se codigo == nulo {
    retorna falso
  }

  retorna verdadeiro
}
```

## Nao deve conter

- Literais booleanos ou palavras reservadas em inglês no código Delégua.
- Sintaxe JavaScript/TypeScript usada por hábito, como funções anônimas com
  `function`, retorno com `return` ou condicionais com `if`.
- `null` ou `undefined` no lugar de `nulo`.
- Conversão implícita de valores lidos por `leia()` quando o algoritmo exige
  um número.
- Código TypeScript usado para mascarar uma incompatibilidade do interpretador
  Delégua.
- Nomes de variáveis de domínio em inglês quando há equivalente claro em
  português.
- Comentários que ensinam uma sintaxe diferente da realmente executada.
- Rótulos, títulos ou mensagens em inglês na experiência do desafio quando
  houver equivalente em português.

# Padroes de Projeto

## Algoritmos de desafios

- A solução deve ser uma função Delégua com parâmetros explícitos e retorno
  determinístico.
- A primeira alternativa avaliada deve ser a solução mais simples que atende
  ao enunciado e às restrições conhecidas.
- A função deve evitar efeitos colaterais desnecessários.
- Casos de entrada inválidos devem ser tratados conforme o enunciado antes do
  algoritmo principal.
- Quando a solução puder retornar cedo, `retorna` deve ser usado para deixar
  claro o caso encontrado.
- Uma otimização não deve ser introduzida apenas para tornar a solução mais
  sofisticada ou para reduzir algumas operações sem impacto relevante.

```delegua
funcao encontrarPrimeiroPar(numeros) {
  para (var indice = 0; indice < numeros.tamanho(); indice++) {
    se numeros[indice] % 2 == 0 {
      retorna numeros[indice]
    }
  }

  retorna nulo
}
```

## Dois ponteiros

Para algoritmos com dois índices, use nomes em português que expliquem o
papel de cada ponteiro e atualize-os dentro de um laço `enquanto`:

```delegua
funcao ehPalindromo(texto) {
  var esquerda = 0
  var direita = texto.tamanho() - 1

  enquanto esquerda < direita {
    se texto[esquerda] != texto[direita] {
      retorna falso
    }

    esquerda++
    direita--
  }

  retorna verdadeiro
}
```

## Funções nativas e métodos

- Prefira funções e métodos nativos documentados pela linguagem.
- Para listas, use métodos como `tamanho()`, `adicionar()`, `fatiar()`,
  `filtrarPor()` e `mapear()` quando tornarem a intenção mais clara.
- Para conversões, prefira `inteiro()`, `real()`, `numero()` e `texto()`.
- Não invente uma função nativa em um exemplo sem validar que ela existe na
  versão do interpretador usada pelo projeto.

# Padroes de Uso Aplicados

## Exemplo mínimo

```delegua
funcao saudar(nome) {
  retorna "Olá, ${nome}!"
}

escreva(saudar("explorador"))
```

## Condicionais

Use `se`, `senao se` e `senao`. Condições devem produzir valores lógicos ou
usar uma expressão cujo valor lógico seja intencional:

```delegua
se pontuacao >= 100 {
  escreva("nível avançado")
} senao se pontuacao >= 50 {
  escreva("nível intermediário")
} senao {
  escreva("nível inicial")
}
```

## Laços

- Use `enquanto` quando a continuação depender de uma condição.
- Use `para` quando houver inicialização, condição e passo controlados por um
  índice.
- Garanta que o estado usado na condição seja alterado para evitar laços
  infinitos.

## Saída booleana

Toda documentação, fixture, solução oficial e resultado esperado deve usar
`verdadeiro` e `falso` quando representar valores lógicos Delégua. A camada de
apresentação também deve traduzir valores lógicos para PT-BR antes de mostrá-los
ao usuário.

## Comentários

Comentários devem explicar a intenção do algoritmo, não traduzir linha a
linha a sintaxe. Devem ser escritos em português e não podem apresentar uma
palavra-chave estrangeira como se fosse código válido.

# Regras de Integracao com Outras Camadas

- A UI deve enviar e exibir o código como texto Delégua sem reescrever seus
  tokens.
- O servidor deve executar código Delégua através do contrato de `LspProvider`
  e do `DeleguaProvedorLsp`, não através de `eval`, `new Function` ou execução
  direta de JavaScript.
- Análise sintática e semântica devem ser delegadas ao pacote `packages/lsp`.
- O pacote `core` deve transportar código, entrada e saída por DTOs sem
  introduzir sintaxe de outra linguagem no conteúdo Delégua.
- O playback de código deve manter os tokens reais do programa executado;
  rótulos da interface podem ser localizados sem alterar o código.
- Valores de saída devem ser normalizados para a apresentação em PT-BR,
  principalmente booleanos (`verdadeiro`/`falso`) e nulo (`nulo`).
- Código TypeScript que contém um template string Delégua deve ter testes que
  validem o conteúdo executável, não apenas a existência da string.

# Checklist Rapido para Novas Features na Camada Delegua

- [ ] Todo o código executável usa palavras reservadas em português.
- [ ] A solução escolhida é a abordagem correta mais simples para o objetivo do
      desafio.
- [ ] Booleanos estão escritos como `verdadeiro` ou `falso`.
- [ ] O valor vazio está escrito como `nulo`.
- [ ] Funções, variáveis, parâmetros e comentários do domínio estão em
      português.
- [ ] `leia()` teve seu retorno convertido quando necessário.
- [ ] Funções nativas e métodos usados existem na versão do interpretador do
      projeto.
- [ ] A execução é feita pelo LSP/interpretador Delégua, sem simulação em
      JavaScript.
- [ ] Entradas, saídas e resultados esperados foram testados.
- [ ] Strings de código em TypeScript foram validadas como programas Delégua.
- [ ] Nenhum texto exibido ao usuário apresenta `true`, `false`, `null` ou
      palavras reservadas em inglês como resultado de código Delégua.
- [ ] Títulos, explicações, rótulos, entradas, saídas e mensagens do desafio
      estão em português.
- [ ] Toda complexidade adicional possui uma justificativa no enunciado, nas
      restrições ou na explicação da solução.

# Observacoes e Pendencias

- Estas regras adotam como referência a [wiki oficial do
  Delégua](https://github.com/DesignLiquido/delegua/wiki), especialmente as
  páginas de [introdução](https://github.com/DesignLiquido/delegua/wiki/Inicial),
  [estruturas de dados](https://github.com/DesignLiquido/delegua/wiki/Estruturas-de-dados-elementares),
  [entrada e saída](https://github.com/DesignLiquido/delegua/wiki/Entrada-e-Sa%C3%ADda),
  [operadores](https://github.com/DesignLiquido/delegua/wiki/Operadores),
  [condicionais](https://github.com/DesignLiquido/delegua/wiki/Condicionais),
  [laços de repetição](https://github.com/DesignLiquido/delegua/wiki/La%C3%A7os-de-repeti%C3%A7%C3%A3o),
  [funções](https://github.com/DesignLiquido/delegua/wiki/Fun%C3%A7%C3%B5es) e
  [funções nativas](https://github.com/DesignLiquido/delegua/wiki/Fun%C3%A7%C3%B5es-nativas).
- A wiki possui recursos específicos por versão. Antes de usar uma função,
  método ou recurso novo em uma solução oficial, deve-se confirmar o suporte no
  interpretador instalado no monorepo.
- A convenção de identificadores em português é uma regra do projeto para
  código Delégua; nomes técnicos em TypeScript continuam sujeitos às regras
  gerais de convenções do monorepo.
