---
description: Prompt para pesquisar, entrevistar e criar PRDs completos com análise competitiva, público-alvo e validação interativa.
---

# Prompt: Criar PRD

## Objetivo Principal

Criar um PRD completo e implementável a partir do texto recebido pelo comando:

```bash
create-prd "<texto do produto ou funcionalidade>"
```

O PRD deve ser salvo em:

```text
documentation/prds/<slug-do-produto>.md
```

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

## Skill Obrigatória: Grilling

Entreviste o usuário rigorosamente sobre todos os aspectos do produto até
alcançar entendimento compartilhado.

Para cada pergunta:

- faça somente uma pergunta por vez;
- explique por que a decisão é necessária;
- apresente uma recomendação;
- aguarde a resposta antes de continuar;
- registre a decisão;
- identifique dependências com decisões futuras;
- conteste contradições ou riscos.

Nunca faça várias perguntas na mesma mensagem.

Se uma informação puder ser encontrada em arquivos, código, designs, ferramentas
ou internet, pesquise antes de perguntar.

As decisões pertencem ao usuário. Não assuma decisões importantes sem
confirmação.

Não execute a criação do PRD até o usuário confirmar que o entendimento está
correto.

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

## Pesquisa de Mercado Obrigatória

Faça pesquisa atualizada na internet sobre o cenário competitivo.

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
- `A página oficial informa...`
- `Inferência baseada nas fontes...`
- `Não identificado publicamente...`

A pesquisa deve orientar recomendações, mas não substituir decisões do usuário.

---

## Árvore de Decisão

Investigue, uma decisão por vez:

1. Problema e oportunidade.
2. Objetivo do produto.
3. Público-alvo principal.
4. Públicos secundários.
5. Não público.
6. Jobs to Be Done.
7. Proposta de valor.
8. Diferenciação competitiva.
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

Use exatamente este formato:

```text
Pergunta [número] — [tema]

Contexto:
[Explique por que essa decisão é necessária.]

Minha recomendação:
[Apresente uma recomendação objetiva e justificada.]

Pergunta:
[Faça somente uma pergunta.]
```

---

## Confirmação Obrigatória

Quando todas as decisões relevantes estiverem resolvidas, apresente um resumo
com:

- problema;
- objetivo;
- público-alvo;
- proposta de valor;
- cenário competitivo;
- diferenciais;
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

Após a confirmação, escreva o documento nesta estrutura:

### 1. Visão Geral

Inclua descrição do produto, objetivo, problema resolvido e valor entregue.

### 2. Público-alvo

Inclua público principal, públicos secundários, não público, contexto de uso,
dores, necessidades e Jobs to Be Done.

Use o formato:

```text
Quando [contexto], quero [ação], para [resultado].
```

### 3. Análise do Cenário Competitivo

Inclua resumo do mercado, concorrentes diretos e indiretos, alternativas
manuais, matriz competitiva, oportunidades, diferenciais recomendados, fontes e
distinção entre fatos e inferências.

Use a tabela:

| Solução | Público | Proposta de valor | Funcionalidades | Preço público | Limitações |
|---|---|---|---|---|---|

Não preencha células com suposições. Use `Não identificado publicamente` quando
necessário.

### 4. Requisitos

Cada requisito deve seguir este formato:

#### REQ-01 Nome do Requisito

- [ ] **Nome do Requisito**

**Descrição:** descreva o comportamento esperado.

##### Regras de Negócio

- **Regra:** comportamento obrigatório.
- **Validação:** condição e resultado.
- **Exceção:** comportamento alternativo.
- **Dependência:** módulo ou entidade relacionada.

##### Regras de UI/UX

- **Interface:** apresentação da funcionalidade.
- **Feedback:** estados de sucesso, erro e carregamento.
- **Estado vazio:** comportamento sem dados.
- **Ação bloqueada:** motivo e correção.
- **Responsividade:** comportamento em telas menores.
- **Acessibilidade:** requisitos relevantes.

Use requisitos sequenciais: `REQ-01`, `REQ-02`, `REQ-03`.

Use `[ ]` por padrão. Use `[x]` somente quando a implementação tiver sido
verificada.

Separe os requisitos com `---`.

### 5. Fluxo de Usuário (User Flow)

Use fluxos identificados por letras:

```text
Fluxo A - Nome do fluxo

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

### 6. Fora do Escopo (Out of Scope)

Liste funcionalidades explicitamente excluídas da versão.

#### Descartado durante a definição

Registre decisões consideradas e rejeitadas:

- **Alternativa:** motivo da rejeição.
- **Regra anterior:** regra que a substituiu.

Se nada tiver sido descartado, escreva:

- **Não identificado:** nenhuma alternativa foi formalmente descartada durante a
  definição.

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

- todos os requisitos possuem descrição, regras de negócio e UI/UX;
- os fluxos cobrem os requisitos;
- o público-alvo está refletido no produto;
- a análise competitiva influencia o posicionamento;
- não existem contradições;
- não há decisões relevantes pendentes.

Se houver uma decisão relevante pendente, volte à entrevista e faça uma pergunta
por vez. Não finalize o PRD até alcançar entendimento compartilhado.

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
- Fazer múltiplas perguntas na mesma mensagem.
- Perguntar fatos que podem ser pesquisados.
- Inventar dados de concorrentes ou preços.
- Apresentar inferências como fatos.
- Ignorar contradições.
- Alterar decisões confirmadas sem avisar.
- Criar requisitos sem critérios verificáveis.
- Salvar o arquivo fora de `documentation/prds/` sem instrução explícita.
