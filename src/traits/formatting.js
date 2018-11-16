/* Позволяет использовать следующие фильтры:
  dateTime
  date
  time
  localDateTime
  localDate
  localTime
  moscowDateTime
  moscowDate
  moscowTime
  duration
  bytes
  questions
  attempts
  hours
  minutes
  seconds
  shorten20
  shorten40
  shorten60
  shorten80
*/
'use strict'
import dayjs from 'dayjs'
const _truncate = require('lodash.truncate')
const _padStart = require('lodash.padstart')

const moscowTimeOffset = -3 * 60
const localTimeZoneOffset = new Date().getTimezoneOffset()

function formatBytes (a, b) {
  a = parseFloat(a)
  if (a === 0) return '0 Байт'
  let c = 1024
  let d = b || 2
  let e = ['Байт', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
  let f = Math.floor(Math.log(a) / Math.log(c))
  return parseFloat((a / Math.pow(c, f)).toFixed(d)) + ' ' + e[f]
}

function shortenStr (value, length) {
  return _truncate(value, {
    separator: /,\.;\? +/,
    length
  })
}

function zeroPad (value, len) {
  return _padStart(value, len, '0')
}

function getMonthDateName (month) {
  const monthNames = [
    'января',
    'февраля',
    'марта',
    'апреля',
    'мая',
    'июня',
    'июля',
    'августа',
    'сентября',
    'октября',
    'ноября',
    'декабря'
  ]
  return monthNames[month]
}
function getMonthName (month) {
  const monthNames = [
    'январь',
    'февраль',
    'март',
    'апрель',
    'май',
    'июнь',
    'июль',
    'август',
    'сентябрь',
    'октябрь',
    'ноябрь',
    'декабрь'
  ]
  return monthNames[month]
}
function utcToLocal (date) {
  return dayjs(date).subtract(localTimeZoneOffset, 'minute').toDate()
}
function localToUtc (date) {
  return dayjs(date).add(localTimeZoneOffset, 'minute').toDate()
}
function utcToMoscow (date) {
  return dayjs(date).subtract(moscowTimeOffset, 'minute').toDate()
}
function localToMoscow (date) {
  return dayjs(date).add(localTimeZoneOffset - moscowTimeOffset, 'minute').toDate()
}

function _quantity (value, one, few, many) {
  if (value % 100 < 20 && value % 100 > 10) {
    return value + ' ' + many
  } else {
    switch (value % 10) {
      case 1:
        return value + ' ' + one
      case 2:
      case 3:
      case 4:
        return value + ' ' + few
      default:
        return value + ' ' + many
    }
  }
}
function questions (value) {
  return _quantity(value, 'вопрос', 'вопроса', 'вопросов')
}

function attempts (value) {
  return _quantity(value, 'попытка', 'попытки', 'попыток')
}

function hours (value) {
  return _quantity(value, 'час', 'часа', 'часов')
}

function minutes (value) {
  return _quantity(value, 'минута', 'минуты', 'минут')
}

function seconds (value) {
  return _quantity(value, 'секунда', 'секунды', 'секунд')
}

export default {
  filters: {
    date (value) {
      if (value) {
        return dayjs(value).format('DD.MM.YYYY')
      } else {
        return ''
      }
    },
    dateTime (value) {
      if (value) {
        return dayjs(value).format('DD.MM.YYYY HH:mm')
      } else {
        return ''
      }
    },
    time (value) {
      if (value) {
        return dayjs(value).format('HH:mm')
      } else {
        return ''
      }
    },
    localDateTime (value) {
      if (value) {
        return dayjs(utcToLocal(value)).format('DD.MM.YYYY HH:mm')
      } else {
        return ''
      }
    },
    localDate (value) {
      if (value) {
        return dayjs(utcToLocal(value)).format('DD.MM.YYYY')
      } else {
        return ''
      }
    },
    localTime (value) {
      if (value) {
        return dayjs(utcToLocal(value)).format('HH:mm')
      } else {
        return ''
      }
    },
    literalDate (value) {
      let m = dayjs(value)
      let result = []
      result.push(m.format('DD'))
      result.push(getMonthDateName(m.month()))
      result.push(m.format('YYYY'))
      return result.join(' ')
    },
    bytes (value) {
      return formatBytes(value)
    },
    questions (value) {
      return questions(value)
    },
    attempts (value) {
      return attempts(value)
    },
    hours (value) {
      return hours(value)
    },
    minutes (value) {
      return minutes(value)
    },
    seconds (value) {
      return seconds(value)
    },
    shorten20 (value) {
      return shortenStr(value, 20)
    },
    shorten40 (value) {
      return shortenStr(value, 40)
    },
    shorten60 (value) {
      return shortenStr(value, 60)
    },
    shorten80 (value) {
      return shortenStr(value, 80)
    }
  },
  methods: {
    getMonthDateName (month) {
      return getMonthDateName(month)
    },
    getMonthName (month) {
      return getMonthName(month)
    },
    utcToLocal (date) {
      return utcToLocal(date)
    },
    localToUtc (date) {
      return localToUtc(date)
    },
    utcToMoscow (date) {
      return utcToMoscow(date)
    },
    localToMoscow (date) {
      return localToMoscow(date)
    },
    formatDateTime (date) {
      return dayjs(date).format('DD.MM.YYYY HH:mm')
    },
    formatDate (date) {
      return dayjs(date).format('DD.MM.YYYY')
    },
    formatTime (date) {
      return dayjs(date).format('HH:mm')
    },
    questionsCount (value) {
      return questions(value)
    },
    attemptsCount (value) {
      return attempts(value)
    },
    hoursCount (value) {
      return hours(value)
    },
    minutesCount (value) {
      return minutes(value)
    },
    secondsCount (value) {
      return seconds(value)
    },
    shorten (value, len) {
      return shortenStr(value, len)
    },
    zeroPad (value, len) {
      return zeroPad(value, len)
    }
  }
}
