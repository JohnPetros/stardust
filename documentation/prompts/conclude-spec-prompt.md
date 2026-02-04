# Prompt: Conclude Spec

**Objetivo:** Finalizar e consolidar a implementação de uma Spec técnica,
garantindo que o código esteja polido, documentado, validado e pronto para a
criação de um Pull Request.

**Entrada:**

- **Spec Técnica:** O documento que guiou a implementação
  (`documentation/features/.../specs/...`).
- **Código Implementado:** As alterações realizadas nas camadas UI, Core, Rest e
  Drivers.

**Diretrizes de Execução:**

1. **Validação de Qualidade Final:**
   - **Análise Estática e Formatação:** Execute `npm run codecheck` na raiz do
     monotepo para garantir que não existam warnings ou erros remanescentes.
   - **Testes Unitários:** Execute `npm run test` na raiz do monorepo para
     validar que todos os testes (novos e existentes) estão passando.

2. **Verificação de Requisitos:**
   - Compare o código final com cada seção da Spec (O que deve ser
     criado/modificado).
   - Certifique-se de que todos os componentes descritos foram implementados
     conforme planejado.

3. **Atualização da Documentação e Visualização:**
   - Refine o documento da Spec original para refletir decisões de design de
     última hora ou mudanças de caminho.
   - **PRD:** Atualize o PRD associado a spec com as mudanças implementadas.
     Verifique se os itens foram concluídos e marque-os como concluídos.

4. **Atualização do Status da Spec:**
   - Atualize o status da Spec para "concluído".
   - Atualize a data da última atualização.

5. **Geração de Resumo Final:**
   - Forneça um resumo técnico do que foi concluído para facilitar a criação do
     PR subsequente.
