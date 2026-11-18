import { useEffect, useState } from 'react'
import TimerView from './TimerView.jsx'

export default function BrewTimer({ method }) {
  const [secondsLeft, setSecondsLeft] = useState(method.seconds)
  const [isRunning, setIsRunning] = useState(false)

  useEffect(() => {
    if (!isRunning) return
    setInterval(() => {
      setSecondsLeft(secondsLeft - 1)
    }, 1000)
  }, [isRunning])

  const status =
    secondsLeft === 0
      ? 'done'
      : isRunning
        ? 'running'
        : secondsLeft === method.seconds
          ? 'idle'
          : 'paused'

  return (
    <TimerView
      method={method}
      secondsLeft={secondsLeft}
      status={status}
      onStart={() => setIsRunning(true)}
      onPause={() => setIsRunning(false)}
      onReset={() => {
        setIsRunning(false)
        setSecondsLeft(method.seconds)
      }}
    />
  )
}
