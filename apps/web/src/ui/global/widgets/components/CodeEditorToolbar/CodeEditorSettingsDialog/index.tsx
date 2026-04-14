import type { ReactNode } from 'react'

import * as Dialog from '../../Dialog'
import { RangeInput } from '../../RadioInput'
import { useCodeEditorSettingsDialog } from './useCodeEditorSettingsDialog'
import { Switch } from '../../Switch'
import * as Select from '../../Select'
import { Button } from '../../Button'

type CodeEditorSettingsProps = {
  children: ReactNode
}

export function CodeEditorSettingsDialog({ children }: CodeEditorSettingsProps) {
  const {
    fontSize,
    tabSize,
    isCodeCheckerEnabled,
    formatter,
    linter,
    handleFontSizeRangeValueChange,
    handleTabSizeRangeValueChange,
    handleErrorDetectorToggle,
    handleTextDelimiterChange,
    handleMaxCharsPerLineChange,
    handleLinterToggle,
    handleNamingConventionToggle,
    handleNamingConventionVariableChange,
    handleNamingConventionConstantChange,
    handleNamingConventionFunctionChange,
    handleConsistentParadigmToggle,
    handleConsistentParadigmChange,
    handleRestoreDefaults,
  } = useCodeEditorSettingsDialog()

  const isNamingConventionDisabled =
    !linter.isEnabled || !linter.namingConvention.isEnabled
  const isConsistentParadigmDisabled =
    !linter.isEnabled || !linter.consistentParadigm.isEnabled

  return (
    <Dialog.Container>
      <Dialog.Content className='max-w-[540px]'>
        <Dialog.Header>Configurações</Dialog.Header>

        <div className='mt-5 rounded-xl border border-gray-600/70 bg-gray-900/40 px-4 py-4'>
          <section className='space-y-4 pb-5'>
            <h3 className='text-sm font-semibold text-gray-200'>Aparência</h3>

            <div className='flex items-center justify-between gap-6'>
              <label htmlFor='fontSize' className='text-sm text-gray-100'>
                Tamanho da fonte (px):
              </label>
              <RangeInput
                id='fontSize'
                value={fontSize}
                min={12}
                max={20}
                step={2}
                onValueChange={handleFontSizeRangeValueChange}
              />
            </div>

            <div className='flex items-center justify-between gap-6'>
              <div>
                <p className='text-sm text-gray-100'>Detector de erros</p>
                <p className='text-xs text-gray-400'>Erros de sintaxe em tempo real</p>
              </div>
              <Switch
                defaultCheck={isCodeCheckerEnabled}
                className='border-0 px-0 py-0'
                onCheck={handleErrorDetectorToggle}
              />
            </div>
          </section>

          <section className='space-y-4 border-t border-gray-700/70 py-5'>
            <h3 className='text-sm font-semibold text-gray-200'>Formatação</h3>

            <div className='flex items-center justify-between gap-6'>
              <label htmlFor='tabSize' className='text-sm text-gray-100'>
                Tamanho do tab:
              </label>
              <RangeInput
                id='tabSize'
                value={tabSize}
                min={2}
                max={8}
                step={1}
                onValueChange={handleTabSizeRangeValueChange}
              />
            </div>

            <div className='flex items-center justify-between gap-6'>
              <label htmlFor='maxCharsPerLine' className='text-sm text-gray-100'>
                Máx. de caracteres por linha:
              </label>
              <RangeInput
                id='maxCharsPerLine'
                value={formatter.maxCharsPerLine}
                min={40}
                max={240}
                step={10}
                onValueChange={handleMaxCharsPerLineChange}
              />
            </div>

            <div className='flex items-center justify-between gap-6'>
              <label className='text-sm text-gray-100'>Delimitador de texto:</label>
              <Select.Container
                onValueChange={handleTextDelimiterChange}
                value={formatter.textDelimiter}
              >
                <Select.Trigger
                  className='w-[140px] rounded-lg border-gray-500 bg-gray-800 px-3 py-2 text-xs'
                  value={
                    formatter.textDelimiter === 'preserve'
                      ? 'Preservar'
                      : formatter.textDelimiter === 'single'
                        ? 'Aspas simples'
                        : 'Aspas duplas'
                  }
                />
                <Select.Content>
                  <Select.Item value='preserve'>
                    <Select.Text>Preservar</Select.Text>
                  </Select.Item>
                  <Select.Item value='single'>
                    <Select.Text>Aspas simples</Select.Text>
                  </Select.Item>
                  <Select.Item value='double'>
                    <Select.Text>Aspas duplas</Select.Text>
                  </Select.Item>
                </Select.Content>
              </Select.Container>
            </div>
          </section>

          <section className='space-y-4 border-t border-gray-700/70 pt-5'>
            <h3 className='text-sm font-semibold text-gray-200'>Estilizador</h3>

            <div className='flex items-center justify-between gap-6'>
              <div>
                <p className='text-sm text-gray-100'>Ativar estilizador</p>
                <p className='text-xs text-gray-400'>Controla todas as regras abaixo</p>
              </div>
              <Switch
                defaultCheck={linter.isEnabled}
                className='border-0 px-0 py-0'
                onCheck={handleLinterToggle}
              />
            </div>

            <div className='space-y-3'>
              <Switch
                label='Convenção de nomenclatura'
                defaultCheck={linter.isEnabled && linter.namingConvention.isEnabled}
                isDisabled={!linter.isEnabled}
                className='w-full justify-between rounded-md border border-gray-600 px-3 py-2'
                onCheck={handleNamingConventionToggle}
              />

              <div className='grid grid-cols-1 gap-3 pl-1 sm:grid-cols-3'>
                <div className='space-y-1'>
                  <label className='text-xs text-gray-400'>Variável</label>
                  <Select.Container
                    onValueChange={handleNamingConventionVariableChange}
                    value={linter.namingConvention.variable}
                  >
                    <Select.Trigger
                      className='w-full rounded-lg px-3 py-2 text-xs'
                      isDiabled={isNamingConventionDisabled}
                      value={linter.namingConvention.variable}
                    />
                    <Select.Content>
                      <Select.Item value='caixaCamelo'>
                        <Select.Text>caixaCamelo</Select.Text>
                      </Select.Item>
                      <Select.Item value='caixa_cobra'>
                        <Select.Text>caixa_cobra</Select.Text>
                      </Select.Item>
                      <Select.Item value='CaixaPascal'>
                        <Select.Text>CaixaPascal</Select.Text>
                      </Select.Item>
                    </Select.Content>
                  </Select.Container>
                </div>

                <div className='space-y-1'>
                  <label className='text-xs text-gray-400'>Constante</label>
                  <Select.Container
                    onValueChange={handleNamingConventionConstantChange}
                    value={linter.namingConvention.constant}
                  >
                    <Select.Trigger
                      className='w-full rounded-lg px-3 py-2 text-xs'
                      isDiabled={isNamingConventionDisabled}
                      value={linter.namingConvention.constant}
                    />
                    <Select.Content>
                      <Select.Item value='CAIXA_ALTA'>
                        <Select.Text>CAIXA_ALTA</Select.Text>
                      </Select.Item>
                      <Select.Item value='caixaCamelo'>
                        <Select.Text>caixaCamelo</Select.Text>
                      </Select.Item>
                    </Select.Content>
                  </Select.Container>
                </div>

                <div className='space-y-1'>
                  <label className='text-xs text-gray-400'>Função</label>
                  <Select.Container
                    onValueChange={handleNamingConventionFunctionChange}
                    value={linter.namingConvention.function}
                  >
                    <Select.Trigger
                      className='w-full rounded-lg px-3 py-2 text-xs'
                      isDiabled={isNamingConventionDisabled}
                      value={linter.namingConvention.function}
                    />
                    <Select.Content>
                      <Select.Item value='caixaCamelo'>
                        <Select.Text>caixaCamelo</Select.Text>
                      </Select.Item>
                      <Select.Item value='caixa_cobra'>
                        <Select.Text>caixa_cobra</Select.Text>
                      </Select.Item>
                      <Select.Item value='CaixaPascal'>
                        <Select.Text>CaixaPascal</Select.Text>
                      </Select.Item>
                    </Select.Content>
                  </Select.Container>
                </div>
              </div>
            </div>

            <div className='space-y-3'>
              <Switch
                label='Paradigma consistente'
                defaultCheck={linter.isEnabled && linter.consistentParadigm.isEnabled}
                isDisabled={!linter.isEnabled}
                className='w-full justify-between rounded-md border border-gray-600 px-3 py-2'
                onCheck={handleConsistentParadigmToggle}
              />

              <div className='pl-1'>
                <Select.Container
                  onValueChange={handleConsistentParadigmChange}
                  value={linter.consistentParadigm.paradigm}
                >
                  <Select.Trigger
                    className='w-[120px] rounded-lg px-3 py-2 text-xs'
                    isDiabled={isConsistentParadigmDisabled}
                    value={
                      linter.consistentParadigm.paradigm === 'both'
                        ? 'ambos'
                        : linter.consistentParadigm.paradigm === 'imperative'
                          ? 'imperativo'
                          : 'infinitivo'
                    }
                  />
                  <Select.Content>
                    <Select.Item value='both'>
                      <Select.Text>ambos</Select.Text>
                    </Select.Item>
                    <Select.Item value='imperative'>
                      <Select.Text>imperativo</Select.Text>
                    </Select.Item>
                    <Select.Item value='infinitive'>
                      <Select.Text>infinitivo</Select.Text>
                    </Select.Item>
                  </Select.Content>
                </Select.Container>
              </div>
            </div>
          </section>

          <footer className='mt-5 flex items-center justify-between border-t border-gray-700/70 pt-4'>
            <Button
              className='h-9 w-auto rounded-lg border border-gray-500 bg-transparent px-4 text-xs text-gray-100'
              onClick={handleRestoreDefaults}
            >
              Restaurar padrão
            </Button>

            <Dialog.Close asChild>
              <Button className='h-9 w-auto rounded-lg px-8 text-xs'>Salvar</Button>
            </Dialog.Close>
          </footer>
        </div>
      </Dialog.Content>

      <Dialog.Trigger>{children}</Dialog.Trigger>
    </Dialog.Container>
  )
}
