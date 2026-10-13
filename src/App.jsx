import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { JournalProvider, useJournal } from './hooks/useJournal'
import { BookNavContext } from './hooks/useBookNav'
import { useIsDesktop } from './hooks/useMediaQuery'
import { Book } from './components/book/Book'
import { ClosedBook } from './components/book/Cover'
import { Paper } from './components/book/Paper'
import { TitlePage } from './components/pages/FrontPages'
import { buildSpread } from './components/Spreads'
import { DeskControls, MobileBar, PageCorner, Ribbon, ThumbTabs } from './components/Chrome'
import { PrintJournal } from './components/PrintJournal'
import { compareLocations, locationKey, nextLocation, prevLocation } from './lib/locations'
import { todayKey, year } from './lib/dates'

function Journal() {
  const { ready, list, settings, updateSettings } = useJournal()
  const isDesktop = useIsDesktop()
  const [phase, setPhase] = useState('closed') // closed | open
  const [location, setLocation] = useState({ view: 'front' })
  const [lastSaved, setLastSaved] = useState(null)
  const [query, setQuery] = useState({ text: '', tag: '' })
  const dates = useMemo(() => list.map((e) => e.date), [list])

  const go = useCallback((loc, opts) => {
    if (opts?.tag !== undefined) setQuery({ text: '', tag: opts.tag })
    setLastSaved(null)
    setLocation(loc)
  }, [])

  const next = nextLocation(location, dates)
  const prev = prevLocation(location, dates)
  const goNext = useCallback(() => next && go(next), [next, go])
  const goPrev = useCallback(() => prev && go(prev), [prev, go])

  // Keyboard: ← → turn pages unless you're writing.
  useEffect(() => {
    if (phase !== 'open') return
    const onKey = (e) => {
      if (e.target.closest('input, textarea, [contenteditable]')) return
      if (e.key === 'ArrowRight') goNext()
      if (e.key === 'ArrowLeft') goPrev()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [phase, goNext, goPrev])

  // Swipe on touch screens.
  const touch = useRef(null)
  const onTouchStart = (e) => {
    const t = e.touches[0]
    touch.current = { x: t.clientX, y: t.clientY }
  }
  const onTouchEnd = (e) => {
    if (!touch.current) return
    const t = e.changedTouches[0]
    const dx = t.clientX - touch.current.x
    const dy = t.clientY - touch.current.y
    touch.current = null
    if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy) * 1.5) {
      if (e.target.closest('textarea, input')) return
      if (dx < 0) goNext()
      else goPrev()
    }
  }

  const onOpened = () => {
    setLocation({ view: 'front' })
    setPhase('open')
    // After a breath on the title page, turn to today.
    setTimeout(() => setLocation({ view: 'day', date: todayKey() }), 650)
  }

  const nav = useMemo(() => ({ go, lastSaved, setLastSaved, query, setQuery }), [go, lastSaved, query])
  const getSpread = useCallback((loc) => buildSpread(loc, { isDesktop, dates, owner: settings.owner }), [isDesktop, dates, settings.owner])
  const coverYear = list[0] ? year(list[0].date) : new Date().getFullYear()
  const isToday = location.view === 'day' && location.date === todayKey()

  if (!ready) return null

  return (
    <BookNavContext.Provider value={nav}>
      <main className="screen-only flex h-full flex-col items-center justify-center overflow-hidden px-[10px] pb-2 pt-14 lg:pt-4">
        <DeskControls
          muted={settings.muted}
          onToggleMute={() => updateSettings({ muted: !settings.muted })}
          onClose={phase === 'open' ? () => setPhase('closed') : null}
        />
        {phase === 'closed' ? (
          <ClosedBook
            isDesktop={isDesktop}
            owner={settings.owner}
            year={coverYear}
            onOpened={onOpened}
            underneath={
              <Paper side={isDesktop ? 'right' : 'single'} ruled={false} margin={false} decor={false}>
                <TitlePage />
              </Paper>
            }
          />
        ) : (
          <>
            <div className="relative" onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
              <Book location={location} locationKey={locationKey} getSpread={getSpread} compare={compareLocations} isDesktop={isDesktop}>
                {isDesktop && prev && <PageCorner side="left" onClick={goPrev} label="Turn back a page" />}
                {isDesktop && next && <PageCorner side="right" onClick={goNext} label="Turn the page" />}
              </Book>
              <Ribbon isDesktop={isDesktop} isToday={isToday} onToday={() => go({ view: 'day', date: todayKey() })} />
              {isDesktop && <ThumbTabs location={location} go={go} />}
            </div>
            {!isDesktop && <MobileBar location={location} go={go} onPrev={goPrev} onNext={goNext} canPrev={Boolean(prev)} canNext={Boolean(next)} />}
          </>
        )}
      </main>
      <PrintJournal />
    </BookNavContext.Provider>
  )
}

export default function App() {
  return (
    <JournalProvider>
      <Journal />
    </JournalProvider>
  )
}
