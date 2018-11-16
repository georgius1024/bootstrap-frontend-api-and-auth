const validationRules = {
  fieldIsRequired: (value) => Boolean(value) || 'Это поле должно быть заполнено',
  passwordIsRequired: (value) => Boolean(value) || 'Введите пароль',
  passwordMustBeAtLeast6Chars: (value) => (Boolean(value) && value.length >= 6) || 'Пароль не короче 6 знаков',
  passwordMustBeAtLeast8Chars: (value) => (Boolean(value) && value.length >= 8) || 'Пароль не короче 8 знаков',
  confirmPasswordIsRequired: (value) => Boolean(value) || 'Введите подтверждение пароля',
  emailIsRequired: (value) => Boolean(value) || 'Введите Email',
  /* eslint-disable no-useless-escape */
  emailMustBeValid: (value) => /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(value) || 'Неверный E-mail',
  urlMustBeValid: (value) => /^(?:(?:(?:https?|ftp):)?\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:[/?#]\S*)?$/i.test(value) || 'Неверный url',
  nameIsRequired: (value) => {
    return Boolean(value) || 'Введите имя'
  },
  numericValueRequired: (value) => {
    return Boolean(Number(value)) || 'Введите значение'
  }
}

// Следующие две функции создают функции-валидаторы длины
validationRules.maximumLength = (len) => {
  return (value) => {
    return String(value).length <= len || 'Значение не должно быть длиннее, чем ' + len + ' знаков'
  }
}
validationRules.minimumLength = (len) => {
  return (value) => {
    return String(value).length >= len || 'Значение не должно быть короче, чем ' + len + ' знаков'
  }
}

validationRules.mustBeLongText = (value) => {
  if (value) {
    return String(value).length >= 6 || 'Ожидается более длинная строка'
  } else {
    return validationRules.fieldIsRequired(value)
  }
}

export default validationRules
