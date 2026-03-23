---
description: Atualizar um documento de regras de uma camada existente, corrigindo estrutura, escaneabilidade, paths e consistencia com a arquitetura vigente.
---

# Prompt: Atualizar Regras de Camada

**Objetivo:** Atualizar o documento `{ARQUIVO_ALVO}` (regras da camada `{CAMADA}`) preservando o conteudo valido existente, corrigindo problemas estruturais, validando referencias a paths e alinhando o documento com a arquitetura e convencoes vigentes do projeto. O resultado deve ser o Markdown final pronto para substituir o arquivo diretamente.

**Entrada:**

- **Obrigatorias:**
  - Nome da camada `{CAMADA}` (ex: UI, REST, RPC, Queue, Core, Database).
  - Caminho do arquivo a ser atualizado `{ARQUIVO_ALVO}` (ex: `documentation/rules/rest-layer-rules.md`).
  - Objetivo da atualizacao `{OBJETIVO_DA_ATUALIZACAO}`: o que precisa mudar e por que (2-6 bullets).
- **Opcionais:**
  - Restricoes especificas `{RESTRICOES}` (ex: "nao alterar a secao de checklist", "manter exemplos de codigo existentes").
  - Fontes adicionais `{FONTES}` (arquivos, links, docs internas com informacao nova a incorporar).

- **Formato esperado para `{OBJETIVO_DA_ATUALIZACAO}`:**

```md
- Corrigir hierarquia de cabecalhos (H1 unico, H2/H3 sem pular niveis)
- Transformar blocos longos em tabelas e listas
- Validar e corrigir paths citados
- Incorporar novas convencoes de nomeacao definidas em {FONTES}
```

**Diretrizes de Execucao:**

1. **Entendimento e validacao de entradas**
   - Confirmar que `{ARQUIVO_ALVO}` existe e e um arquivo Markdown.
   - Ler o conteudo atual na integra e identificar:
     - Lacunas em relacao ao template padrao de regras de camada.
     - Repeticoes, inconsistencias de termos e problemas de hierarquia (H1/H2/H3).
     - Todos os paths e links referenciados no documento (extrair como lista).
   - Confirmar o escopo de `{OBJETIVO_DA_ATUALIZACAO}`: o que deve mudar, o que deve ser preservado.

2. **Levantamento de contexto (antes de reescrever)**
   - Consultar docs base do projeto para garantir alinhamento:
     - `documentation/overview.md`
     - `documentation/architecture.md`
     - `documentation/rules/rules.md`
   - Se houver ferramenta de busca no repositorio (MCP Serena), validar os paths listados na etapa anterior e localizar 2-5 exemplos reais da camada para referenciar.
   - Se houver duvida de biblioteca/framework, consultar documentacao oficial com ferramenta de docs (MCP Context7).
   - Sem ferramentas, solicitar ao usuario: conteudo de `{ARQUIVO_ALVO}`, docs base relevantes e os 2-5 exemplos minimos necessarios.

3. **Atualizacao do documento (reescrita final)**
   - Reescrever preservando conteudo valido e aplicando as correcoes de `{OBJETIVO_DA_ATUALIZACAO}`.
   - Manter tom profissional, direto e tecnico.
   - Corpo do texto em Portugues (Brasil); termos tecnicos em Ingles como `code` (ex: `provider`, `repository`, `service`, `DTO`, `handler`, `runtime`).
   - Melhorar escaneabilidade:
     - Preferir listas e tabelas para responsabilidades, limites e regras.
     - Usar callouts `>` para notas e avisos (ex: `> ⚠️` para proibicoes criticas).
   - Manter consistencia com a arquitetura em camadas:
     - Explicitar direcao de dependencia, contratos e limites.
     - Garantir que o checklist "antes do PR" esteja presente e atualizado.
   - Se `{ARQUIVO_ALVO}` nao seguir o template padrao de secoes, reestruturar para conformidade (ver template abaixo).

4. **Checagens finais de qualidade**
   - Validar antes de entregar:
     - H1 unico no documento; H2/H3 sem pular niveis.
     - Todos os paths citados existem no projeto — nao inventar.
     - Links externos com sintaxe correta: `[Texto](URL)`.
     - Blocos de codigo com linguagem declarada (ex: ` ```ts `, ` ```tsx `, ` ```bash `).
     - Nenhuma secao obrigatoria omitida.
   - Se informacao critica estiver ausente:
     - **Nao inventar.** Registrar em `## Pendencias` o que nao foi possivel validar.

**Template de Saida (Estrutura Obrigatoria):**

O documento atualizado deve seguir exatamente esta estrutura de secoes:

```markdown
# Regras da Camada {CAMADA}

## Visao Geral
- Objetivo da camada
- Responsabilidades principais
- Nao faz (escopo negativo)

## Estrutura de Diretorios
<!-- Se a camada nao possuir diretorio proprio bem definido, simplifique
     para uma nota curta indicando onde seus artefatos residem. -->
- Tabela com caminhos e finalidades

## Principios Fundamentais

### Deve conter
- Elementos obrigatorios da camada
- Praticas recomendadas

### Nao deve conter
- Antipadroes e acoplamentos proibidos
- Responsabilidades que pertencem a outras camadas

## Padroes de Projeto
- Padroes arquiteturais aceitos
- Como aplicar cada padrao na camada
- Quando evitar cada padrao

## Padroes de Uso Aplicados
- Fluxos comuns da camada
- Exemplos de uso correto
- Erros comuns e como evitar

## Regras de Integracao com Outras Camadas
- Dependencias permitidas e proibidas
- Contratos/interface de comunicacao
- Direcao de dependencia e limites de acoplamento

## Checklist Rapido para Novas Features na Camada
- Itens objetivos de validacao antes de abrir PR
- Criterios minimos de conformidade arquitetural
- Sinais de alerta para revisao tecnica

## Notas
- Premissas adotadas
- Referencias internas relevantes

## Pendencias
<!-- Incluir apenas se houver informacao faltante ou nao validada.
     Remover a secao se nao houver pendencias. -->
- Informacoes ausentes
- Proximos passos para refinamento
```

**Regras:**

- Usar Markdown como formato de saida.
- Nao pular niveis de cabecalho (H1 -> H2 -> H3).
- Nao omitir secoes obrigatorias do template.
- Nao inventar paths, nomes de arquivos, contratos ou componentes inexistentes.
- Preservar conteudo valido do documento original — atualizar nao e reescrever do zero sem criterio.
- Manter linguagem normativa: usar "deve", "nao deve", "pode" com criterio.
- Termos tecnicos permanecem em Ingles como `code`.
- Se houver conflito entre `{RESTRICOES}` e o padrao do template, priorizar `{RESTRICOES}` e registrar o impacto em `## Notas`.
- Entregar o conteudo Markdown completo e final, pronto para substituir `{ARQUIVO_ALVO}` diretamente.

**Saida esperada:**

Alem do documento Markdown final, incluir ao final um bloco de validacao resumido:

```md
## Checklist de Validacao da Atualizacao

- [ ] H1 unico; H2/H3 sem pular niveis
- [ ] Todas as secoes obrigatorias presentes
- [ ] Paths citados validados (existem no repo)
- [ ] Termos tecnicos em `code`
- [ ] Links externos com sintaxe correta (quando existirem)
- [ ] Blocos de codigo com linguagem declarada
- [ ] Conteudo valido do original preservado
- [ ] Pendencias registradas (se houver)
```

> 💡 Para criar um documento de regras do zero, use o prompt `documentation/prompts/create-layer-rules-prompt.md`.