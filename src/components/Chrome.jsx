import { todayKey } from '../lib/dates'

const TABS = [
  { label: 'Today', loc: () => ({ view: 'day', date: todayKey() }), match: (l) => l.view === 'day' && l.date === todayKey(), color: '#7a2230' },
  { label: 'Compare', loc: () => ({ view: 'compare' }), match: (l) => l.view === 'compare', color: '#2f4a3a' },
  { label: 'Progress', loc: () => ({ view: 'progress', page: 0 }), match: (l) => l.view === 'progress', color: '#3a4a6b' },
  { label: 'Index', loc: () => ({ view: 'index' }), match: (l) => l.view === 'index', color: '#6b4a2b' },
]

/** Leather thumb tabs sticking out of the fore-edge (desktop). */
export function ThumbTabs({ location, go }) {
  return (
    <nav className="absolute left-full top-[8%] z-0 ml-[10px] flex flex-col gap-3" aria-label="Sections">
      {TABS.map((t) => (
        <button
          key={t.label}
          type="button"
          onClick={() => go(t.loc())}
          aria-current={t.match(location) ? 'page' : undefined}
          className="thumb-tab leather relative -ml-4 w-[86px] rounded-r-md py-3 pl-6 pr-2 text-left font-serif-sc text-[0.8rem] tracking-[0.12em] text-[#f0d9a8] shadow-[3px_3px_6px_rgba(0,0,0,.45)]"
          style={{ backgroundColor: t.color }}
        >
          {t.label}
        </button>
      ))}
    </nav>
  )
}

/** Bottom bar of tabs and arrows on phones. */
export function MobileBar({ location, go, onPrev, onNext, canPrev, canNext }) {
  return (
    <nav className="mt-3 flex w-full items-center justify-between gap-1 px-1" aria-label="Sections">
      <button type="button" onClick={onPrev} disabled={!canPrev} aria-label="Previous page" className="grid h-10 w-10 place-items-center font-hand text-3xl text-[#f0d9a8] disabled:opacity-25">
        ‹
      </button>
      <div className="flex flex-1 justify-center gap-1">
        {TABS.map((t) => (
          <button
            key={t.label}
            type="button"
            onClick={() => go(t.loc())}
            aria-current={t.match(location) ? 'page' : undefined}
            className="leather rounded-b-md px-2.5 pb-1.5 pt-2 font-serif-sc text-[0.72rem] tracking-[0.08em] text-[#f0d9a8] transition aria-[current=page]:translate-y-1 aria-[current=page]:brightness-125"
            style={{ backgroundColor: t.color }}
          >
            {t.label}
          </button>
        ))}
      </div>
      <button type="button" onClick={onNext} disabled={!canNext} aria-label="Next page" className="grid h-10 w-10 place-items-center font-hand text-3xl text-[#f0d9a8] disabled:opacity-25">
        ›
      </button>
    </nav>
  )
}

/** A dog-eared corner you can grab to turn the page. */
export function PageCorner({ side, onClick, label }) {
  const isRight = side === 'right'
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      title={label}
      className={`group absolute bottom-0 z-40 h-16 w-16 ${isRight ? 'right-0' : 'left-0'}`}
    >
      <span
        className="absolute bottom-0 h-7 w-7 transition-all duration-300 group-hover:h-12 group-hover:w-12"
        style={{
          [isRight ? 'right' : 'left']: 0,
          background: isRight
            ? 'linear-gradient(135deg, #e9dcbc 0%, #f6ecd4 45%, rgba(0,0,0,.25) 50%, transparent 52%)'
            : 'linear-gradient(225deg, #e9dcbc 0%, #f6ecd4 45%, rgba(0,0,0,.25) 50%, transparent 52%)',
          transform: 'rotate(180deg)',
          boxShadow: isRight ? '-2px -2px 5px rgba(0,0,0,.2)' : '2px -2px 5px rgba(0,0,0,.2)',
        }}
      />
    </button>
  )
}

/** The satin ribbon bookmark. It lies in the gutter on today's page; click to return to today. */
export function Ribbon({ onToday, isToday, isDesktop }) {
  return (
    <div className={`pointer-events-none absolute z-50 ${isDesktop ? 'left-1/2 top-[-12px] -translate-x-1/2' : 'right-8 top-[-6px]'}`} style={{ height: 'calc(100% + 80px)' }}>
      {isToday && isDesktop && (
        <div className="absolute left-1/2 top-0 h-[calc(100%-80px)] w-[12px] -translate-x-1/2" style={{ background: 'linear-gradient(to right, #6e0f1b, #a4253a 45%, #7c1220)', boxShadow: '1px 0 3px rgba(0,0,0,.35)' }} />
      )}
      <button
        type="button"
        onClick={onToday}
        aria-label="Ribbon bookmark: turn to today"
        title="Turn to today"
        className="ribbon-tail pointer-events-auto absolute left-1/2 w-[12px] -translate-x-1/2"
        style={{ top: 'calc(100% - 92px)', height: 92 }}
      >
        <span
          className="block h-full w-full"
          style={{
            background: 'linear-gradient(to right, #6e0f1b, #a4253a 45%, #7c1220)',
            clipPath: 'polygon(0 0, 100% 0, 100% 100%, 50% 86%, 0 100%)',
            filter: 'drop-shadow(1px 2px 2px rgba(0,0,0,.4))',
          }}
        />
      </button>
    </div>
  )
}

export function DeskControls({ muted, onToggleMute, onClose }) {
  return (
    <div className="fixed right-3 top-3 z-50 flex gap-2">
      <button
        type="button"
        onClick={onToggleMute}
        aria-pressed={!muted}
        aria-label={muted ? 'Turn page sounds on' : 'Mute page sounds'}
        title={muted ? 'Sound off' : 'Sound on'}
        className="grid h-10 w-10 place-items-center rounded-full border border-[#c9a24a]/60 bg-[#2a170d]/80 text-[#e8cb7a] shadow-lg hover:bg-[#3b2015]"
      >
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" aria-hidden>
          <path d="M4 9 H8 L13 5 V19 L8 15 H4 Z" fill="currentColor" fillOpacity=".25" />
          {muted ? <path d="M16 9 L21 14 M21 9 L16 14" /> : <path d="M16 8.5 C18 10 18 14 16 15.5 M18.5 6 C22 9 22 15 18.5 18" />}
        </svg>
      </button>
      {onClose && (
        <button
          type="button"
          onClick={onClose}
          aria-label="Close the journal"
          title="Close the journal"
          className="grid h-10 w-10 place-items-center rounded-full border border-[#c9a24a]/60 bg-[#2a170d]/80 text-[#e8cb7a] shadow-lg hover:bg-[#3b2015]"
        >
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" aria-hidden>
            <path d="M5 4 H17 A2 2 0 0 1 19 6 V20 H7 A2 2 0 0 1 5 18 Z" fill="currentColor" fillOpacity=".25" />
            <path d="M5 18 A2 2 0 0 1 7 16 H19" />
          </svg>
        </button>
      )}
    </div>
  )
}
