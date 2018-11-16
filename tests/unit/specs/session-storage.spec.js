import { hasStored, getStored, putStored, deleteStored, deleteAll } from '@/lib/session-storage'
import {} from '../mocks/session-storage.mock'

describe('session-storage.js', () => {
  putStored('key-number', 1)
  putStored('key-string', 'hello')
  putStored('key-object', { n: 1, text: 'hello' })

  it('hasStored should returns is key stored or not', () => {
    expect(hasStored('key-number')).toBeTruthy()
    expect(hasStored('key-string')).toBeTruthy()
    expect(hasStored('key-object')).toBeTruthy()
    expect(hasStored('key-wrong')).toBeFalsy()
  })

  it('getStored should return stored value', () => {
    expect(getStored('key-number')).toBe(1)
    expect(getStored('key-string')).toBe('hello')
    expect(getStored('key-object')).toEqual({ n: 1, text: 'hello' })
  })

  it('getStored should return default value if not stored', () => {
    expect(getStored('key-wrong', 101)).toBe(101)
  })

  it('putStored should replace stored value', () => {
    putStored('key-number', 200)
    expect(getStored('key-number')).toBe(200)
    putStored('key-string', 'olleh')
    expect(getStored('key-string')).toBe('olleh')
  })

  it('deleteStored should delete stored value', () => {
    deleteStored('key-number')
    expect(getStored('key-number')).toBeUndefined()
    deleteStored('key-string')
    expect(getStored('key-string')).toBeUndefined()
  })

  it('deleteStored should delete stored value', () => {
    deleteAll()
    expect(getStored('key-number')).toBeUndefined()
    expect(getStored('key-string')).toBeUndefined()
    expect(getStored('key-object')).toBeUndefined()
  })
})
