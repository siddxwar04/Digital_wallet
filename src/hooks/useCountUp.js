import { useEffect, useRef, useState } from 'react'
import { useReducedMotion } from './useReducedMotion'

/**
 * Counts toward `target`. The effect depends only on `target` (and motion prefs),
 * so parent re-renders that leave the balance unchanged do not restart the animation.
 */
export function useCountUp(target, duration = 800) {
  const reducedMotion = useReducedMotion()
  const [value, setValue] = useState(0)
  const previousRef = useRef(0)

  useEffect(() => {
    const next = Number(target) || 0

    if (reducedMotion) {
      setValue(next)
      previousRef.current = next
      return
    }

    const from = previousRef.current
    let startTimestamp = null
    let frameId

    const step = (timestamp) => {
      if (startTimestamp === null) startTimestamp = timestamp
      const progress = Math.min((timestamp - startTimestamp) / duration, 1)
      const eased = 1 - (1 - progress) ** 3
      setValue(Math.round(from + (next - from) * eased))

      if (progress < 1) {
        frameId = requestAnimationFrame(step)
      } else {
        previousRef.current = next
      }
    }

    frameId = requestAnimationFrame(step)
    return () => cancelAnimationFrame(frameId)
  }, [target, duration, reducedMotion])

  return value
}
