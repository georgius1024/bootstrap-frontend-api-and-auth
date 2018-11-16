/*******************
 * Шина событий для приложения
 */
import EventEmitter from 'eventemitter3'
const eventBus = new EventEmitter()
const events = {
  busy: 'busy', // приложение занято - включить крутилку
  idle: 'idle', // приложение интерактивно - выключить крутилку
  login: 'login', // пользователь вошел, надо адаптировать интерфейс
  logout: 'logout', // пользователь вышел, ничего недоступно
  restore: 'restore', // пользователь восстановлен из прошлой сессии
  credentials: 'credentials', // смена токенов
  error: 'app-error', // случилась ошибка (показать попап)
  message: 'app-message', // пришло сообщение (показать тостер)
  path: 'path' // информация о текущем пути
}
eventBus.events = Object.freeze(events)

eventBus.message = function (message) {
  eventBus.emit(eventBus.events.message, message)
}
eventBus.error = function (message) {
  eventBus.emit(eventBus.events.error, message)
}

export default eventBus
