---
description: Atualiza uma spec técnica durante a implementação, aplicando modo leve ou pesado conforme o tipo de mudança.
---

# Prompt: Atualizar Spec

**Objetivo:** Aplicar uma mudança durante a implementação — atualizando o
código **e** a spec de forma consistente. O modo é determinado automaticamente
pelo tipo de mudança.

---

## Entrada

- **Caminho da spec** a ser atualizada.
- **Descrição da mudança:** o que precisa mudar e por quê.
- **Caminho do plano** (opcional): `*-plan.md` derivado desta spec.

---

## Passo 1 — Classificar a mudança

| Categoria | Exemplos | Modo |
|---|---|---|
| **Correção factual** | Nome de classe, caminho, assinatura, typo | **Leve** |
| **Contrato** | DTO, schema HTTP, interface de port, retorno de método | **Pesado** |
| **Escopo** | Adiciona ou remove item do in-scope / out-of-scope | **Pesado** |
| **Regra de negócio** | Nova invariante, alteração de validação de domínio | **Pesado** |
| **Decisão de design** | Troca de abordagem técnica, estratégia de cache, tipo de evento | **Pesado** |

> Se misturar categorias, use o **modo mais restritivo**. Se a mudança não
> estiver clara, use `question` antes de prosseguir.

---

## Modo Leve — Correção Factual

1. Aplique a correção no código.
2. Edite apenas o trecho incorreto na spec.
3. Atualize `last_updated_at` no frontmatter.
4. Confirme que não há outras ocorrências do mesmo dado errado na spec.

---

## Modo Pesado — Mudança Estrutural

**2.1 Diagnóstico**
- Mapeie todas as seções da spec afetadas em cascata.
- Mapeie todos os arquivos de código impactados pela mudança.
- Se contradiz o PRD, use `question` antes de prosseguir.
- Use **Serena** para confirmar consistência com a codebase.

**2.2 Implementação**
- Aplique as mudanças no código nos arquivos mapeados no diagnóstico.
- Consulte as regras da camada correspondente em `documentation/rules/` antes de alterar.

**2.3 Edição da spec**
- Edite **somente** as seções mapeadas no diagnóstico.
- Atualize `last_updated_at`. Seções que deixarem de se aplicar: escreva **Não aplicável**.

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
- **Pendências / Dúvidas** atualizado se a mudança gerou incertezas.

---

## Passo Final — Qualidade

Execute e corrija qualquer falha antes de encerrar:

```bash
poe codecheck && poe typecheck && poe test
```

> Falhas pré-existentes fora do escopo devem ser sinalizadas como regressões
> anteriores. Não encerre com falhas em aberto.

---

## Restrições

- Edições cirúrgicas — não reescreva a spec inteira.
- Não invente arquivos, métodos ou contratos sem evidência na codebase ou no PRD.
- `core` não pode depender de `FastAPI`, `SQLAlchemy`, `Redis` ou `Inngest` — se a mudança violar isso, recuse e registre em Pendências.
- Referências a código existente: caminho relativo real (`src/animus/...`); novos arquivos: `**novo arquivo**`.
- Não edite o plano sem confirmação explícita.