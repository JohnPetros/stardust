import { Backup } from "../Backup"

describe('Bakcup structure', () => {
  it('should save a new state', () => {
    let backup = Backup.create()

    backup = backup.save('state 1')
    expect(backup.states).toEqual(['state 1'])

    backup = backup.save('state 2')
    expect(backup.states).toEqual(['state 1', 'state 2'])
  })

  it('should undo the to the previous state', () => {
    let backup = Backup.create().save('state 1').save('state 2').save('state 3')
    expect(backup.states).toEqual(['state 1', 'state 2', 'state 3'])
    backup = backup.undo()
    expect(backup.states).toEqual(['state 1', 'state 2'])
    backup = backup.undo()
    expect(backup.states).toEqual(['state 1'])
  })

  it('should return tru if it is empty', () => {
    let backup = Backup.create()
    expect(backup.isEmpty.isTrue).toBeTruthy()

    backup = backup.save(1)
    expect(backup.isEmpty.isFalse).toBeTruthy()
  })

  it('should return the last state undoing the state', () => {
    const backup = Backup.create().save('state 1').save('state 2')
    expect(backup.lastState).toBe('state 2')
    expect(backup.states).toEqual(['state 1'])
  })

  it('should be created with default state', () => {
    const backup = Backup.create(['state 1', 'state 2'])
    expect(backup.states).toEqual(['state 1', 'state 2'])
  })
})
