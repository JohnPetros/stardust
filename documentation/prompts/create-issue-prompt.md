---
description: Criar uma issue do GitHub para o projeto baseado em um PRD ou contexto técnico
---

## Objetivo

Ler um PRD do projeto ou um contexto técnico e propor uma issue do GitHub clara, acionável e alinhada ao contexto, arquitetura e regras da codebase. A issue é **sempre mostrada ao usuário para validação antes de ser criada**.

## Entrada

- Tipo da issue: `task` ou `bug`.
- Link do PRD do projeto, quando houver.
- Link da issue existente no GitHub, quando houver.

### Regras da entrada

- Quando o input indicar `tipo = task`, a issue deve ser orientada pelos PRDs publicados.
- Quando o input indicar `tipo = bug`, a issue pode não ter PRD associado.
- Para issues do tipo `bug`, a seção `Requisitos de Produto` pode ser omitida completamente quando não houver PRD relevante.

## Instruções

1. Identifique o tipo da issue informado no input: `task` ou `bug`.
2. Quando o tipo for `task`, obtenha o PRD informado.
3. Quando o tipo for `task`, antes de propor qualquer issue, carregue os PRDs publicados relacionados ao escopo.
4. Quando o tipo for `task`, liste explicitamente os links dos PRDs carregados e use esses links como referência principal do trabalho.
5. Quando o tipo for `task`, leia o PRD e identifique funcionalidades, restrições, regras de negócio, dependências e riscos.
6. Quando o tipo for `bug`, use como base o contexto técnico fornecido, o link da issue original quando houver, a codebase e a documentação do projeto.
7. Considere o contexto da codebase desse projeto, sua arquitetura e os padrões documentados.
8. Sugira as issues necessárias para implementar o escopo descrito.
9. Quando a funcionalidade couber em uma única entrega coerente, proponha uma única issue.
10. Quando o escopo for grande, com dependências ou etapas bem separadas, quebre em múltiplas issues menores.
11. **Apresente o rascunho completo ao usuário antes de criar qualquer issue. Aguarde aprovação explícita.**
12. Após aprovação, crie as issues usando `gh` conforme as regras abaixo.

## Critérios para quebrar issues

- Separar backend, mobile, web ou infraestrutura quando houver dependências independentes.
- Separar integrações externas, migrações, contratos de API e ajustes de UX quando fizer sentido.
- Evitar issues grandes demais ou vagas.
- Garantir que cada issue tenha escopo verificável.

## Formato de saída (rascunho para validação)

Para cada issue, apresente um bloco seguindo exatamente esta estrutura:

---

### Título
<!-- Título curto e objetivo. NUNCA usar prefixos como feat:, feat(...):, fix:, chore:, etc. -->

**Tipo:** `task` | `bug`
**Labels:** <!-- ex: enhancement, bug, documentation -->
**Milestone:** <!-- nome da milestone do projeto, quando aplicável -->

## Objetivo

<!-- Descreva o que será implementado, o resultado esperado e o contexto funcional. -->

Camadas impactadas: `core` · `rest` · `routers` · `validation` · `pipes` · `ui` etc.
<!-- Ajuste a lista conforme o escopo real da issue. -->

## Requisitos de Produto

PRD: <!-- nome ou link do RF/RNF/PRD -->

- Requisito funcional 1
- Requisito funcional 2
- Requisito funcional 3

<!-- Esta seção é obrigatória apenas para issues do tipo `task`. Para issues `bug`, omita completamente esta seção quando não houver PRD associado. -->

## Requisitos Técnicos

Camadas impactadas: <!-- repetir apenas as camadas reais -->

Fluxo - <!-- nome do endpoint, caso de uso ou fluxo -->:

```text
<!-- Descrever o fluxo técnico passo a passo -->
```

Contratos esperados:

- `UseCase.execute(...) -> ReturnType` - <!-- responsabilidade -->
- `Repository.method(...) -> ReturnType` - <!-- responsabilidade -->

## Referências na Codebase

- `path/to/file` - <!-- motivo da referência -->
- `path/to/other_file` - <!-- motivo da referência -->

---

## Criação via `gh` (somente após aprovação do usuário)

**Nunca criar a issue sem aprovação explícita do usuário.**

Após aprovação, usar os comandos abaixo conforme o tipo:

### Issues do tipo `task`

Issues do tipo `task` devem ser vinculadas ao project:
**https://github.com/users/JohnPetros/projects/2**

```bash
# 1. Criar a issue e capturar a URL retornada
ISSUE_URL=$(gh issue create \
  --repo JohnPetros/stardust \
  --title "<título da issue>" \
  --body "<corpo em markdown>" \
  --label "enhancement" \
  --milestone "<nome da milestone>")

# 2. Extrair o número da issue da URL
ISSUE_NUMBER=$(echo "$ISSUE_URL" | grep -oE '[0-9]+$')

# 3. Obter o node ID da issue (necessário para adicionar ao project)
ISSUE_NODE_ID=$(gh api graphql -f query='
  query($owner:String!, $repo:String!, $number:Int!) {
    repository(owner:$owner, name:$repo) {
      issue(number:$number) { id }
    }
  }' \
  -f owner="JohnPetros" \
  -f repo="stardust" \
  -F number=$ISSUE_NUMBER \
  --jq '.data.repository.issue.id')

# 4. Obter o ID do project
PROJECT_ID=$(gh api graphql -f query='
  query($login:String!, $number:Int!) {
    user(login:$login) {
      projectV2(number:$number) { id }
    }
  }' \
  -f login="JohnPetros" \
  -F number=2 \
  --jq '.data.user.projectV2.id')

# 5. Adicionar a issue ao project
gh api graphql -f query='
  mutation($project:ID!, $contentId:ID!) {
    addProjectV2ItemById(input:{projectId:$project, contentId:$contentId}) {
      item { id }
    }
  }' \
  -f project="$PROJECT_ID" \
  -f contentId="$ISSUE_NODE_ID"
```

