import { PageDecor } from '../decor/Decorations'

/**
 * One physical page. `side` controls the gutter shading (left / right of the
 * spine, or a single page on mobile). Content scrolls inside the page.
 */
export function Paper({ side = 'single', seed, number, ruled = true, margin = true, decor = true, variant = 'paper', children, className = '' }) {
  if (variant === 'endpaper') {
    return (
      <div className={`endpaper relative h-full w-full overflow-hidden paper-${side} ${className}`}>
        {children}
      </div>
    )
  }
  const padLeft = margin ? 'pl-[64px]' : 'pl-8'
  return (
    <div className={`paper paper-${side} h-full w-full ${margin ? 'margin-line' : ''} ${className}`}>
      {decor && seed && <PageDecor seed={seed} side={side} />}
      <div
        className={`page-scroll relative z-10 h-full overflow-y-auto overflow-x-hidden pt-[22px] pb-14 pr-6 sm:pr-8 ${padLeft} ${ruled ? 'ruled' : ''}`}
      >
        {children}
      </div>
      {number != null && (
        <div
          className={`pointer-events-none absolute bottom-3 z-10 font-serif text-sm italic text-faded ${
            side === 'left' ? 'left-6' : 'right-6'
          }`}
        >
          {number}
        </div>
      )}
    </div>
  )
}

/** The plain reverse of a page, seen while it turns on mobile. */
export function BlankPage({ side = 'single' }) {
  return <Paper side={side} ruled={false} margin={false} decor={false} />
}
