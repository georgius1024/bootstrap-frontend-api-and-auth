import trait from '@/traits/formatting'

describe('formatting trait', () => {
  it('can be loaded', () => {
    expect(trait).toBeTruthy()
  })
  it('getMonthName works as expected', () => {
    expect(trait.methods.getMonthName(0)).toBe('январь')
    expect(trait.methods.getMonthName(11)).toBe('декабрь')
  })
  it('getMonthDateName works as expected', () => {
    expect(trait.methods.getMonthDateName(0)).toBe('января')
    expect(trait.methods.getMonthDateName(11)).toBe('декабря')
  })
  it('can translate local time to UTC', () => {
    const local = new Date('2019-01-25')
    const expected = new Date('2019-01-24T19:00:00.000Z')
    const utc = trait.methods.localToUtc(local)
    expect(utc.getTime()).toBe(expected.getTime())
  })
  it('can translate UTC time to local', () => {
    const utc = new Date('2019-01-25')
    const expected = new Date('2019-01-25T05:00:00.000Z')
    const local = trait.methods.utcToLocal(utc)
    expect(local.getTime()).toBe(expected.getTime())
  })
  it('can translate UTC time to Moscow', () => {
    const utc = new Date('2019-01-25')
    const expected = new Date('2019-01-25T03:00:00.000Z')
    const moscow = trait.methods.utcToMoscow(utc)
    expect(moscow.getTime()).toBe(expected.getTime())
  })
  it('can translate local time to Moscow', () => {
    const local = new Date('2019-01-25')
    const expected = new Date('2019-01-24T22:00:00.000Z')
    const moscow = trait.methods.localToMoscow(local)
    expect(moscow.getTime()).toBe(expected.getTime())
  })
  it('can convert number to formatted bytes', () => {
    expect(trait.filters.bytes(100)).toBe('100 Байт')
    expect(trait.filters.bytes(1000)).toBe('1000 Байт')
    expect(trait.filters.bytes(10000)).toBe('9.77 KB')
    expect(trait.filters.bytes(100000)).toBe('97.66 KB')
    expect(trait.filters.bytes(1000000)).toBe('976.56 KB')
    expect(trait.filters.bytes(1000000000)).toBe('953.67 MB')
  })
  it('can trim long strings', () => {
    const phrase = 'Use one of the Vuetify Vue CLI packages (based on the official examples) to get your project started in no time.'
    expect(trait.filters.shorten20(phrase)).toBe('Use one of the Vu...')
    expect(trait.filters.shorten40(phrase)).toBe('Use one of the Vuetify Vue CLI packag...')
    expect(trait.filters.shorten60(phrase)).toBe('Use one of the Vuetify Vue CLI packages (based on the off...')
    expect(trait.filters.shorten80(phrase)).toBe('Use one of the Vuetify Vue CLI packages (based on the official examples) to g...')
  })
  it('can format date', () => {
    const D = '2019-01-24 19:00:00.000'
    expect(trait.filters.date('')).toBe('')
    expect(trait.filters.date(D)).toBe('24.01.2019')
  })
  it('can format time', () => {
    const D = '2019-01-24 09:00:00.000'
    expect(trait.filters.time('')).toBe('')
    expect(trait.filters.time(D)).toBe('09:00')
  })
  it('can format date and time', () => {
    const D = '2019-01-24 09:00:00.000'
    expect(trait.filters.dateTime('')).toBe('')
    expect(trait.filters.dateTime(D)).toBe('24.01.2019 09:00')
  })
  it('can literal format date', () => {
    const D = '2019-01-24 09:00:00.000'
    expect(trait.filters.literalDate(D)).toBe('24 января 2019')
  })
  it('can format local date and time', () => {
    const D = '2019-01-24 09:00:00.000'
    expect(trait.filters.localDateTime('')).toBe('')
    expect(trait.filters.localDateTime(D)).toBe('24.01.2019 14:00')
  })
  it('can format local date', () => {
    const D = '2019-01-24 09:00:00.000'
    expect(trait.filters.localDateTime('')).toBe('')
    expect(trait.filters.localDate(D)).toBe('24.01.2019')
  })
  it('can format local time', () => {
    const D = '2019-01-24 09:00:00.000'
    expect(trait.filters.localDateTime('')).toBe('')
    expect(trait.filters.localTime(D)).toBe('14:00')
  })
})
