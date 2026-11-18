import { useEffect, useRef, useState } from 'react'

/**
 * Зворотний відлік від `totalSeconds` до нуля, по секунді.
 *
 * Використання:
 *   const { secondsLeft, isRunning, start, pause, reset } = useCountdown(180)
 *
 * Вимоги — у тестах tests/useCountdown.test.jsx.
 */
export function useCountdown(totalSeconds) {
  const [secondsLeft, setSecondsLeft] = useState(totalSeconds)
  const [isRunning, setIsRunning] = useState(false)
  const secondsRef = useRef(totalSeconds)

  useEffect(() => {
    if (!isRunning) return

    const intervalId = setInterval(() => {
      const next = Math.max(0, secondsRef.current - 1)
      secondsRef.current = next
      setSecondsLeft(next)

      if (next === 0) {
        setIsRunning(false)
        clearInterval(intervalId)
      }
    }, 1000)

    return () => clearInterval(intervalId)
  }, [isRunning])

  function start() {
    if (secondsRef.current === 0) return
    setIsRunning(true)
  }

  function pause() {
    setIsRunning(false)
  }

  function reset() {
    setIsRunning(false)
    secondsRef.current = totalSeconds
    setSecondsLeft(totalSeconds)
  }

  return { secondsLeft, isRunning, start, pause, reset }
}
