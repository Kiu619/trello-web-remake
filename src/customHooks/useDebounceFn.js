import { useCallback } from 'react'
import { debounce } from 'lodash'

/**
 * Custom hook for debouncing a function, accepts two parameters: the function to debounce and the delay time.
 */
export const useDebounceFn = (fnToDebounce, delay = 500) => {
  // Throw an error if the delay is not a number
  if (isNaN(delay)) {
    throw new Error('Delay value should be a number.')
  }
  // Throw an error if fnToDebounce is not a function
  if (!fnToDebounce || (typeof fnToDebounce !== 'function')) {
    throw new Error('Debounce must have a function')
  }

  // Wrap the debounce execution from lodash
  // Use useCallback to avoid re-rendering multiple times, only re-render when fnToDebounce or delay changes
  return useCallback((...args) => debounce(fnToDebounce, delay)(...args), [fnToDebounce, delay])
}
