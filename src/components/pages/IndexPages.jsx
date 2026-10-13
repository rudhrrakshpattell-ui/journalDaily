import { useMemo, useRef, useState } from 'react'
import { useJournal } from '../../hooks/useJournal'
import { useBookNav } from '../../hooks/useBookNav'
import { fromKey, monthLabel, shortDate, todayKey, toKey } from '../../lib/dates'
import { downloadJson, parseImportFile } from '../../lib/exportJournal'
import { InkUnderline } from '../decor/Decorations'
import { WashiTag } from '../ui/Doodles'

export function filterEntries(list, { text = '', tag = '' }) {
  const q = text.trim().toLowerCase()
  return list
    .filter((e) => !tag || e.tags.includes(tag))
    .filter((e) => !q || `${e.learned}\n${e.improved}\n${e.note}\n${e.tags.join(' ')}\n${e.date}`.toLowerCase().includes(q))
    .sort((a, b) => b.date.localeCompare(a.date))
}

function Title({ children }) {
  return (
    <header className="mb-[14px]">
      <h2 className="font-serif text-[1.9rem] leading-[52px] text-ink">{children}</h2>
      <InkUnderline seed={String(children)} className="-mt-1 text-sepia" />
    </header>
  )
}

function MiniCalendar() {
  const { entries } = useJournal()
  const nav = useBookNav()
  const [month, setMonth] = useState(() => todayKey().slice(0, 7))
  const first = fromKey(`${month}-01`)
  const offset = (first.getDay() + 6) % 7
  const daysInMonth = new Date(first.getFullYear(), first.getMonth() + 1, 0).getDate()
  const today = todayKey()
  const shift = (n) => {
    const d = new Date(first.getFullYear(), first.getMonth() + n, 1)
    setMonth(toKey(d).slice(0, 7))
  }
  return (
    <div className="font-hand">
      <div className="flex items-center justify-between leading-[30px]">
        <button type="button" className="px-2 text-2xl text-sepia hover:text-wax" onClick={() => shift(-1)} aria-label="Previous month">
          ‹
        </button>
        <span className="text-[1.45rem] text-ink">{monthLabel(`${month}-01`)}</span>
        <button type="button" className="px-2 text-2xl text-sepia hover:text-wax" onClick={() => shift(1)} aria-label="Next month">
          ›
        </button>
      </div>
      <div className="grid grid-cols-7 text-center text-lg leading-[30px] text-sepia">
        {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((d, i) => (
          <span key={i}>{d}</span>
        ))}
        {Array.from({ length: offset }).map((_, i) => (
          <span key={`b${i}`} />
        ))}
        {Array.from({ length: daysInMonth }).map((_, i) => {
          const key = `${month}-${String(i + 1).padStart(2, '0')}`
          const written = Boolean(entries[key])
          const future = key > today
          return (
            <button
              key={key}
              type="button"
              disabled={future}
              onClick={() => nav.go({ view: 'day', date: key })}
              aria-label={`${shortDate(key)}${written ? ', written' : ''}`}
              className={`relative mx-auto grid h-[30px] w-[30px] place-items-center rounded-full text-lg ${
                future ? 'text-faded/40' : 'text-ink hover:text-wax'
              } ${key === today ? 'ring-1 ring-wax/70' : ''}`}
            >
              {written && <span className="absolute inset-[3px] rounded-full bg-ink/15" style={{ filter: 'blur(.3px)' }} />}
              <span className={`relative ${written ? 'font-bold' : ''}`}>{i + 1}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}

function KeepSafe() {
  const { list, settings, importEntries } = useJournal()
  const fileRef = useRef(null)
  const [note, setNote] = useState('')

  const onImport = async (e) => {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file) return
    try {
      const entries = await parseImportFile(file)
      const n = await importEntries(entries)
      setNote(`Restored ${n} page${n === 1 ? '' : 's'} into your journal.`)
    } catch (err) {
      setNote(err.message || 'That file could not be read.')
    }
  }

  return (
    <div className="font-hand text-xl leading-[30px]">
      <div className="flex flex-wrap gap-x-5 gap-y-1">
        <button type="button" className="btn-ink" disabled={!list.length} onClick={() => downloadJson(list, settings.owner)}>
          Download as JSON
        </button>
        <button type="button" className="btn-ink" disabled={!list.length} onClick={() => window.print()}>
          Print / save as PDF
        </button>
        <button type="button" className="btn-ink" onClick={() => fileRef.current?.click()}>
          Restore from a file
        </button>
        <input ref={fileRef} type="file" accept="application/json,.json" className="hidden" onChange={onImport} aria-label="Restore journal from JSON file" />
      </div>
      {note && <p className="mt-1 text-wax">{note}</p>}
      <p className="mt-1 text-lg text-faded">Your pages live only in this browser. Take a copy now and then.</p>
    </div>
  )
}

export function IndexLeft() {
  const { list } = useJournal()
  const nav = useBookNav()
  const { query, setQuery } = nav
  const allTags = useMemo(() => [...new Set(list.flatMap((e) => e.tags))].sort(), [list])
  return (
    <>
      <Title>Index</Title>
      <label className="flex items-center gap-2 leading-[30px]">
        <span className="font-serif-sc text-[0.95rem] tracking-[0.12em] text-sepia">Find</span>
        <input
          type="search"
          value={query.text}
          onChange={(e) => setQuery({ ...query, text: e.target.value })}
          placeholder="a word, a feeling, a date…"
          className="hand-input border-b border-sepia/40"
          aria-label="Search entries"
        />
      </label>
      {allTags.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-2">
          {allTags.map((t) => (
            <WashiTag key={t} tag={t} small active={!query.tag || query.tag === t} onClick={() => setQuery({ ...query, tag: query.tag === t ? '' : t })} />
          ))}
        </div>
      )}
      <div className="mt-[24px] font-serif-sc text-[0.95rem] tracking-[0.12em] text-sepia leading-[30px]">Turn to a date</div>
      <MiniCalendar />
      <div className="mt-[24px] font-serif-sc text-[0.95rem] tracking-[0.12em] text-sepia leading-[30px]">Keep it safe</div>
      <KeepSafe />
    </>
  )
}

export function IndexRight() {
  const { list } = useJournal()
  const nav = useBookNav()
  const results = filterEntries(list, nav.query)
  const filtered = nav.query.text || nav.query.tag
  return (
    <>
      <Title>{filtered ? `${results.length} page${results.length === 1 ? '' : 's'} found` : 'All Pages'}</Title>
      {results.length === 0 ? (
        <p className="font-hand text-2xl leading-[30px] text-faded">{list.length ? 'Nothing matches that. Try another word?' : 'No pages yet. Your first entry will be listed here.'}</p>
      ) : (
        <ol className="font-hand text-[1.4rem] leading-[30px]">
          {results.map((e) => {
            const lines = `${e.learned}\n${e.improved}\n${e.note}`.split('\n').filter((l) => l.trim())
            const q = nav.query.text.trim().toLowerCase()
            const firstLine = (q && lines.find((l) => l.toLowerCase().includes(q))) || lines[0] || ''
            return (
              <li key={e.date}>
                <button type="button" onClick={() => nav.go({ view: 'day', date: e.date })} className="group flex w-full items-baseline gap-2 text-left">
                  <span className="shrink-0 text-sepia group-hover:text-wax">{shortDate(e.date)}</span>
                  <span className="min-w-0 flex-1 truncate text-ink group-hover:underline">{firstLine}</span>
                </button>
              </li>
            )
          })}
        </ol>
      )}
    </>
  )
}
