import { ValidationError } from "../../errors"
import { Logical } from "../Logical"


describe("Logical structure", () => {
  it("should be created with a valid boolean value", () => {
     expect(() => Logical.create(true)).not.toThrow(ValidationError)
     expect(() => Logical.create('invalid boolean' as unknown as boolean)).toThrow(ValidationError)
  })

  it("should return it is true or false", () => {
    let logical = Logical.create(true)
    expect(logical.isTrue).toBe(true)
    expect(logical.isFalse).toBe(false)

    logical = Logical.create(false)
    expect(logical.isTrue).toBe(false)
    expect(logical.isFalse).toBe(true)
  })

  it("should become true", () => {
    let logical = Logical.create(false)
    expect(logical.value).toBe(false)

    logical = logical.becomeFalse()
    expect(logical.value).toBe(false)
  })

  it("should become false", () => {
    let logical = Logical.create(true)
    expect(logical.value).toBe(true)

    logical = logical.becomeTrue()
    expect(logical.value).toBe(true)
  })

  it("should become false", () => {
    let logical = Logical.create(true)
    expect(logical.value).toBe(true)

    logical = logical.becomeFalse()
    expect(logical.value).toBe(false)
  })

  it("should invert value", () => {
    let logical = Logical.create(true)
    expect(logical.value).toBe(true)

    logical = logical.invertValue()
    expect(logical.value).toBe(false)
    logical = logical.invertValue()
    expect(logical.value).toBe(true)
  })

  it("should correctly evaluate combined logical structures using AND operator", () => {
    let logical = Logical.create(true).and(Logical.create(true))
    expect(logical.value).toBe(true)

    logical = Logical.create(true).and(Logical.create(false))
    expect(logical.value).toBe(false)
  })

  it("should correctly evaluate combined logical structures using OR operator", () => {
    let logical = Logical.create(true).or(Logical.create(true))
    expect(logical.value).toBe(true)

    logical = Logical.create(true).or(Logical.create(false))
    expect(logical.value).toBe(true)

    logical = Logical.create(false).or(Logical.create(false))
    expect(logical.value).toBe(false)
  })
})