import { strictEqual } from 'node:assert'
import { describe, it } from 'node:test'

import { DeleguaProvedorLsp } from './DeleguaProvedorLsp'

describe('DeleguaProvedorLsp', () => {
  it('deve substituir apenas a chamada leia ao adicionar entradas', async () => {
    const provedor = new DeleguaProvedorLsp()

    const codigo = await provedor.addInputs([2], 'var num = numero(leia())')

    strictEqual(codigo, 'var num = numero(2)')
  })
})
