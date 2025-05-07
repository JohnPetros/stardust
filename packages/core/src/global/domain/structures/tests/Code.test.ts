import { mock } from 'ts-jest-mocker'

import { Code } from '../Code'
import type { CodeRunnerProvider } from '#global/interfaces/index'
import { CodeRunnerResponse } from '#global/responses/CodeRunnerResponse'

describe('Code strucutre', () => {
  it('should be created with pre code value if it is provided', () => {
    const preCodeValue = 'escreva("Olá, mundo")'
    const code = Code.create(mock(), preCodeValue)
    expect(code.value).toBe(preCodeValue)
  })

  it('should return a Code Runner Response running the value', async () => {
    const codeRunnerProviderMock = mock<CodeRunnerProvider>()
    const codeRunnerResponse = new CodeRunnerResponse({
      result: 'fake result',
      outputs: [],
    })
    codeRunnerProviderMock.run.mockResolvedValue(codeRunnerResponse)

    const code = Code.create(codeRunnerProviderMock, 'escreva("Olá, mundo 2")')
    const codeResponse = await code.run()

    expect(codeResponse).toBeInstanceOf(CodeRunnerResponse)
    expect(codeResponse.result).toBe(codeRunnerResponse.result)
    expect(codeResponse.outputs).toBe(codeRunnerResponse.outputs)
    expect(codeRunnerProviderMock.run).toHaveBeenCalledTimes(1)
    expect(codeRunnerProviderMock.run).toHaveBeenCalledWith(code.value)
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
    const codeRunnerProviderMock = mock<CodeRunnerProvider>()
    const codeWithInputs = 'fake code with inputs'
    codeRunnerProviderMock.addInputs.mockReturnValue(codeWithInputs)
    const codeValue = 'fake code value'
    const inputs: any[] = []

    let code = Code.create(codeRunnerProviderMock, codeValue)
    code = code.addInputs(inputs)

    expect(codeRunnerProviderMock.addInputs).toHaveBeenCalledTimes(1)
    expect(codeRunnerProviderMock.addInputs).toHaveBeenCalledWith(inputs, codeValue)
    expect(code.value).toBe(codeWithInputs)
  })

  it('should format value translating it for the code runner', () => {
    const codeRunnerProviderMock = mock<CodeRunnerProvider>()
    const translatedCode = 'fake translated code'
    codeRunnerProviderMock.translateToCodeRunner.mockReturnValue(translatedCode)
    const codeValue = 'fake code value'
    const codeToFormat = 'fake code to format'

    let code = Code.create(codeRunnerProviderMock, codeValue)
    code = code.format(codeToFormat)

    expect(codeRunnerProviderMock.translateToCodeRunner).toHaveBeenCalledTimes(1)
    expect(codeRunnerProviderMock.translateToCodeRunner).toHaveBeenCalledWith(
      codeToFormat,
    )
    expect(code.value).toBe(translatedCode)
  })

  it('should add a function call to the value', () => {
    const codeRunnerProviderMock = mock<CodeRunnerProvider>()
    const codeWithFunctionCall = 'fake code with function call'
    codeRunnerProviderMock.addFunctionCall.mockReturnValue(codeWithFunctionCall)
    const codeValue = 'fake code value'
    const functionParams: unknown[] = []

    let code = Code.create(codeRunnerProviderMock, codeValue)
    code = code.addFunctionCall(functionParams)

    expect(codeRunnerProviderMock.addFunctionCall).toHaveBeenCalledTimes(1)
    expect(codeRunnerProviderMock.addFunctionCall).toHaveBeenCalledWith(
      functionParams,
      codeValue,
    )
    expect(code.value).toBe(codeWithFunctionCall)
  })

  it('should count the inputs in the value', () => {
    const codeRunnerProviderMock = mock<CodeRunnerProvider>()
    const inputsCount = 1
    codeRunnerProviderMock.getInputsCount.mockReturnValue(inputsCount)
    const codeValue = 'fake code value'

    const code = Code.create(codeRunnerProviderMock, codeValue)

    expect(code.inputsCount).toBe(inputsCount)
    expect(codeRunnerProviderMock.getInputsCount).toHaveBeenCalledTimes(1)
    expect(codeRunnerProviderMock.getInputsCount).toHaveBeenCalledWith(codeValue)
  })

  it('should true if the value has any input, false otherwise', () => {
    const codeValue = 'fake code value'
    let codeRunnerProviderMock = mock<CodeRunnerProvider>()
    codeRunnerProviderMock.getInput.mockReturnValue('fake input')

    let code = Code.create(codeRunnerProviderMock, codeValue)

    expect(code.hasInput.isTrue).toBeTruthy()
    expect(codeRunnerProviderMock.getInput).toHaveBeenCalledTimes(1)
    expect(codeRunnerProviderMock.getInput).toHaveBeenCalledWith(codeValue)

    codeRunnerProviderMock = mock<CodeRunnerProvider>()
    codeRunnerProviderMock.getInput.mockReturnValue(null)

    code = Code.create(codeRunnerProviderMock, codeValue)

    expect(code.hasInput.isFalse).toBeTruthy()
    expect(codeRunnerProviderMock.getInput).toHaveBeenCalledTimes(1)
    expect(codeRunnerProviderMock.getInput).toHaveBeenCalledWith(codeValue)
  })

  it('should true if the value has any function, false otherwise', () => {
    const codeValue = 'fake code value'
    let codeRunnerProviderMock = mock<CodeRunnerProvider>()
    codeRunnerProviderMock.getFunctionName.mockReturnValue('fake input')

    let code = Code.create(codeRunnerProviderMock, codeValue)

    expect(code.hasFunction.isTrue).toBeTruthy()
    expect(codeRunnerProviderMock.getFunctionName).toHaveBeenCalledTimes(1)
    expect(codeRunnerProviderMock.getFunctionName).toHaveBeenCalledWith(codeValue)

    codeRunnerProviderMock = mock<CodeRunnerProvider>()
    codeRunnerProviderMock.getFunctionName.mockReturnValue(null)

    code = Code.create(codeRunnerProviderMock, codeValue)

    expect(code.hasFunction.isFalse).toBeTruthy()
    expect(codeRunnerProviderMock.getFunctionName).toHaveBeenCalledTimes(1)
    expect(codeRunnerProviderMock.getFunctionName).toHaveBeenCalledWith(codeValue)
  })

  it('should return the first input found in the value', () => {
    const codeValue = 'fake code value'
    const codeRunnerProviderMock = mock<CodeRunnerProvider>()
    const input = 'fake input'
    codeRunnerProviderMock.getInput.mockReturnValue(input)

    const code = Code.create(codeRunnerProviderMock, codeValue)

    expect(code.firstInput).toBe(input)
    expect(codeRunnerProviderMock.getInput).toHaveBeenCalledTimes(1)
    expect(codeRunnerProviderMock.getInput).toHaveBeenCalledWith(codeValue)
  })
})
