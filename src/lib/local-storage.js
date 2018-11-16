export function hasStored (key) {
  return Boolean(localStorage.getItem(key))
}

export function getStored (key, defVal) {
  if (hasStored(key)) {
    try {
      return JSON.parse(localStorage.getItem(key))
    } catch (e) {
      return defVal
    }
  } else {
    return defVal
  }
}

export function putStored (key, value) {
  localStorage.setItem(key, JSON.stringify(value))
}

export function deleteStored (key) {
  localStorage.removeItem(key)
}

export function deleteAll () {
  localStorage.clear()
}
