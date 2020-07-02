import { useCallback, useRef, useState } from 'react'

export function useNodeHeight() {
  const [height, setHeight] = useState(0)
  const nodeObserver = useRef(null)

  const customRef = useCallback(node => {
    if (nodeObserver.current) {
      nodeObserver.current.disconnect()
    }

    if (node) {
      setHeight(node.clientHeight)
      nodeObserver.current = new ResizeObserver(entries => {
        const { height } = entries[0].contentRect
        setHeight(height)
      })

      nodeObserver.current.observe(node)
    }
  }, [])

  return [height, customRef]
}
