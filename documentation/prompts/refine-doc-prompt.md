---
description: Prompt para refinar documentos markdown com foco em estrutura, clareza, consistencia e qualidade textual.
---

# Prompt: Refinar Documento (PRD/Spec/MD)

**Objetivo Principal** Atuar como um Technical Writer Sênior para revisar,
estruturar e polir documentos técnicos em Markdown. O objetivo é garantir que a
informação seja densa, porém clara, com hierarquia lógica e formatação impecável
para consumo tanto por humanos quanto por LLMs.

**Entrada:**

- Documento ou trecho em Markdown a ser refinado.
- Contexto adicional (opcional).

**Regras Aplicáveis:**

Não há rule de camada obrigatória para todo documento.

Use rules quando o documento refinado tocar o projeto StarDust:

- `documentation/rules/rules.md` — para validar links e citações de rules por camada.
- `documentation/rules/code-conventions-rules.md` — quando o documento padronizar nomes, exemplos de código, factories, erros ou eventos.
- Rule específica da camada quando o documento for PRD, spec, report ou guideline técnico sobre uma camada.

Se o documento refinado for uma rule, use também `documentation/prompts/update-layer-rules-prompt.md`.

**Diretrizes de Execução:**

1. **Análise de Estrutura e Hierarquia:**
   - **Níveis de Cabeçalho:** Garanta que os `#` sigam uma ordem lógica (H1 ->
     H2 -> H3). Não pule níveis.
   - **Escaneabilidade:** Transforme blocos longos de texto em listas (bullet
     points ou numeradas) sempre que possível.
   - **Ênfase:** Use **negrito** para destacar termos chave, nomes de
     componentes ou conceitos críticos.

2. **Qualidade do Texto:**
   - **Tom de Voz:** Mantenha um tom profissional, direto e técnico. Evite
     ambiguidades ou palavras vagas como "talvez", "alguns", "geralmente" (a
     menos que o contexto exija).
   - **Consistência Linguística:** O corpo do texto deve ser predominantemente
     em Português (Brasil), mas termos técnicos de programação (ex: `hook`,
     `store`, `middleware`, `request`) devem ser mantidos no original em Inglês
     e formatados como `code`.

3. **Validação de Referências e Links:**
   - **Arquivos Locais:** Verifique se as referências a arquivos (ex:
     `@[caminho/do/arquivo]`) estão corretas e se os arquivos realmente existem
     no projeto.
   - **Links Externos:** Garanta que a sintaxe `[Texto](URL)` esteja correta.

4. **Recursos Visuais:**
   - **Blocos de Código:** Use blocos de código com a linguagem especificada
     (ex: ```typescript) para exemplos técnicos.
   - **Tabelas:** Organize informações comparativas ou listas de propriedades em
     tabelas Markdown para facilitar a leitura.
   - **Callouts:** Use citações (`>`) ou emojis (ex: 💡, ⚠️, 🛠️) para destacar
     notas ou avisos importantes.

**Checklist de Saída:**

- [ ] O documento possui um título claro (H1).
- [ ] A hierarquia de cabeçalhos está consistente.
- [ ] Todos os caminhos de arquivos citados foram validados.
- [ ] Termos técnicos estão formatados como `code`.
- [ ] Não há erros gramaticais ou de digitação.
