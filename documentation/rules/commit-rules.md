# Regras de Commit

Este documento define as regras para criar commits no repositório. Ele substitui
o uso de prompts específicos de commit como fonte principal de decisão.

## Objetivo

Todo commit deve:

- representar uma responsabilidade semântica única
- facilitar leitura do histórico e revisão de mudanças
- deixar claro o tipo de alteração feita
- evitar commits ambíguos, genéricos ou misturados

## Pré-condições obrigatórias

Antes de criar qualquer commit, deve-se validar:

- não existem arquivos previamente em stage que não façam parte do commit atual
- existem alterações reais no worktree
- os arquivos do grupo a ser commitado foram analisados pelo diff, não apenas pelo caminho

Se já houver arquivos em stage sem relação direta com o commit pretendido, o
processo deve parar até que o stage seja limpo ou reorganizado.

## Regra de agrupamento

Commits devem ser agrupados por responsabilidade semântica, não por pasta.

### Deve

- agrupar arquivos que implementam a mesma mudança funcional
- separar mudanças independentes em commits diferentes
- separar correções, refactors, testes, docs e config quando forem responsabilidades distintas

### Não deve

- juntar bugfix com refactor não necessário
- juntar mudança de documentação com mudança de runtime sem relação clara
- juntar alterações de camadas diferentes apenas porque estão no mesmo PR

> ⚠️ Se um arquivo tocar mais de uma responsabilidade, a decisão deve ser feita
> pelo conteúdo do diff. O caminho do arquivo sozinho não é suficiente.

## Regra de análise

Antes de classificar um commit, deve-se analisar:

- o caminho do arquivo
- o conteúdo real do diff
- o impacto da alteração
- se a mudança é nova feature, correção, refactor, teste, docs ou config

Arquivos ambíguos devem ser classificados pela intenção predominante da mudança.

## Formato obrigatório da mensagem

Toda mensagem de commit deve seguir exatamente este formato:

```text
emoji prefix(scope opcional): concise description in English
```

Exemplos válidos:

```text
🐛 fix(server): align Inngest local discovery port
📚 docs: document server commit rules
🧪 test(web): cover notes drawer manual close flow
⚙️ config: restore default server port
```

## Regras da mensagem

### Deve

- escrever a descrição em inglês
- usar descrição curta, direta e específica
- usar verbo no imperativo ou descrição objetiva de ação
- usar apenas prefixos aprovados
- incluir `scope` quando isso aumentar clareza

### Não deve

- usar mensagens vagas como `update code`, `fix stuff`, `changes`
- usar português na descrição
- inventar prefixos fora da tabela aprovada
- descrever mais de uma mudança semântica na mesma mensagem

## Tabela de prefixos aprovados

| Tipo de alteração | Prefixo | Emoji |
| --- | --- | --- |
| Domínio | `domain` | `🌐` |
| REST | `rest` | `📶` |
| UI | `ui` | `🖥️` |
| Banco de dados | `db` | `💾` |
| Work in progress | `wip` | `🚧` |
| Inteligência artificial | `ai` | `🤖` |
| RPC | `rpc` | `📟` |
| Use case | `use case` | `✨` |
| Interfaces | `interface` | `📑` |
| Tipos | `type` | `🏷️` |
| Documentação | `docs` | `📚` |
| Correção | `fix` | `🐛` |
| Refactor | `refactor` | `♻️` |
| Testes | `test` | `🧪` |
| Configuração / infra | `config` | `⚙️` |
| Dependências | `deps` | `📦` |
| Estrutura de pastas | `ftree` | `🗃️` |
| Providers / provision | `provision` | `🧰` |
| Response | `response` | `📤` |
| Design | `design` | `🎨` |
| Certificados / licenças | `cert` | `📜` |
| Validation | `validation` | `📮` |
| Hotfix | `hotfix` | `🚑` |
| Continuous delivery | `cd` | `🚚` |
| Continuous integration | `ci` | `🏎️` |
| Release | `release` | `🔖` |
| Docker | `docker` | `🐳` |

## Quando usar `scope`

O `scope` é opcional, mas deve ser usado quando:

- a mudança afeta um workspace específico como `web`, `server`, `studio` ou `core`
- a mudança afeta um domínio claro como `auth`, `notes`, `space` ou `challenge`
- o prefixo sozinho não deixa claro onde a mudança aconteceu

Exemplos:

- `🐛 fix(server): restore default port`
- `📚 docs(rules): add commit message policy`
- `🧪 test(profile): cover user absence controller`

## Ordem recomendada de execução

Para cada commit:

1. analisar `git diff --stat`
2. analisar `git diff` dos arquivos candidatos
3. selecionar apenas o grupo semântico correto
4. adicionar somente os arquivos do grupo
5. criar o commit com mensagem no padrão
6. repetir até não restarem mudanças pendentes

## Critérios de qualidade

Antes de executar o commit, deve-se confirmar:

- a mensagem representa corretamente o diff
- não há arquivos de outra responsabilidade no mesmo stage
- o prefixo escolhido é consistente com a alteração
- o commit melhora, e não piora, a legibilidade do histórico

## Casos que exigem atenção extra

### Mudanças ambíguas

Se um arquivo puder ser classificado em mais de uma categoria:

- deve-se escolher a categoria com base no conteúdo do diff
- deve-se priorizar a responsabilidade principal entregue pelo arquivo

### Mudanças grandes

Se o worktree tiver alterações extensas:

- deve-se preferir dividir em múltiplos commits pequenos e coerentes
- não se deve usar um único commit "guarda-chuva"

### Worktree sujo

Se houver alterações não relacionadas:

- deve-se evitar commitá-las juntas
- deve-se isolar o escopo da mudança atual

## O que é proibido

- criar commit sem revisar o diff
- criar commit com stage previamente contaminado
- misturar responsabilidades independentes
- usar mensagem genérica
- usar prefixo fora da tabela
- fazer `amend` sem solicitação explícita

## Relação com outras regras

Ao preparar um commit, também deve-se respeitar:

- `documentation/rules/code-conventions-rules.md`
- `documentation/rules/rules.md`

Se a mudança envolver uma camada específica, as regras dessa camada também
devem ser consultadas antes de definir a mensagem final.
