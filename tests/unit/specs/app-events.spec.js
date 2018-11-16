import {
  createLocalVue,
  shallowMount
} from '@vue/test-utils'

import mockAxios from '../mocks/axios.mock'
import Api from '@/api'

import router from '@/router'
import store from '@/store'

import eventBus from '@/event-bus'

import App from '@/App'

const localVue = createLocalVue()
localVue.use(store)
localVue.use(router)

describe('App.vue', () => {
  Api.http = mockAxios
  mockAxios.intercept = (request) => {
    return Promise.resolve({
      status: 200,
      data: {
        data: {
          organization: 'test'
        }
      }
    })
  }
  let wrapper
  beforeEach(() => {
    wrapper = shallowMount(App, {
      localVue,
      router,
      store
    })
  })

  it('should be mounted without errors', () => {
    expect(wrapper).toBeTruthy()
  })

  it('message and error event hanlers works as expected', () => {
    const messageControl = wrapper.find('appmessage-stub')
    eventBus.emit(eventBus.events.message, 'message')
    expect(wrapper.vm.message).toBe('message')
    expect(wrapper.vm.showMessage).toBe(true)
    expect(wrapper.vm.level).toBe('')
    expect(messageControl.attributes().message).toBe('message')
    expect(messageControl.attributes().value).toBe('true')
    expect(messageControl.attributes().level).toBe('')

    eventBus.emit(eventBus.events.error, 'error')
    expect(wrapper.vm.message).toBe('error')
    expect(wrapper.vm.level).toBe('error')
    expect(wrapper.vm.showMessage).toBe(true)
    expect(messageControl.attributes().message).toBe('error')
    expect(messageControl.attributes().value).toBe('true')
    expect(messageControl.attributes().level).toBe('error')
  })

  it('busy and idle event hanlers works as expected', () => {
    const spinnerControl = wrapper.find('appspinner-stub')

    eventBus.emit(eventBus.events.busy)
    expect(wrapper.vm.spinner).toBeTruthy()
    expect(spinnerControl.attributes().active).toBeTruthy()

    eventBus.emit(eventBus.events.idle)
    expect(wrapper.vm.spinner).toBeFalsy()
    expect(spinnerControl.attributes().active).toBeFalsy()
  })

  it('should listen events', () => {
    const raiseMessage = jest.fn()
    const raiseError = jest.fn()
    const startSpinner = jest.fn()
    const stopSpinner = jest.fn()
    wrapper.setMethods({
      raiseMessage,
      raiseError,
      startSpinner,
      stopSpinner
    })
    // Методы были вызваны
    eventBus.emit(eventBus.events.message, 'message')
    expect(raiseMessage).toBeCalled()
    expect(raiseMessage).toBeCalledWith('message')

    eventBus.emit(eventBus.events.error, 'error')
    expect(raiseError).toBeCalled()
    expect(raiseError).toBeCalledWith('error')

    eventBus.emit(eventBus.events.busy)
    expect(startSpinner).toBeCalled()

    eventBus.emit(eventBus.events.idle)
    expect(stopSpinner).toBeCalled()
  })
  it('should compute path var', () => {
    expect(wrapper.vm.path).toEqual([{ 'text': 'Начало', 'to': '/' }])
    eventBus.emit(eventBus.events.path, ['0ne', 'two'])
    expect(wrapper.vm.path).toEqual([{ 'text': 'Начало', 'to': '/' }, { 'disabled': true, 'text': '0ne' }, { 'disabled': true, 'text': 'two' }])
    wrapper.vm.$route.meta.path = ['Three', { 'text': 'four', to: 'north' }]
    expect(wrapper.vm.routePath()).toEqual([{ 'text': 'Начало', 'to': '/' }, { 'disabled': true, 'text': 'Three' }, { 'text': 'four', 'to': 'north' }])
  })
})
