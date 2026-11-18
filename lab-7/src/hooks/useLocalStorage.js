import { useEffect, useState } from 'react'

/**
 * Стан, що зберігається в localStorage під ключем `key` у форматі JSON.
 *
 * Використання, як у useState:
 *   const [value, setValue] = useLocalStorage('grind', 'beans')
 *
 * Вимоги — у тестах tests/useLocalStorage.test.jsx.
 */
export function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    const stored = localStorage.getItem(key)
    if (stored === null) return initialValue

    try {
      return JSON.parse(stored)
    } catch {
      return initialValue
    }
  })

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value))
  }, [key, value])

  function setStoredValue(nextValue) {
    setValue((current) =>
      typeof nextValue === 'function' ? nextValue(current) : nextValue,
    )
  }

  return [value, setStoredValue]
}
