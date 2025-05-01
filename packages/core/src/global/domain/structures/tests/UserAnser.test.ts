import { UserAnswer } from '../UserAnswer'

describe('User answer structure', () => {
  it('should be created as incorrect and unverified', () => {
    const userAnswer = UserAnswer.create()
    expect(userAnswer.isCorrect.isFalse).toBeTruthy()
    expect(userAnswer.isVerified.isFalse).toBeTruthy()
  })

  it('should be created with value set to null if not default answer value is provided', () => {
    let userAnswer = UserAnswer.create()
    expect(userAnswer.value).toBeNull()
    userAnswer = UserAnswer.create('default value')
    expect(userAnswer.value).toBe('default value')
  })

  it('should change value', () => {
    let userAnswer = UserAnswer.create('current value')
    expect(userAnswer.value).toBe('current value')

    userAnswer = userAnswer.changeAnswerValue('new value')
    expect(userAnswer.value).toBe('new value')
  })

  it('should become verified', () => {
    let userAnswer = UserAnswer.create()
    expect(userAnswer.isVerified.isFalse).toBeTruthy()

    userAnswer = userAnswer.becomeVerified()
    expect(userAnswer.isVerified.isTrue).toBeTruthy()
  })

  it('should become correct', () => {
    let userAnswer = UserAnswer.create()
    expect(userAnswer.isCorrect.value).toBeFalsy()

    userAnswer = userAnswer.becomeCorrect()
    expect(userAnswer.isCorrect.value).toBeTruthy()
  })

  it('should become incorrect', () => {
    let userAnswer = UserAnswer.create()
    expect(userAnswer.isCorrect.isFalse).toBeTruthy()

    userAnswer = userAnswer.becomeCorrect()
    expect(userAnswer.isCorrect.isTrue).toBeTruthy()

    userAnswer = userAnswer.becomeIncorrect()
    expect(userAnswer.isCorrect.isFalse).toBeTruthy()
  })

  it('should consired as answered if the answer value is truthy', () => {
    let userAnswer = UserAnswer.create(null)
    expect(userAnswer.isAnswered.isFalse).toBeTruthy()

    userAnswer = userAnswer.changeAnswerValue('truthy value')
    expect(userAnswer.isAnswered.isTrue).toBeTruthy()
  })
})
