# Delegua Layer Rules

# Overview

Delégua is the language executed by StarDust's challenges, lessons, official
solutions and educational examples. All Delégua code must respect the
syntax and the Portuguese vocabulary defined by the language.

## Goal

Standardize the writing, execution, presentation and validation of Delégua
code in the project.

## Responsibilities

- Write examples and solutions in valid, idiomatic Delégua.
- Keep reserved words, logical values, types and native functions in
  Portuguese.
- Validate Delégua code through the interpreter/LSP used by the project.
- Distinguish Delégua code from TypeScript, JavaScript or texts that merely
  store Delégua code.

## Boundaries

- These rules apply to content executed as Delégua, including code strings,
  fixtures, mocks, challenges, official solutions, snippets and tests.
- They do not replace the TypeScript, React or persistence rules that surround
  that content.
- The interpreter version available in the project is the final authority for
  versioned language features.

# Global Directory Structure

Delégua code can appear in different areas of the monorepo:

- `packages/lsp/`: execution, syntactic analysis, semantic analysis and
  editor integration.
- `packages/core/`: contracts, entities and DTOs that carry code,
  inputs and results.
- `apps/web/src/mocks/`: educational examples and lesson data that contain
  Delégua code.
- `apps/web/src/ui/`: editors, snippets and components that display or submit
  Delégua code.
- `apps/server/`: execution of submissions and integration with the LSP provider.
- `documentation/`: normative examples and language documentation in the
  context of the project.

## Organization

- Delégua code must be kept as text only at the edge that needs to
  carry or persist it.
- The execution logic must not be reimplemented in TypeScript to simulate
  the result of a Delégua program.
- Fixtures must make explicit when a field contains Delégua code,
  Delégua input or expected output.
- TypeScript file and symbol names follow the project's general rules;
  names written inside the Delégua program follow the rules of this layer.

# Fundamental Principles

## Must contain

### Simplicity first

Challenge solutions must prioritize the simplest correct, readable and
didactic approach for the proposed goal. Simplicity does not just mean
having fewer lines: it means reducing decisions, abstractions and structures that do not
help to explain or solve the problem.

- Start with the direct solution before considering an optimization.
- Prefer clear control flow and descriptive names over compact
  or clever constructs.
- Do not add maps, sets, conversions, helper functions or extra steps
  without a real need of the algorithm.
- Use a more complex approach only when the statement, the input
  constraints or the pedagogical goal justify the complexity.
- When an optimization is necessary, the official solution must explain the
  motivation and the cost-benefit of the choice.

### Portuguese as a mandatory rule

All Delégua code must use the Portuguese vocabulary. This includes:

- reserved words and control structures;
- the logical values `verdadeiro` (true) and `falso` (false);
- the empty value `nulo` (null);
- names of functions, variables, parameters and keys created for the
  challenge's domain;
- comments and supporting texts inserted in the code itself.

Challenges must also use Portuguese in their titles, statements, explanations,
panel labels, messages, inputs, outputs and results. An English term
must not appear in the challenge experience when there is a clear Portuguese
equivalent.

Booleans must not be written in English inside Delégua code. The result
of comparisons and logical functions must also be represented by
`verdadeiro` or `falso`.

When the Delégua code is inside a TypeScript string, the rule still
applies to the content of the string:

```ts
const codigo = `funcao ehPar(numero) {
  retorna numero % 2 == 0
}

escreva(ehPar(4))`
```

The program above must produce `verdadeiro`, and not an English boolean
literal.

### Canonical vocabulary

Use the forms below in the project's new code:

| Concept | Delégua |
| --- | --- |
| variable | `var` or `variavel` |
| constant | `const` or `constante` |
| function | `funcao` |
| return | `retorna` |
| conditional | `se`, `senao se`, `senao` |
| conditional loop | `enquanto` |
| counted loop | `para` |
| output | `escreva()` |
| input | `leia()` |
| true | `verdadeiro` |
| false | `falso` |
| empty | `nulo` |
| conjunction | `e` |
| disjunction | `ou` |
| membership | `em` or `contem()`/`contém()` |

