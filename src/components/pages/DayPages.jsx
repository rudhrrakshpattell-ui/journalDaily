import { useState } from 'react'
import { useDayPage } from '../../hooks/useDayPage'
import { useJournal } from '../../hooks/useJournal'
import { longDate, year } from '../../lib/dates'
import { promptForDate } from '../../lib/prompts'
import { DEFAULT_TAGS } from '../../storage/entryModel'
import { AutoTextarea } from '../ui/AutoTextarea'
import { Bolt, ENERGY_LABELS, InkCircle, MOOD_LABELS, MoodFace, WashiTag } from '../ui/Doodles'
import { InkUnderline, PressedFlower, WaxSeal } from '../decor/Decorations'

export function DateHeader({ date, label }) {
  return (
    <header className="relative mb-[8px]">
      <span className="absolute -left-[58px] top-[10px] w-[44px] text-center font-serif text-xs italic text-faded">{year(date)}</span>
      {label && <div className="font-serif-sc text-xs tracking-[0.25em] text-sepia leading-[30px]">{label}</div>}
      <h2 className="font-hand text-[2.1rem] font-semibold leading-[52px] text-ink sm:text-[2.4rem]">{longDate(date)}</h2>
      <InkUnderline seed={date} className="-mt-2 text-sepia" />
    </header>
  )
}

export function DailyPrompt({ date }) {
  const p = promptForDate(date)
  return (
    <blockquote className="mb-[14px] mt-[6px] font-serif text-[0.98rem] italic leading-[24px] text-sepia/90">
      “{p.text}”{p.by && <span className="not-italic"> · {p.by}</span>}
    </blockquote>
  )
}

function SectionTitle({ children }) {
  return <h3 className="font-serif-sc text-[0.95rem] tracking-[0.12em] text-sepia leading-[30px]">{children}</h3>
}

function HandText({ text, wet, list = false }) {
  if (!text.trim()) return <p className="font-hand text-xl leading-[30px] text-faded/70">(nothing written)</p>
  if (list) {
    const items = text.split('\n').map((l) => l.replace(/^\s*([-*•·]|\d+[.)])\s*/, '').trim()).filter(Boolean)
    return (
      <ul className={`ink text-[1.55rem] leading-[30px] ${wet ? 'ink-wet' : ''}`}>
        {items.map((item, i) => (
          <li key={i} className="relative pl-5">
            <span className="absolute left-0 top-0 text-wax/80">✦</span>
            {item}
          </li>
        ))}
      </ul>
    )
  }
  return <p className={`ink whitespace-pre-wrap text-[1.55rem] leading-[30px] ${wet ? 'ink-wet' : ''}`}>{text}</p>
}

/** Left page of a day: date, prompt, what I learned, how I improved. */
export function DayLeft({ date }) {
  const page = useDayPage(date)
  const { value, editing, entry, justSaved } = page

  if (!editing && !entry) {
    return (
      <>
        <DateHeader date={date} />
        <p className="mt-[30px] font-hand text-2xl leading-[30px] text-faded">This page was left blank.</p>
        <p className="font-hand text-xl leading-[30px] text-faded/80">Some days are like that, and that is alright.</p>
        <button type="button" className="btn-ink mt-[30px]" onClick={page.startEdit}>
          Write on this page anyway
        </button>
      </>
    )
  }

  return (
    <>
      <DateHeader date={date} label={page.isToday ? 'Today' : null} />
      {editing && <DailyPrompt date={date} />}
      <section className="mt-[8px]">
        <SectionTitle>What new thing did I learn today?</SectionTitle>
        {editing ? (
          <AutoTextarea
            value={value.learned}
            onChange={(learned) => page.update({ learned })}
            minLines={4}
            placeholder="One thing per line… compared to yesterday, I now know that…"
            aria-label="What new thing did I learn today?"
          />
        ) : (
          <HandText text={value.learned} wet={justSaved} list />
        )}
      </section>
      <section className="mt-[30px]">
        <SectionTitle>How did I improve today?</SectionTitle>
        {editing ? (
          <AutoTextarea
            value={value.improved}
            onChange={(improved) => page.update({ improved })}
            minLines={4}
            placeholder="Skills, habits, mindset, health… anything that got a little better."
            aria-label="How did I improve today?"
          />
        ) : (
          <HandText text={value.improved} wet={justSaved} />
        )}
      </section>
    </>
  )
}

function RatingRow({ label, value, onChange, kind }) {
  const labels = kind === 'mood' ? MOOD_LABELS : ENERGY_LABELS
  return (
    <div className="flex flex-wrap items-center gap-x-3 leading-[30px]">
      <span className="w-[72px] font-serif-sc text-[0.95rem] tracking-[0.12em] text-sepia">{label}</span>
      <div className="flex items-center gap-1" role="radiogroup" aria-label={label}>
        {[1, 2, 3, 4, 5].map((n) => {
          const selected = value === n
          const content = kind === 'mood' ? <MoodFace value={n} active={selected} size={30} /> : <Bolt filled={value != null && n <= value} size={24} />
          return onChange ? (
            <button
              key={n}
              type="button"
              role="radio"
              aria-checked={selected}
              title={labels[n]}
              aria-label={`${label}: ${labels[n]}`}
              onClick={() => onChange(selected ? null : n)}
              className={`relative grid h-[30px] w-[36px] place-items-center transition ${selected || (kind === 'energy' && value >= n) ? 'text-ink' : 'text-faded/70 hover:text-ink'}`}
            >
              {content}
              {selected && kind === 'mood' && <InkCircle className="-inset-1 h-[38px] w-[44px]" />}
            </button>
          ) : (
            <span key={n} className={`grid h-[30px] w-[34px] place-items-center ${selected || (kind === 'energy' && value >= n) ? 'text-ink' : 'text-faded/40'}`}>
              {content}
            </span>
          )
        })}
      </div>
      {value && <span className="font-hand text-xl text-sepia">{labels[value]}</span>}
    </div>
  )
}