### Issues do tipo `bug`

```bash
gh issue create \
  --repo JohnPetros/stardust \
  --title "<título da issue>" \
  --body "<corpo em markdown>" \
  --label "bug" \
  --milestone "<nome da milestone, se aplicável>"
```

### Labels disponíveis (usar conforme contexto)

**Tipo de trabalho** (sempre incluir ao menos uma):

| Label | Quando usar |
|---|---|
| `enhancement` | Nova funcionalidade (task) |
| `bug` | Correção de comportamento incorreto |
| `documentation` | Atualização de docs |
| `refactor` | Melhoria sem mudança de comportamento |
| `infra` | Manutenção, configuração e setup de infra |

**Aplicação impactada** (incluir todas as que se aplicam):

| Label | Quando usar |
|---|---|
| `web` | Impacta a aplicação web (`apps/web/`) |
| `server` | Impacta a API REST (`apps/server/`) |
| `studio` | Impacta a aplicação administrativa (`apps/studio/`) |

## Regras para preenchimento

- O conteúdo deve sair pronto para colar no GitHub Issues.
- O título da issue NUNCA deve conter prefixos de commit (ex: `feat:`, `feat(...):`, `fix:`, `chore:`, `refactor:`). O título deve ser direto e descritivo.
- Sempre incluir as labels de aplicação (`web`, `server`, `studio`) correspondentes às camadas impactadas pela issue, além das labels de tipo de trabalho.
- Issues do tipo `task` devem sempre ser vinculadas ao project **https://github.com/users/JohnPetros/projects/2** via GraphQL após a criação.
- Antes de criar qualquer issue do tipo `task`, perguntar ao usuário o nível de prioridade (`HIGH`, `MEDIUM` ou `LOW`) caso não tenha sido informado. Após criação e vínculo ao project, definir a prioridade via GraphQL.
- Não resuma em excesso; detalhe o suficiente para orientar implementação.
- Para issues do tipo `task`, sempre carregue e considere primeiro os PRDs antes de redigir.
- Para issues do tipo `task`, sempre inclua os links reais dos PRDs usados como referência.
- Para issues do tipo `bug`, não invente PRD nem mantenha a seção `Requisitos de Produto` por padrão; omita essa seção quando não houver documento funcional associado.
- Em issues técnicas, inclua fluxos, contratos esperados e referências reais da codebase sempre que possível.
- Quando houver endpoints, descreva cada fluxo separadamente.
- Quando houver lacunas arquiteturais, explicite o que ainda não existe e precisa ser criado.
- Ajuste as camadas impactadas conforme a issue; não mantenha exemplos genéricos.
- A seção `Observações / Dependências` é sempre fixa e deve ser reproduzida exatamente como definida neste prompt.
- Vincule cada issue à milestone fornecida quando aplicável.
- **Issues do tipo `task` devem sempre ser adicionadas ao project https://github.com/users/JohnPetros/projects/2 via GraphQL após criação.**

## Regras para preenchimento

- O conteúdo deve sair pronto para colar no GitHub Issues.
- O título da issue NUNCA deve conter prefixos de commit (ex: `feat:`, `feat(...):`, `fix:`, `chore:`, `refactor:`). O título deve ser direto e descritivo.
- Sempre incluir as labels de aplicação (`web`, `server`, `studio`) correspondentes às camadas impactadas pela issue, além das labels de tipo de trabalho.
- Issues do tipo `task` devem sempre ser vinculadas ao project **https://github.com/users/JohnPetros/projects/2** via GraphQL após a criação.
- Antes de criar qualquer issue do tipo `task`, perguntar ao usuário o nível de prioridade (`HIGH`, `MEDIUM` ou `LOW`) caso não tenha sido informado. Após criação e vínculo ao project, definir a prioridade via GraphQL.
- Não resuma em excesso; detalhe o suficiente para orientar implementação.
- Para issues do tipo `task`, sempre carregue e considere primeiro os PRDs antes de redigir.
- Para issues do tipo `task`, sempre inclua os links reais dos PRDs usados como referência.
- Para issues do tipo `bug`, não invente PRD nem mantenha a seção `Requisitos de Produto` por padrão; omita essa seção quando não houver documento funcional associado.
- Em issues técnicas, inclua fluxos, contratos esperados e referências reais da codebase sempre que possível.
- Quando houver endpoints, descreva cada fluxo separadamente.
- Quando houver lacunas arquiteturais, explicite o que ainda não existe e precisa ser criado.
- Ajuste as camadas impactadas conforme a issue; não mantenha exemplos genéricos.
- A seção `Observações / Dependências` é sempre fixa e deve ser reproduzida exatamente como definida neste prompt.
- Vincule cada issue à milestone fornecida quando aplicável.
- **Issues do tipo `task` devem sempre ser adicionadas ao project https://github.com/users/JohnPetros/projects/2 via GraphQL após criação.**
