import { useJournal } from '../../hooks/useJournal'
import { useBookNav } from '../../hooks/useBookNav'
import { addDays, todayKey } from '../../lib/dates'
import { countLearned, wordCount } from '../../lib/stats'
import { Bolt, ENERGY_LABELS, MOOD_LABELS, MoodFace, WashiTag } from '../ui/Doodles'
import { DateHeader } from './DayPages'

function Summary({ entry }) {
  const learned = entry.learned
    .split('\n')
    .map((l) => l.replace(/^\s*([-*•·]|\d+[.)])\s*/, '').trim())
    .filter(Boolean)
  return (
    <div className="ink text-[1.45rem] leading-[30px]">
      <h3 className="font-serif-sc text-[0.95rem] tracking-[0.12em] text-sepia">Learned</h3>
      {learned.length ? (
        <ul>
          {learned.map((l, i) => (
            <li key={i} className="relative pl-5">
              <span className="absolute left-0 text-wax/80">✦</span>
              {l}
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-faded">(nothing noted)</p>
      )}
      <h3 className="mt-[30px] font-serif-sc text-[0.95rem] tracking-[0.12em] text-sepia">Improved</h3>
      <p className="whitespace-pre-wrap">{entry.improved || <span className="text-faded">(nothing noted)</span>}</p>
      {entry.note && (
        <>
          <h3 className="mt-[30px] font-serif-sc text-[0.95rem] tracking-[0.12em] text-sepia">Dear Diary</h3>
          <p className="line-clamp-4 whitespace-pre-wrap">{entry.note}</p>
        </>
      )}
      <div className="mt-[30px] flex flex-wrap items-center gap-4 text-sepia">
        {entry.mood && (
          <span className="flex items-center gap-1" title={`Mood: ${MOOD_LABELS[entry.mood]}`}>
            <MoodFace value={entry.mood} size={28} /> {MOOD_LABELS[entry.mood]}
          </span>
        )}
        {entry.energy && (
          <span className="flex items-center" title={`Energy: ${ENERGY_LABELS[entry.energy]}`}>
            {[1, 2, 3, 4, 5].map((n) => (
              <Bolt key={n} filled={n <= entry.energy} size={20} />
            ))}
          </span>
        )}
      </div>
      {entry.tags.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-2">
          {entry.tags.map((t) => (
            <WashiTag key={t} tag={t} small />
          ))}
        </div>
      )}
    </div>
  )
}

/** Red-pen margin notes comparing today with yesterday. */
function GrowthNotes({ today, yesterday }) {
  const notes = []
  const dl = countLearned(today.learned) - countLearned(yesterday.learned)
  if (dl > 0) notes.push(`${dl} more thing${dl > 1 ? 's' : ''} learned than yesterday!`)
  else if (dl === 0) notes.push('Learned as much as yesterday. Steady!')
  else notes.push('A quieter day for learning. That is fine.')
  if (today.mood && yesterday.mood && today.mood !== yesterday.mood) {
    notes.push(`Mood ${today.mood > yesterday.mood ? 'up' : 'down'}: ${MOOD_LABELS[yesterday.mood]} → ${MOOD_LABELS[today.mood]}`)
  }
  if (today.energy && yesterday.energy && today.energy !== yesterday.energy) {
    notes.push(`Energy ${today.energy > yesterday.energy ? 'rising' : 'dipping'}: ${ENERGY_LABELS[yesterday.energy]} → ${ENERGY_LABELS[today.energy]}`)
  }
  const dw = wordCount(today) - wordCount(yesterday)
  if (Math.abs(dw) >= 10) notes.push(`${Math.abs(dw)} ${dw > 0 ? 'more' : 'fewer'} words written`)
  const newTags = today.tags.filter((t) => !yesterday.tags.includes(t))
  if (newTags.length) notes.push(`New today: ${newTags.join(', ')}`)
  return (
    <aside className="mb-[30px] rotate-[-1.2deg] border-l-2 border-wax/60 pl-3 font-hand text-[1.35rem] leading-[28px] text-wax">
      {notes.map((n) => (
        <p key={n}>✓ {n}</p>
      ))}
    </aside>
  )
}

export function CompareLeft() {
  const { entries } = useJournal()
  const nav = useBookNav()
  const date = addDays(todayKey(), -1)
  const entry = entries[date]
  return (
    <>
      <DateHeader date={date} label="Yesterday" />
      {entry ? (
        <Summary entry={entry} />
      ) : (
        <>
          <p className="mt-[30px] font-hand text-2xl leading-[30px] text-faded">No page was written yesterday.</p>
          <button type="button" className="btn-ink mt-[30px]" onClick={() => nav.go({ view: 'day', date })}>
            Fill in yesterday’s page
          </button>
        </>
      )}
    </>
  )
}

export function CompareRight() {
  const { entries } = useJournal()
  const nav = useBookNav()
  const date = todayKey()
  const entry = entries[date]
  const yesterday = entries[addDays(date, -1)]
  return (
    <>
      <DateHeader date={date} label="Today" />
      {entry ? (
        <>
          {yesterday && <GrowthNotes today={entry} yesterday={yesterday} />}
          <Summary entry={entry} />
        </>
      ) : (
        <>
          <p className="mt-[30px] font-hand text-2xl leading-[30px] text-faded">Today’s page is still waiting for you.</p>
          <button type="button" className="btn-ink mt-[30px]" onClick={() => nav.go({ view: 'day', date })}>
            Write today’s page
          </button>
        </>
      )}
    </>
  )
}
