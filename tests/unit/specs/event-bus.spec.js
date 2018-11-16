import eventBus from '@/event-bus'

describe('even-bus.js', () => {
  const event = 'tick-tick'
  let calls = 0
  const counter = () => {
    calls++
  }
  it('should be object', () => {
    expect(eventBus).toBeTruthy()
  })
  it('should has events object', () => {
    expect(eventBus.events).toBeTruthy()
  })
  it('can subscribe', () => {
    expect(eventBus.on(event, counter))
      .toBeTruthy()
  })
  it('can emit and subscribed listeners called', () => {
    for (let i = 0; i < 3; i++) {
      eventBus.emit(event)
    }
    expect(calls).toEqual(3)
  })
  it('can unsubscribe', () => {
    expect(eventBus.off(event, counter))
      .toBeTruthy()
  })
  it('can emit and unsubscribed listeners not called', () => {
    for (let i = 0; i < 3; i++) {
      eventBus.emit(event)
    }
    expect(calls).toEqual(3)
  })
})
