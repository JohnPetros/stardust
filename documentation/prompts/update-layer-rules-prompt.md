---
description: Atualizar um documento de regras de uma camada com estrutura padronizada, escaneabilidade e validacao de referencias
---

# Prompt: Atualizar Documento de Regras de Camada

**Objetivo:**
- Atualizar o documento `{ARQUIVO_ALVO}` (regras da camada `{CAMADA_NOME}`) com estrutura clara, linguagem tecnica e alta escaneabilidade.
- Validar referencias a arquivos citados (paths) e corrigir links/paths invalidos.
- Entregar o Markdown final pronto para substituir o arquivo (o output e o **documento atualizado**).

**Entrada:**
  - `{CAMADA_NOME}`: nome da camada (ex: `REST`, `RPC`, `Queue`, `Database`, `Provision`, `UI`).
  - `{ARQUIVO_ALVO}`: caminho do arquivo Markdown a ser atualizado (ex: `documentation/rules/rest-layer-rules.md`).
  - `{OBJETIVO_DA_ATUALIZACAO}`: o que precisa mudar e por que (2-6 bullets).

Formato recomendado para `{OBJETIVO_DA_ATUALIZACAO}`:

```md
- Ajustar hierarquia de cabecalhos para H1->H2
- Transformar blocos longos em tabelas e listas
- Validar paths citados e corrigir links quebrados
```

## Diretrizes de Execucao

1. **Entendimento e validacao de entradas**
   - Confirmar que `{ARQUIVO_ALVO}` existe e e Markdown.
   - Ler o conteudo atual e identificar: lacunas, repeticoes, inconsistencias de termos e problemas de hierarquia (H1/H2/H3).
   - Extrair (por lista) todas as referencias a paths e links existentes no documento.

2. **Levantamento do que ja existe (antes de escrever)**
   - Consultar docs base do projeto:
     - `documentation/overview.md`
     - `documentation/architecture.md`
     - `documentation/rules/rules.md`
   - Buscar exemplos reais da camada:
     - Se o documento ja citar paths, validar que existem.
     - Se nao citar, localizar 2-5 exemplos representativos para referenciar.

3. **Atualizacao do documento alvo (reescrita final)**
   - Reescrever mantendo:
     - Tom profissional, direto e tecnico.
     - Corpo do texto em Portugues (Brasil).
     - Termos tecnicos em Ingles como `code` (ex: `provider`, `repository`, `service`, `runtime`, `composition root`, `DTO`, `request`).
   - Melhorar escaneabilidade:
     - Preferir listas e tabelas para responsabilidades/limites/regras.
     - Usar callouts com `>` para notas e avisos (ex: `> ⚠️` para proibicoes).
   - Manter consistencia com a arquitetura em camadas:
     - Explicitar **direcao de dependencia**, **contratos** e **limites**.
     - Incluir um checklist curto "antes do PR".

4. **Checagens finais (qualidade e consistencia)**
   - Validar:
     - Um unico H1, seguido por H2/H3 sem pular niveis.
     - Todos os paths citados existem no projeto (nao inventar).
     - Links externos (se houver) com sintaxe `[Texto](URL)`.
     - Blocos de codigo com linguagem (ex: ```ts, ```tsx, ```bash).
   - Se faltar informacao do repo:
     - **Nao inventar.** Registrar em uma secao "Pendencias" o que nao foi possivel validar.

## Uso de Ferramentas Auxiliares (opcional)

- **Busca no repositorio**: localizar e validar paths citados; encontrar exemplos reais.
- **Leitura de arquivos**: ler `{ARQUIVO_ALVO}` e referencias.
- **Docs externas**: quando houver duvida de lib/framework, consultar documentacao oficial antes de afirmar comportamentos.

> 💡 Modo sem ferramentas: solicitar ao usuario o conteudo de `{ARQUIVO_ALVO}` e as referencias minimas (2-5 arquivos) antes de reescrever.

## Template de Saida (Estrutura Obrigatoria do Documento Final)

Escreva o documento final com esta estrutura (nao omitir secoes):

- `# Regras da Camada {CAMADA_NOME}`
- `## Visao Geral`
  - Objetivo
  - Responsabilidades
  - Nao faz (escopo negativo)
- `## Estrutura de Diretorios`
  - Tabela com caminhos e finalidades
- `## Regras`
  - Lista objetiva do que fazer e do que evitar
  - Pelo menos 1 callout `> ⚠️` para proibicoes criticas
- `## Organizacao e Nomeacao`
  - Convencoes de nomes e exports (quando aplicavel)
- `## Integracao com Outras Camadas`
  - Dependencias permitidas/proibidas
  - Contratos (interfaces/tipos) relevantes
  - Direcao de dependencia
- `## Checklist (antes do PR)`
  - 5-10 itens verificaveis
- `## Notas`
  - Premissas e referencias internas
- `## Pendencias` (opcional)
  - Apenas se houver informacao faltante ou nao validada

## Saida Esperada

- Cole o conteudo final completo do `{ARQUIVO_ALVO}` (Markdown) para substituicao direta do arquivo.
- Ao final, inclua um checklist de validacao:
  - Hierarquia de cabecalhos OK (H1 unico; H2/H3 sem pular niveis)
  - Paths citados validados (existem no repo)
  - Termos tecnicos em `code`
  - Links externos com sintaxe correta (quando existirem)

## Regras

- Use Markdown.
- Nao pule niveis de cabecalho.
- Nao invente paths, nomes de arquivos, ou estruturas que nao existem.
- Mantenha termos tecnicos em Ingles como `code`.
- Nao inclua testes automatizados a menos que `{RESTRICOES}` permita explicitamente.
- Se houver conflito entre `{RESTRICOES}` e o padrao do repo, priorize `{RESTRICOES}` e registre o impacto em "Notas".
