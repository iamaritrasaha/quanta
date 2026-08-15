import katex from 'katex'
import { useMemo } from 'react'

interface EquationProps {
  children: string
  block?: boolean
  className?: string
}

export function Equation({ children, block = false, className = '' }: EquationProps) {
  const html = useMemo(() => {
    try {
      return katex.renderToString(children, {
        throwOnError: false,
        displayMode: block,
        strict: false,
      })
    } catch (err) {
      console.warn('KaTeX rendering error for equation:', children, err)
      return children
    }
  }, [children, block])

  return (
    <span
      className={`equation ${block ? 'equation-block' : 'equation-inline'} ${className}`}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  )
}