Delégua accepts some accented and unaccented forms as equivalent.
To keep compatibility with the existing examples and avoid typing
problems, the project must prefer the unaccented forms in reserved words
(`funcao`, `senao`, `variavel`). Texts displayed to the user must
follow normal Portuguese spelling.

### Names in Delégua code

- Domain names must be written in Portuguese and be descriptive.
- Functions must start, whenever possible, with a verb in the infinitive or
  a clear action: `calcularMedia`, `encontrarMaior`, `verificarPalindromo`.
- Boolean variables must communicate a condition: `ehValido`, `encontrou`,
  `estaOrdenado`.
- Use camelCase for compound identifiers and do not use accents in
  identifiers, even when the language accepts accented lexemes.
- Names of libraries, external APIs or concepts that are necessarily
  proper names may remain as external names, but must not change the
  language's vocabulary.

### Types and values

The basic types used in challenges are text, number, logical, vector,
dictionary, tuple and null. Delégua normally infers types, but allows
explicit annotations when the context requires them.

```delegua
var nome = "Stardust"
var tentativas = 3
var concluido = falso
var itens = [1, 2, 3]
var configuracao = { "modo": "pratica", "ativo": verdadeiro }
```

Vectors must be treated as lists in the vocabulary of the interface and of the
project's documentation, although the official syntax and documentation also
use the term vector (`vetor`).

### Input and conversions

`leia()` returns text. When the logic needs a number, the input must be
converted explicitly:

```delegua
var texto = leia()
var numero = inteiro(texto)
escreva(numero + 1)
```

Use the appropriate native functions (`inteiro`, `numero`, `real`, `texto`) instead
of assuming that the input already has the desired type.

### Output and results

Use `escreva()` for observable output. In challenges that expect a function to return
a value, use `retorna` inside the function and do not depend on side effects to
represent the answer.

```delegua
funcao ehCodigoValido(codigo) {
  se codigo == nulo {
    retorna falso
  }

  retorna verdadeiro
}
```

## Must not contain

- Boolean literals or reserved words in English in Delégua code.
- JavaScript/TypeScript syntax used out of habit, such as anonymous functions with
  `function`, return with `return` or conditionals with `if`.
- `null` or `undefined` in place of `nulo`.
- Implicit conversion of values read by `leia()` when the algorithm requires
  a number.
- TypeScript code used to mask an incompatibility of the Delégua
  interpreter.
- Domain variable names in English when there is a clear Portuguese
  equivalent.
- Comments that teach a syntax different from the one actually executed.
- Labels, titles or messages in English in the challenge experience when
  there is a Portuguese equivalent.

# Design Patterns

## Challenge algorithms

- The solution must be a Delégua function with explicit parameters and a
  deterministic return.
- The first alternative evaluated must be the simplest solution that meets
  the statement and the known constraints.
- The function must avoid unnecessary side effects.
- Invalid input cases must be handled according to the statement before the
  main algorithm.
- When the solution can return early, `retorna` must be used to make
  the case found clear.
- An optimization must not be introduced just to make the solution more
  sophisticated or to reduce a few operations with no relevant impact.

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

## Two pointers

For algorithms with two indices, use Portuguese names that explain the
role of each pointer and update them inside an `enquanto` loop:

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

## Native functions and methods

- Prefer native functions and methods documented by the language.
- For lists, use methods such as `tamanho()`, `adicionar()`, `fatiar()`,
  `filtrarPor()` and `mapear()` when they make the intent clearer.
- For conversions, prefer `inteiro()`, `real()`, `numero()` and `texto()`.
- Do not invent a native function in an example without validating that it exists in
  the interpreter version used by the project.

# Applied Usage Patterns

## Minimal example

```delegua
funcao saudar(nome) {
  retorna "Olá, ${nome}!"
}

escreva(saudar("explorador"))
```

## Conditionals

