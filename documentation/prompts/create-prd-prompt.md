---
description: Prompt para pesquisar, entrevistar e criar PRDs completos com análise competitiva, público-alvo e validação interativa.
---

# Prompt: Criar PRD

## Objetivo Principal

Criar um PRD completo e implementável a partir do texto recebido pelo comando:

```bash
create-prd "<texto do produto ou funcionalidade>"
```

O rascunho local do PRD deve ser salvo em:

```text
documentation/prds/<slug-do-produto>.md
```

O PRD canônico de produto é mantido no repositório, em
`documentation/prds/<module>/<slug>.md`. Esse arquivo é a fonte versionada de
verdade; não há dependência de Confluence. Requisitos devem usar `RP-*` e
jornadas devem usar `JN-*`.

Se for informado um caminho de saída, use-o:

```bash
create-prd "<texto>" --output documentation/prds/meu-prd.md
```

---

## Regra Principal

Não escreva o PRD imediatamente.

Primeiro:

1. Pesquise os materiais disponíveis.
2. Analise arquivos, código, designs e documentos relacionados.
3. Faça uma entrevista rigorosa com o usuário.
4. Resolva dependências e contradições.
5. Apresente um resumo do entendimento.
6. Aguarde confirmação explícita.

Só depois da confirmação o arquivo poderá ser criado ou atualizado.

---

## Gate obrigatório de Grilling

