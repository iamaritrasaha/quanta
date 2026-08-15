import React from 'react'

export interface InstrumentFooterProps {
  text: string
}

export function InstrumentFooter({ text }: InstrumentFooterProps) {
  return (
    <footer className="diagram-instrument-footer">
      <span>{text}</span>
    </footer>
  )
}