function TagPicker({ tags, onChange }) {
  const [custom, setCustom] = useState('')
  const known = [...new Set([...DEFAULT_TAGS, ...tags])]
  const toggle = (t) => onChange(tags.includes(t) ? tags.filter((x) => x !== t) : [...tags, t])
  const add = (e) => {
    e.preventDefault()
    const t = custom.trim().toLowerCase()
    if (t && !tags.includes(t)) onChange([...tags, t])
    setCustom('')
  }
  return (
    <div className="mt-[6px] flex flex-wrap items-center gap-2 py-1">
      {known.map((t) => (
        <WashiTag key={t} tag={t} small active={tags.includes(t)} onClick={() => toggle(t)} />
      ))}
      <form onSubmit={add} className="inline-flex">
        <input
          value={custom}
          onChange={(e) => setCustom(e.target.value)}
          placeholder="+ new tag"
          aria-label="Add a new tag"
          className="hand-input w-28 border-b border-dashed border-sepia/40 text-xl"
        />
      </form>
    </div>
  )
}

/** Right page of a day: Dear Diary, mood, energy, tags and actions. */
export function DayRight({ date }) {
  const page = useDayPage(date)
  const { settings } = useJournal()
  const { value, editing, entry, justSaved } = page
  const [confirmTear, setConfirmTear] = useState(false)

  if (!editing && !entry) {
    return (
      <div className="relative h-full">
        <PressedFlower hue="lavender" className="absolute right-0 top-[20%] h-48 w-28 rotate-12 opacity-80" />
      </div>
    )
  }

  return (
    <>
      <h3 className="font-hand text-[2.2rem] font-semibold leading-[60px] text-ink">Dear Diary,</h3>
      {editing ? (
        <AutoTextarea
          value={value.note}
          onChange={(note) => page.update({ note })}
          minLines={7}
          placeholder="Today was…"
          aria-label="Dear Diary entry"
        />
      ) : (
        <>
          <HandText text={value.note} wet={justSaved} />
          {settings.owner && <p className={`ink mt-[0px] text-right text-[1.7rem] leading-[60px] ${justSaved ? 'ink-wet' : ''}`}>— {settings.owner}</p>}
        </>
      )}

      <div className="mt-[30px]">
        <RatingRow label="Mood" kind="mood" value={value.mood} onChange={editing ? (mood) => page.update({ mood }) : null} />
        <RatingRow label="Energy" kind="energy" value={value.energy} onChange={editing ? (energy) => page.update({ energy }) : null} />
      </div>

      <div className="mt-[8px]">
        {editing ? (
          <TagPicker tags={value.tags} onChange={(tags) => page.update({ tags })} />
        ) : (
          value.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 py-1">
              {value.tags.map((t) => (
                <WashiTag key={t} tag={t} small />
              ))}
            </div>
          )
        )}
      </div>

      {page.error && <p className="mt-[8px] font-hand text-xl leading-[30px] text-wax">{page.error}</p>}

      <div className="mt-[24px] flex flex-wrap items-center gap-x-6 gap-y-3">
        {editing ? (
          <>
            <button type="button" onClick={page.save} className="group flex items-center gap-2" aria-label="Seal this page (save entry)">
              <WaxSeal size={52} className="transition group-hover:rotate-[-8deg] group-hover:scale-105" />
              <span className="btn-ink">{entry ? 'Re-seal page' : 'Seal this page'}</span>
            </button>
            {(entry || !page.isToday) && (
              <button type="button" className="btn-ink" onClick={page.cancel}>
                {entry ? 'Discard changes' : 'Put the pen down'}
              </button>
            )}
          </>
        ) : (
          <>
            <button type="button" className="btn-ink" onClick={page.startEdit}>
              ✎ Edit page
            </button>
            <button type="button" className="btn-ink" onClick={() => setConfirmTear(true)}>
              Tear out page
            </button>
          </>
        )}
      </div>

      {!editing && entry && (
        <div className={`pointer-events-none ml-auto mt-[16px] flex w-fit flex-col items-center ${justSaved ? 'stamp-in' : ''}`} style={{ transform: 'rotate(-10deg)' }}>
          <WaxSeal size={68} />
          <span className="mt-1 font-serif text-xs italic text-faded">
            sealed {new Date(entry.updatedAt).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}
          </span>
        </div>
      )}

      {confirmTear && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/30 p-6" onClick={() => setConfirmTear(false)}>
          <div
            role="alertdialog"
            aria-label="Tear out this page?"
            className="paper max-w-xs rotate-[-1deg] p-6 text-center shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <p className="font-hand text-3xl text-ink">Tear out this page?</p>
            <p className="mt-2 font-serif text-sm italic text-sepia">The entry for {longDate(date)} will be gone for good.</p>
            <div className="mt-5 flex justify-center gap-6">
              <button type="button" className="btn-ink" onClick={() => setConfirmTear(false)} autoFocus>
                Keep it
              </button>
              <button
                type="button"
                className="btn-ink !text-wax"
                onClick={() => {
                  setConfirmTear(false)
                  page.remove()
                }}
              >
                Tear it out
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
