---
description: Atualiza uma spec técnica durante a implementação, aplicando modo leve ou pesado conforme o tipo de mudança.
---

# Prompt: Atualizar Spec

**Objetivo:** Aplicar uma mudança durante a implementação, atualizando o código
e a spec de forma consistente com a arquitetura hexagonal, os apps/pacotes do
monorepo StarDust e as regras documentadas em `documentation/rules/`. O modo é
determinado automaticamente pelo tipo de mudança.

---

## Entrada

- **Caminho da spec** a ser atualizada.
- **Descrição da mudança:** o que precisa mudar e por quê.
- **Contexto do plano** (opcional) derivado desta spec.

> Antes de alterar qualquer coisa, leia:
> - `documentation/overview.md`
> - `documentation/architecture.md`
> - `documentation/rules/rules.md`

---

## Passo 1 — Classificar a mudança

| Categoria | Exemplos | Modo |
|---|---|---|
| **Correção factual** | Nome de classe, caminho, assinatura, typo | **Leve** |
| **Contrato** | DTO, schema HTTP, interface de port, retorno de método | **Pesado** |
| **Escopo** | Adiciona ou remove item do in-scope / out-of-scope | **Pesado** |
| **Regra de negócio** | Nova invariante, alteração de validação de domínio | **Pesado** |
| **Decisão de design** | Troca de abordagem técnica, estratégia de cache, tipo de evento | **Pesado** |

> Se misturar categorias, use o **modo mais restritivo**.
> Se a mudança não estiver clara, use a tool `question` antes de prosseguir.

---

## Modo Leve — Correção Factual

1. Aplique a correção no código.
2. Edite apenas o trecho incorreto na spec.
3. Atualize `last_updated_at` no frontmatter.
4. Confirme que não há outras ocorrências do mesmo dado errado na spec.
5. Se a correção citar paths, contratos ou nomes de símbolos, valide na codebase.

---

## Modo Pesado — Mudança Estrutural

**2.1 Diagnóstico**
- Mapeie todas as seções da spec afetadas em cascata.
- Mapeie todos os arquivos de código impactados pela mudança nos apps
  (`apps/web`, `apps/server`, `apps/studio`) e pacotes (`packages/core`,
  `packages/validation`, `packages/email`, `packages/lsp`) afetados.
- Se contradizer o PRD, use a tool `question` antes de prosseguir.
- Use **Serena** para confirmar consistência com a codebase e localizar
  implementações similares.

**2.2 Implementação**
- Aplique as mudanças no código nos arquivos mapeados no diagnóstico.
- Consulte as regras da camada correspondente em `documentation/rules/` antes de alterar.
- Preserve os limites arquiteturais: `core` continua agnóstico a framework;
  apps implementam adapters; UI consome contratos já definidos; validações
  compartilhadas ficam em `packages/validation` quando fizer sentido.

**2.3 Edição da spec**
- Edite **somente** as seções mapeadas no diagnóstico.
- Atualize `last_updated_at` mantendo o formato `YYYY-MM-DD`.
- Seções que deixarem de se aplicar: escreva **Não aplicável**.
- Mantenha caminhos reais relativos ao monorepo e marque arquivos novos como
  `**novo arquivo**`.

**2.4 Rules**

Se a mudança introduz ou altera um padrão de camada, atualize o doc de rules
correspondente em `documentation/rules/` (consulte o índice em `rules.md`):

- **Novo padrão:** adicione com descrição e exemplo prático.
- **Alteração de padrão:** corrija ou complemente — não apague o contexto anterior.

> Se não introduzir nem alterar padrão, pule este passo.

**2.5 Impacto no plano** *(quando plano existir)*

Produza um relatório com tarefas removidas, alteradas e novas. **Aguarde
confirmação** antes de editar o plano.

**2.6 Verificação**
- Spec consistente internamente.
- Spec consistente com PRD, arquitetura e codebase atual.
- **Pendências / Dúvidas** atualizado se a mudança gerou incertezas.

---

## Passo Final — Qualidade

Execute e corrija qualquer falha antes de encerrar:

```bash
npm run codecheck && npm run typecheck && npm run test
```

> Para mudanças localizadas, você pode validar primeiro no workspace afetado
> (ex: `npm run codecheck -w @stardust/web`), mas antes de encerrar a tarefa a
> verificação final deve refletir o impacto real da mudança.

> Falhas pré-existentes fora do escopo devem ser sinalizadas como regressões
> anteriores. Não encerre com falhas em aberto causadas pela mudança atual.

---

## Restrições

- Edições cirúrgicas — não reescreva a spec inteira.
- Não invente arquivos, métodos ou contratos sem evidência na codebase ou no PRD.
- `packages/core` não pode depender de `Next.js`, `React`, `Hono`, `Supabase`,
  `Inngest` ou qualquer SDK/framework de infraestrutura. Se a mudança violar
  isso, recuse e registre em **Pendências / Dúvidas**.
- Referências a código existente: caminho relativo real do monorepo
  (ex: `apps/server/src/...`, `apps/web/src/...`, `packages/core/src/...`);
  novos arquivos: `**novo arquivo**`.
- Não promova lógica de negócio para `apps/*` se ela pertencer ao domínio.
- Não descreva `class` instanciada com `new` como padrão quando o projeto usar
  Factory Functions para services, actions, controllers e módulos semelhantes.
- Não edite o plano sem confirmação explícita.
