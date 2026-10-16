import { useEffect, useRef, useState } from 'react'
import { categorize } from '../api/insights'

const MIN_CHARS = 2
const MAX_CHARS = 200

export function useDebouncedCategorize(description, debounceMs = 500) {
  const [predictedCategory, setPredictedCategory] = useState(null)
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [source, setSource] = useState(null)
  const isOverriddenRef = useRef(false)
  const requestIdRef = useRef(0)

  useEffect(() => {
    isOverriddenRef.current = false
  }, [description])

  useEffect(() => {
    const trimmed = description.trim()

    if (!trimmed || trimmed.length < MIN_CHARS) {
      setPredictedCategory(null)
      setSelectedCategory(null)
      setSource(null)
      setIsLoading(false)
      return
    }

    const payload = trimmed.slice(0, MAX_CHARS)
    setIsLoading(true)
    const requestId = ++requestIdRef.current

    const timer = setTimeout(async () => {
      try {
        const result = await categorize(payload)
        if (requestId !== requestIdRef.current) return

        setPredictedCategory(result.category)
        setSource(result.source)

        if (!isOverriddenRef.current) {
          setSelectedCategory(result.category)
        }
      } catch {
        if (requestId !== requestIdRef.current) return
        setPredictedCategory(null)
        if (!isOverriddenRef.current) setSelectedCategory(null)
      } finally {
        if (requestId === requestIdRef.current) setIsLoading(false)
      }
    }, debounceMs)

    return () => {
      clearTimeout(timer)
    }
  }, [description, debounceMs])

  function overrideCategory(category) {
    isOverriddenRef.current = true
    setSelectedCategory(category)
  }

  return {
    predictedCategory,
    selectedCategory,
    isLoading,
    source,
    overrideCategory,
    isOverridden: isOverriddenRef.current,
  }
}
