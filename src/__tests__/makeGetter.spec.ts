
import { getter } from '../makeGetter'

describe('getter', () => {
  it('should return a getter whose `get` function is the one passed in', () => {
    const expected = jest.fn()
    const actual = getter<any, any>(expected)
    expect(actual.get).toBe(expected)
  })

  it('should return a getter whose `defaultVal` is the one passed in', () => {
    const expected = {}
    const actual = getter(jest.fn(), expected)
    expect(actual.defaultVal).toBe(expected)
  })
})