Execute obrigatoriamente o **Grilling gate** definido em [`sdd.md#grilling-gate`](../sdd.md#grilling-gate) antes de
escrever ou atualizar o PRD. Modele os itens da Árvore de Decisão como uma design tree, pesquise
os fatos e pergunte em cada round toda a frontier cujos pré-requisitos já estiverem resolvidos.
Cada pergunta deve incluir a resposta recomendada no formato canônico do protocolo.

Não misture no mesmo round perguntas que dependam umas das outras. Recompute a frontier após cada
resposta, conteste contradições ou riscos e não execute a criação do PRD até a frontier ficar
vazia e o usuário confirmar o entendimento compartilhado.

---

## Entrada do Comando

O texto recebido após `create-prd` representa o contexto inicial do produto ou
funcionalidade.

Extraia dele:

- problema;
- oportunidade;
- módulo;
- público mencionado;
- funcionalidades;
- restrições;
- materiais referenciados;
- decisões já tomadas.

Se o texto estiver vazio ou insuficiente, faça uma pergunta inicial solicitando
contexto.

---

## Pesquisa do Ambiente

Antes da entrevista:

1. Leia os PRDs relacionados.
2. Leia documentação e regras do projeto.
3. Inspecione código relevante.
4. Inspecione designs e protótipos.
5. Identifique entidades, fluxos e regras existentes.
6. Procure contradições entre documentação, design e implementação.
7. Diferencie fatos encontrados, decisões confirmadas, hipóteses e decisões
   pendentes.

Não pergunte ao usuário algo que possa ser descoberto no ambiente.

---

## Pesquisa Competitiva Condicional

Faça pesquisa atualizada na internet sobre o cenário competitivo somente quando
ela for relevante para uma decisão de produto, posicionamento ou diferenciação.
Ela não é uma seção obrigatória do PRD.

Analise:

- concorrentes diretos;
- concorrentes indiretos;
- alternativas manuais;
- público atendido;
- proposta de valor;
- funcionalidades relevantes;
- preços públicos, quando disponíveis;
- pontos fortes;
- limitações;
- lacunas de mercado;
- oportunidades de diferenciação.

Use prioritariamente fontes oficiais e primárias.

Não invente informações. Toda informação factual sobre concorrentes deve conter
fonte em Markdown.

Diferencie fatos de inferências usando expressões como:

- `Segundo a fonte...`
- `Inferência baseada nas fontes...`
- `Não identificado publicamente...`

A pesquisa deve orientar recomendações, mas não substituir decisões do usuário.
Quando não for material, registre essa não aplicabilidade em `Problema e
Oportunidade` ou nas premissas, sem criar uma seção competitiva vazia.

---

## Árvore de Decisão

Investigue em rounds, respeitando as dependências entre estas decisões:

1. Problema e oportunidade.
2. Objetivo do produto.
3. Público-alvo principal.
4. Públicos secundários.
5. Não público.
6. Jobs to Be Done.
7. Proposta de valor.
8. Diferenciação competitiva, quando material.
9. Escopo da primeira versão.
10. Funcionalidades obrigatórias.
11. Regras de negócio.
12. Entidades e relacionamentos.
13. Fluxos principais.
14. Estados vazios e erros.
15. Permissões e responsabilidades.
16. Integrações e dependências.
17. Dados e snapshots.
18. Exclusões e efeitos colaterais.
19. Critérios de sucesso.
20. Requisitos de UI/UX.
21. Responsividade e acessibilidade.
22. Requisitos não funcionais.
23. Fora do escopo.
24. Decisões descartadas.

Não faça perguntas sobre itens já resolvidos nos materiais ou pelo usuário.

---

## Formato das Perguntas

Use o formato obrigatório de rounds do **Grilling gate** em [`sdd.md#grilling-gate`](../sdd.md#grilling-gate). Numere
toda a frontier atual e inclua uma recomendação objetiva e justificada para cada pergunta.

---

## Confirmação Obrigatória

Quando todas as decisões relevantes estiverem resolvidas, apresente um resumo
com:

- problema;
- objetivo;
- público-alvo;
- proposta de valor;
- cenário competitivo, quando pesquisado;
- diferenciais, quando aplicável;
- escopo;
- regras críticas;
- fluxos principais;
- fora do escopo;
- riscos e hipóteses restantes.

Depois faça somente esta pergunta:

```text
Este entendimento está correto e posso escrever o PRD?
```

Não escreva o arquivo até receber confirmação explícita.

---

## Formato Obrigatório do PRD

Após a confirmação, escreva o documento exatamente nesta estrutura, sem trocar a
ordem ou os nomes das seções:

```md
---
title: <título>
status: draft
source:
  - type: <confluence|issue|direct-request>
    ref: <URL ou referência>
last_updated_at: YYYY-MM-DD
---

# PRD — <Nome do Produto ou Área>

Disponibiliza para: <áreas consumidoras e identidade/contrato fornecido>

Navegação: <links ou âncoras das seções principais>
```

### 1. Resumo Executivo

Inclua o que é o produto/área, o problema, o objetivo, o valor entregue, o
estado da conta/ator quando aplicável e o que o MVP explicitamente não inclui.

### 2. Problema e Oportunidade

Descreva o problema, a oportunidade e as razões para a capacidade existir.
Inclua a subseção obrigatória:

#### Base de fontes e autoridade

| ID | Material | Papel neste PRD |
| --- | --- | --- |
| S1 | <fonte> | <autoridade/contexto> |

Use o PRD canônico versionado em `documentation/prds/` e registre sua revisão.
Milestones, issues, entrevistas e código são fontes auxiliares, nunca
substitutos silenciosos da autoridade local.

### 3. Público-alvo

Inclua público principal, públicos secundários, não público, contexto de uso e
Jobs to Be Done.

Use o formato `Quando [contexto], quero [ação], para [resultado].`

### 4. Objetivos e Métricas de Sucesso

Use a tabela:

| Objetivo do produto | Métrica aprovada | Significado da medição |
| --- | --- | --- |
| <objetivo> | <métrica ou nenhuma meta aprovada> | <interpretação> |

#### Limites de validação e premissas declaradas

| Risco ou premissa | Consequência para validação |
| --- | --- |
| <risco/premissa> | <consequência> |

### 5. Requisitos de Produto

#### Conceitos e responsabilidades

| Conceito | Regra de produto |
| --- | --- |
| <conceito> | <responsabilidade> |

Cada requisito deve seguir este formato:

#### RP-01 — <Nome do Requisito>

Necessidades do usuário:

- Como <ator>, quero <ação>, para <resultado>.

Resultado: <resultado observável do requisito>.

Atores: <atores>.

##### Regras de Negócio

- <regra obrigatória, validação, exceção ou dependência>.

##### Regras de Experiência

- <estado, feedback, acessibilidade, responsividade ou comportamento de interface>.

Use requisitos de produto sequenciais: `RP-01`, `RP-02`, `RP-03`. Não use
`RF-*` ou `CA-*` no PRD; esses IDs pertencem à Spec local.

### 6. Grafo de Dependências do Produto

Registre produtores, consumidores e responsabilidades entre áreas. Não
transforme o grafo de produto em ordem de implementação.

### 7. Jornadas

Descreva cada jornada com um identificador `JN-*`, seus atores e passos de
sucesso, erro, recuperação e estados vazios quando aplicáveis:

```text
JN-01 — Nome da jornada

1. O usuário inicia a ação.
2. O sistema apresenta o estado.
3. O usuário toma uma decisão.
4. O sistema valida:
   - Sucesso: comportamento esperado.
   - Falha: mensagem e estado preservado.
5. O fluxo termina.
```

Inclua fluxos principais, alternativos, erros, estados vazios e confirmações
destrutivas.

### 8. Fora do Escopo

Use uma tabela:

| Área | Exclusão explícita do MVP |
| --- | --- |
| <área> | <o que não será entregue> |

#### Decisões descartadas durante a definição

Registre alternativas consideradas e a regra final escolhida:

| Alternativa considerada | Regra final |
| --- | --- |
| <alternativa> | <decisão adotada> |

Se nada tiver sido descartado, escreva:

- **Não identificado:** nenhuma alternativa foi formalmente descartada durante a definição.

---

## Regras de Qualidade

O PRD deve:

- ser escrito em português claro;
- usar linguagem normativa;
- manter requisitos testáveis;
- separar regras de negócio de UI/UX;
- preservar decisões confirmadas;
- apontar dependências;
- evitar duplicidade;
- manter nomenclatura consistente;
- não inventar fatos;
- incluir fontes nas afirmações de mercado;
- diferenciar fatos de inferências;
- registrar decisões descartadas;
- não incluir funcionalidades fora do escopo.

Antes de salvar, valide:

- todos os `RP-*` possuem necessidades do usuário, resultado, atores, regras de negócio e regras de experiência;
- todas as `JN-*` estão cobertas pelos requisitos aplicáveis;
- o grafo de dependências identifica produtores, consumidores e responsabilidades;
- objetivos, métricas, limites de validação e premissas estão explícitos;
- o público-alvo está refletido no produto;
- quando houver análise competitiva, ela influencia o posicionamento;
- não existem contradições;
- não há decisões relevantes pendentes.

Se houver uma decisão relevante pendente, volte ao Grilling, recompute a frontier e conduza os
rounds restantes. Não finalize o PRD até alcançar entendimento compartilhado.

---

## Execução do Arquivo

Depois de gerar o PRD:

1. Crie o diretório de saída se necessário.
2. Gere um slug legível para o nome do arquivo.
3. Salve em `documentation/prds/`.
4. Se o arquivo já existir, informe que será atualizado antes de sobrescrevê-lo.
5. Verifique se o arquivo foi criado.
6. Exiba o caminho final e um resumo do conteúdo gerado.

Formato final:

```text
[RESEARCH] Environment analyzed ✅
[RESEARCH] Competitive analysis completed ✅
[INTERVIEW] Shared understanding confirmed ✅
[PRD] Generated: documentation/prds/<arquivo>.md ✅
```

---

## Comportamentos Proibidos

- Criar o PRD antes da confirmação do usuário.
- Perguntar no mesmo round decisões que dependam umas das outras.
- Perguntar fatos que podem ser pesquisados.
- Inventar dados de concorrentes ou preços.
- Apresentar inferências como fatos.
- Ignorar contradições.
- Alterar decisões confirmadas sem avisar.
- Criar requisitos sem critérios verificáveis.
- Salvar o arquivo fora de `documentation/prds/` sem instrução explícita.