Use `se`, `senao se` and `senao`. Conditions must produce logical values or
use an expression whose logical value is intentional:

```delegua
se pontuacao >= 100 {
  escreva("nível avançado")
} senao se pontuacao >= 50 {
  escreva("nível intermediário")
} senao {
  escreva("nível inicial")
}
```

## Loops

- Use `enquanto` when the continuation depends on a condition.
- Use `para` when there is initialization, condition and step controlled by an
  index.
- Ensure that the state used in the condition is changed to avoid infinite
  loops.

## Boolean output

All documentation, fixtures, official solutions and expected results must use
`verdadeiro` and `falso` when representing Delégua logical values. The
presentation layer must also translate logical values to PT-BR before showing them
to the user.

## Comments

Comments must explain the intent of the algorithm, not translate the syntax
line by line. They must be written in Portuguese and must not present a
foreign keyword as if it were valid code.

# Integration Rules with Other Layers

- The UI must send and display the code as Delégua text without rewriting its
  tokens.
- The server must execute Delégua code through the `LspProvider` contract
  and the `DeleguaProvedorLsp`, not through `eval`, `new Function` or direct
  JavaScript execution.
- Syntactic and semantic analysis must be delegated to the `packages/lsp` package.
- The `core` package must carry code, input and output through DTOs without
  introducing syntax from another language into the Delégua content.
- Code playback must keep the real tokens of the executed program;
  interface labels can be localized without changing the code.
- Output values must be normalized for PT-BR presentation,
  especially booleans (`verdadeiro`/`falso`) and null (`nulo`).
- TypeScript code that contains a Delégua template string must have tests that
  validate the executable content, not just the existence of the string.

# Quick Checklist for New Features in the Delegua Layer

- [ ] All executable code uses reserved words in Portuguese.
- [ ] The chosen solution is the simplest correct approach for the challenge's
      goal.
- [ ] Booleans are written as `verdadeiro` or `falso`.
- [ ] The empty value is written as `nulo`.
- [ ] Domain functions, variables, parameters and comments are in
      Portuguese.
- [ ] `leia()` had its return converted when necessary.
- [ ] Native functions and methods used exist in the project's interpreter
      version.
- [ ] Execution is done by the Delégua LSP/interpreter, without JavaScript
      simulation.
- [ ] Inputs, outputs and expected results were tested.
- [ ] Code strings in TypeScript were validated as Delégua programs.
- [ ] No text displayed to the user presents `true`, `false`, `null` or
      reserved words in English as the result of Delégua code.
- [ ] The challenge's titles, explanations, labels, inputs, outputs and messages
      are in Portuguese.
- [ ] Any additional complexity has a justification in the statement, in the
      constraints or in the solution's explanation.

# Notes and Open Items

- These rules adopt as a reference the [official Delégua
  wiki](https://github.com/DesignLiquido/delegua/wiki), especially the
  pages on [introduction](https://github.com/DesignLiquido/delegua/wiki/Inicial),
  [data structures](https://github.com/DesignLiquido/delegua/wiki/Estruturas-de-dados-elementares),
  [input and output](https://github.com/DesignLiquido/delegua/wiki/Entrada-e-Sa%C3%ADda),
  [operators](https://github.com/DesignLiquido/delegua/wiki/Operadores),
  [conditionals](https://github.com/DesignLiquido/delegua/wiki/Condicionais),
  [loops](https://github.com/DesignLiquido/delegua/wiki/La%C3%A7os-de-repeti%C3%A7%C3%A3o),
  [functions](https://github.com/DesignLiquido/delegua/wiki/Fun%C3%A7%C3%B5es) and
  [native functions](https://github.com/DesignLiquido/delegua/wiki/Fun%C3%A7%C3%B5es-nativas).
- The wiki has version-specific features. Before using a new function,
  method or feature in an official solution, support must be confirmed in the
  interpreter installed in the monorepo.
- The convention of Portuguese identifiers is a project rule for
  Delégua code; technical names in TypeScript remain subject to the monorepo's
  general conventions rules.
