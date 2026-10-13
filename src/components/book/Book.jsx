import { useEffect, useRef, useState } from 'react'
import { playPageTurn } from '../../lib/sound'
import { BlankPage } from './Paper'

/**
 * Renders the open book and animates a turning leaf whenever `location`
 * changes. `getSpread(location)` returns { left, right } page elements on
 * desktop or { single } on mobile. `compare(a, b)` orders two locations so we
 * know which way to turn.
 */
export function Book({ location, locationKey, getSpread, compare, isDesktop, children }) {
  const [shown, setShown] = useState(location)
  const [flip, setFlip] = useState(null)
  const flipId = useRef(0)
  const shownKey = locationKey(shown)
  const targetKey = locationKey(location)

  useEffect(() => {
    if (targetKey === shownKey && !flip) return
    if (flip && locationKey(flip.to) === targetKey) return
    const from = flip ? flip.to : shown
    if (locationKey(from) === targetKey) return
    const dir = compare(location, from) >= 0 ? 'forward' : 'back'
    playPageTurn()
    flipId.current += 1
    setShown(from)
    setFlip({ from, to: location, dir, id: flipId.current })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [targetKey])

  const finish = (e) => {
    if (e && e.target !== e.currentTarget) return
    setShown(flip.to)
    setFlip(null)
  }

  // Safety net in case animationend never fires (tab hidden etc.).
  useEffect(() => {
    if (!flip) return
    const t = setTimeout(() => {
      setShown(flip.to)
      setFlip(null)
    }, 1600)
    return () => clearTimeout(t)
  }, [flip])

  if (isDesktop) {
    const cur = getSpread(flip ? flip.from : shown)
    const next = flip ? getSpread(flip.to) : null
    let left = cur.left
    let right = cur.right
    let leaf = null
    if (flip && flip.dir === 'forward') {
      right = next.right
      leaf = (
        <div key={flip.id} className="leaf flip-forward left-1/2 w-1/2" onAnimationEnd={finish}>
          <div className="leaf-face">
            {cur.right}
            <div className="leaf-shade shade-out" />
          </div>
          <div className="leaf-face leaf-back">
            {next.left}
            <div className="leaf-shade shade-in" style={{ transform: 'scaleX(-1)' }} />
          </div>
        </div>
      )
    } else if (flip) {
      left = next.left
      leaf = (
        <div key={flip.id} className="leaf flip-back left-0 w-1/2" onAnimationEnd={finish}>
          <div className="leaf-face">
            {cur.left}
            <div className="leaf-shade shade-out" style={{ transform: 'scaleX(-1)' }} />
          </div>
          <div className="leaf-face leaf-back">
            {next.right}
            <div className="leaf-shade shade-in" />
          </div>
        </div>
      )
    }

    return (
      <div className="book-stage relative" style={{ width: 'calc(var(--page-w) * 2)', height: 'var(--page-h)' }}>
        <BookBoards />
        <div className="absolute inset-y-0 left-0 w-1/2">{left}</div>
        <div className="absolute inset-y-0 right-0 w-1/2">{right}</div>
        {flip && (
          <div
            key={`shadow-${flip.id}`}
            className={`cast-shadow pointer-events-none absolute inset-y-0 z-20 w-1/2 ${flip.dir === 'forward' ? 'right-0' : 'left-0'}`}
            style={{
              background:
                flip.dir === 'forward'
                  ? 'linear-gradient(to right, rgba(30,15,5,.4), transparent 45%)'
                  : 'linear-gradient(to left, rgba(30,15,5,.4), transparent 45%)',
            }}
          />
        )}
        {leaf}
        <Spine />
        {children}
      </div>
    )
  }

  const cur = getSpread(flip ? flip.from : shown)
  const next = flip ? getSpread(flip.to) : null
  return (
    <div className="relative overflow-hidden" style={{ width: 'var(--page-w)', height: 'var(--page-h)' }}>
      <div className="book-stage relative h-full w-full">
        <div className="absolute inset-0 rounded-r-md" style={{ boxShadow: '3px 3px 0 #e6d9bb, 6px 6px 0 #d8c8a2, 0 18px 40px rgba(0,0,0,.55)' }} />
        <div className="absolute inset-0">{flip && flip.dir === 'forward' ? next.single : cur.single}</div>
        {flip && (
          <div
            key={flip.id}
            className={`leaf left-0 w-full ${flip.dir === 'forward' ? 'flip-forward' : 'flip-in-single'}`}
            onAnimationEnd={finish}
          >
            <div className="leaf-face">
              {flip.dir === 'forward' ? cur.single : next.single}
              <div className={`leaf-shade ${flip.dir === 'forward' ? 'shade-out' : 'shade-in'}`} />
            </div>
            <div className="leaf-face leaf-back">
              <BlankPage />
            </div>
          </div>
        )}
        {children}
      </div>
    </div>
  )
}

/** Leather boards and fore-edges peeking out behind the pages. */
export function BookBoards() {
  return (
    <>
      <div className="leather absolute -inset-x-[14px] -inset-y-[12px] rounded-[10px]" style={{ boxShadow: '0 30px 60px rgba(0,0,0,.6), 0 8px 18px rgba(0,0,0,.5)' }} />
      <div
        className="absolute inset-0"
        style={{
          boxShadow:
            '-2px 2px 0 #eadfc4, -4px 4px 0 #dccfae, -6px 5px 0 #e6dabd, 2px 2px 0 #eadfc4, 4px 4px 0 #dccfae, 6px 5px 0 #e6dabd',
        }}
      />
    </>
  )
}

export function Spine() {
  return (
    <div
      className="pointer-events-none absolute inset-y-0 left-1/2 z-40 w-10 -translate-x-1/2"
      style={{
        background:
          'linear-gradient(to right, transparent, rgba(50,28,8,.18) 35%, rgba(30,15,3,.42) 50%, rgba(50,28,8,.18) 65%, transparent)',
      }}
    >
      {/* Binding thread visible in the gutter. */}
      {[12, 37, 63, 88].map((top) => (
        <div key={top} className="absolute left-1/2 h-4 w-[2px] -translate-x-1/2 rounded bg-[#e8dcc0]/70" style={{ top: `${top}%` }} />
      ))}
    </div>
  )
}
