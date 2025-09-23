import { mock } from 'ts-jest-mocker'

import { Code } from '../Code'
import type { LspProvider } from '#global/interfaces/index'
import { LspResponse } from '#global/responses/LspResponse'

describe('Code strucutre', () => {
  it('should be created with pre code value if it is provided', () => {
    const preCodeValue = 'escreva("Olá, mundo")'
    const code = Code.create(mock(), preCodeValue)
    expect(code.value).toBe(preCodeValue)
  })

  it('should return a Code Runner Response running the value', async () => {
    const lspProviderMock = mock<LspProvider>()
    const codeRunnerResponse = new LspResponse({
      result: 'fake result',
      outputs: [],
    })
    lspProviderMock.run.mockResolvedValue(codeRunnerResponse)

    const code = Code.create(lspProviderMock, 'escreva("Olá, mundo 2")')
    const codeResponse = await code.run()

    expect(codeResponse).toBeInstanceOf(LspResponse)
    expect(codeResponse.result).toBe(codeRunnerResponse.result)
    expect(codeResponse.outputs).toBe(codeRunnerResponse.outputs)
    expect(lspProviderMock.run).toHaveBeenCalledTimes(1)
    expect(lspProviderMock.run).toHaveBeenCalledWith(code.value)
  })

  it('should change the value', () => {
    const oldValue = 'escreva("Olá, mundo")'
    let code = Code.create(mock(), oldValue)
    expect(code.value).toBe(oldValue)

    const newValue = 'escreva("Olá, mundo 2")'
    code = code.changeValue(newValue)
    expect(code.value).toBe(newValue)
  })

  it('should add inputs to value', () => {
    const lspProviderMock = mock<LspProvider>()
    const codeWithInputs = 'fake code with inputs'
    lspProviderMock.addInputs.mockReturnValue(codeWithInputs)
    const codeValue = 'fake code value'
    const inputs: any[] = []

    let code = Code.create(lspProviderMock, codeValue)
    code = code.addInputs(inputs)

    expect(lspProviderMock.addInputs).toHaveBeenCalledTimes(1)
    expect(lspProviderMock.addInputs).toHaveBeenCalledWith(inputs, codeValue)
    expect(code.value).toBe(codeWithInputs)
  })

  it('should format value translating it for the code runner', () => {
    const lspProviderMock = mock<LspProvider>()
    const translatedCode = 'fake translated code'
    lspProviderMock.translateToLsp.mockReturnValue(translatedCode)
    const codeValue = 'fake code value'
    const codeToFormat = 'fake code to format'

    let code = Code.create(lspProviderMock, codeValue)
    code = code.format(codeToFormat)

    expect(lspProviderMock.translateToLsp).toHaveBeenCalledTimes(1)
    expect(lspProviderMock.translateToLsp).toHaveBeenCalledWith(codeToFormat)
    expect(code.value).toBe(translatedCode)
  })

  it('should add a function call to the value', () => {
    const lspProviderMock = mock<LspProvider>()
    const codeWithFunctionCall = 'fake code with function call'
    lspProviderMock.addFunctionCall.mockReturnValue(codeWithFunctionCall)
    const codeValue = 'fake code value'
    const functionParams: unknown[] = []

    let code = Code.create(lspProviderMock, codeValue)
    code = code.addFunctionCall(functionParams)

    expect(lspProviderMock.addFunctionCall).toHaveBeenCalledTimes(1)
    expect(lspProviderMock.addFunctionCall).toHaveBeenCalledWith(
      functionParams,
      codeValue,
    )
    expect(code.value).toBe(codeWithFunctionCall)
  })

  it('should count the inputs in the value', () => {
    const lspProviderMock = mock<LspProvider>()
    const inputsCount = 1
    lspProviderMock.getInputsCount.mockReturnValue(inputsCount)
    const codeValue = 'fake code value'

    const code = Code.create(lspProviderMock, codeValue)

    expect(code.inputsCount).toBe(inputsCount)
    expect(lspProviderMock.getInputsCount).toHaveBeenCalledTimes(1)
    expect(lspProviderMock.getInputsCount).toHaveBeenCalledWith(codeValue)
  })

  it('should true if the value has any input, false otherwise', () => {
    const codeValue = 'fake code value'
    let lspProviderMock = mock<LspProvider>()
    lspProviderMock.getInput.mockReturnValue('fake input')

    let code = Code.create(lspProviderMock, codeValue)

    expect(code.hasInput.isTrue).toBeTruthy()
    expect(lspProviderMock.getInput).toHaveBeenCalledTimes(1)
    expect(lspProviderMock.getInput).toHaveBeenCalledWith(codeValue)

    lspProviderMock = mock<LspProvider>()
    lspProviderMock.getInput.mockReturnValue(null)

    code = Code.create(lspProviderMock, codeValue)

    expect(code.hasInput.isFalse).toBeTruthy()
    expect(lspProviderMock.getInput).toHaveBeenCalledTimes(1)
    expect(lspProviderMock.getInput).toHaveBeenCalledWith(codeValue)
  })

  it('should true if the value has any function, false otherwise', () => {
    const codeValue = 'fake code value'
    let lspProviderMock = mock<LspProvider>()
    lspProviderMock.getFunctionName.mockReturnValue('fake input')

    let code = Code.create(lspProviderMock, codeValue)

    expect(code.hasFunction.isTrue).toBeTruthy()
    expect(lspProviderMock.getFunctionName).toHaveBeenCalledTimes(1)
    expect(lspProviderMock.getFunctionName).toHaveBeenCalledWith(codeValue)

    lspProviderMock = mock<LspProvider>()
    lspProviderMock.getFunctionName.mockReturnValue(null)

    code = Code.create(lspProviderMock, codeValue)

    expect(code.hasFunction.isFalse).toBeTruthy()
    expect(lspProviderMock.getFunctionName).toHaveBeenCalledTimes(1)
    expect(lspProviderMock.getFunctionName).toHaveBeenCalledWith(codeValue)
  })

  it('should return the first input found in the value', () => {
    const codeValue = 'fake code value'
    const lspProviderMock = mock<LspProvider>()
    const input = 'fake input'
    lspProviderMock.getInput.mockReturnValue(input)

    const code = Code.create(lspProviderMock, codeValue)

    expect(code.firstInput).toBe(input)
    expect(lspProviderMock.getInput).toHaveBeenCalledTimes(1)
    expect(lspProviderMock.getInput).toHaveBeenCalledWith(codeValue)
  })
})
