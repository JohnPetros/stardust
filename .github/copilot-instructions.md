# Instruções para Revisão com GitHub Copilot

## Antes de iniciar

- Leia o arquivo `AGENTS.md` antes de começar a revisão.
- Se houver uma issue vinculada ao pull request, leia-a antes de analisar as alterações. Se não houver issue, baseie a revisão exclusivamente no código e nas regras do projeto, sem tratar a ausência como problema.

---

## O que deve ser validado

Ao revisar as alterações, identifique e reporte:

- problemas de performance
- problemas de segurança
- problemas de concorrência
- problemas de acoplamento
- problemas de manutenibilidade
- duplicações de código ou de lógica
- ausência de testes ou cobertura insuficiente
- problemas de legibilidade
- erros de digitação, nomes incorretos ou inconsistências de escrita

---

## Conformidade com padrões do projeto

Verifique se as alterações seguem os padrões definidos nos arquivos:

- `documentation/rules/code-conventions-rules.md`
- `documentation/rules/rules.md`

Se algum desses arquivos não estiver disponível, informe explicitamente e limite a revisão aos critérios gerais listados acima.

Além da convenção de código, confirme também que a implementação está adequada à camada e à responsabilidade do código alterado, respeitando os padrões arquiteturais e organizacionais descritos na documentação.

---

## Validação contra a issue

Se houver uma issue vinculada, use-a como referência para validar se a implementação:

- atende ao que foi solicitado
- respeita o escopo definido
- cobre os requisitos principais
- não introduz comportamento divergente do esperado

---

## Como reportar os problemas encontrados

Use o seguinte formato para cada problema identificado:

```
**[OBRIGATÓRIO | SUGESTÃO]**
**Problema:** descrição clara e específica do que está errado
**Impacto:** consequência real ou potencial do problema
**Sugestão:** ação corretiva recomendada (sempre que possível)
```

**Critério de classificação:**

- **OBRIGATÓRIO** — problemas de segurança, bugs, violações diretas das regras do projeto ou comportamento divergente do esperado na issue.
- **SUGESTÃO** — melhorias de legibilidade, performance não crítica, oportunidades de refatoração ou boas práticas não exigidas pelas regras.

---

## O que não fazer

- Não comente preferências pessoais de estilo que não estejam cobertas pelas regras do projeto.
- Não repita o que o código já documenta claramente.
- Não aponte a ausência de issue vinculada como um problema.
- Não invente padrões ou regras que não estejam documentados nos arquivos de referência.

---

## Diretriz final

Priorize comentários relevantes, acionáveis e fundamentados nas regras do projeto. Evite observações genéricas ou subjetivas sem justificativa. Quantidade não é qualidade — um comentário preciso vale mais do que cinco vagos.