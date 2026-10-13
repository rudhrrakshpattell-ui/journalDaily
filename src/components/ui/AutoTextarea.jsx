import { useLayoutEffect, useRef } from 'react'

/** A textarea that grows a ruled line at a time as you write. */
export function AutoTextarea({ value, onChange, minLines = 3, className = '', ...rest }) {
  const ref = useRef(null)
  useLayoutEffect(() => {
    const el = ref.current
    if (!el) return
    const rule = parseFloat(getComputedStyle(el).lineHeight) || 30
    el.style.height = 'auto'
    el.style.height = `${Math.max(minLines, Math.ceil(el.scrollHeight / rule)) * rule}px`
  }, [value, minLines])
  return (
    <textarea
      ref={ref}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      rows={minLines}
      className={`hand-input block overflow-hidden ${className}`}
      {...rest}
    />
  )
}
