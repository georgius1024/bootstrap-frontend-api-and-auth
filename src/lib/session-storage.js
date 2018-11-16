export function hasStored (key) {
  return Boolean(sessionStorage.getItem(key))
}

export function getStored (key, defVal) {
  if (hasStored(key)) {
    try {
      return JSON.parse(sessionStorage.getItem(key))
    } catch (e) {
      console.log(`Error parsing "${key}": ${e}`)
      return defVal
    }
  } else {
    return defVal
  }
}

export function putStored (key, value) {
  sessionStorage.setItem(key, JSON.stringify(value))
}

export function deleteStored (key) {
  sessionStorage.removeItem(key)
}

export function deleteAll (key) {
  sessionStorage.clear()
}
