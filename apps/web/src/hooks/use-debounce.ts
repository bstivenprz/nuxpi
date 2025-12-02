import React from 'react'

type UseDebounceInputReturn = {
  value: string
  debouncedValue: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  setValue: React.Dispatch<React.SetStateAction<string>>
}

/**
 * Hook para controlar un input y aplicar debounce al valor.
 * @param initialValue Valor inicial del input.
 * @param delay Tiempo de debounce en ms (por defecto 300ms).
 */
export function useDebounceInput(
  initialValue: string = '',
  delay: number = 300
): UseDebounceInputReturn {
  const [value, setValue] = React.useState(initialValue)
  const [debouncedValue, setDebouncedValue] = React.useState(initialValue)

  React.useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => {
      clearTimeout(handler)
    }
  }, [value, delay])

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value)
  }

  return { value, debouncedValue, onChange, setValue }
}
