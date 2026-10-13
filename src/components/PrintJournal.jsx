import { useJournal } from '../hooks/useJournal'
import { longDate, year } from '../lib/dates'
import { MOOD_LABELS, ENERGY_LABELS } from './ui/Doodles'

/** A clean, printable copy of every entry, used for "Print / save as PDF". */
export function PrintJournal() {
  const { list, settings } = useJournal()
  return (
    <div className="print-only font-serif text-black">
      <h1 className="text-center text-4xl">Journal Daily</h1>
      {settings.owner && <p className="text-center italic">The personal diary of {settings.owner}</p>}
      {list.map((e) => (
        <article key={e.date} className="mt-10" style={{ breakInside: 'avoid-page' }}>
          <h2 className="font-hand text-3xl">
            {longDate(e.date)}, {year(e.date)}
          </h2>
          <h3 className="mt-3 text-sm uppercase tracking-widest">What I learned</h3>
          <p className="whitespace-pre-wrap font-hand text-xl">{e.learned || '—'}</p>
          <h3 className="mt-3 text-sm uppercase tracking-widest">How I improved</h3>
          <p className="whitespace-pre-wrap font-hand text-xl">{e.improved || '—'}</p>
          <h3 className="mt-3 text-sm uppercase tracking-widest">Dear Diary</h3>
          <p className="whitespace-pre-wrap font-hand text-xl">{e.note || '—'}</p>
          <p className="mt-2 text-sm italic">
            {[e.mood && `Mood: ${MOOD_LABELS[e.mood]}`, e.energy && `Energy: ${ENERGY_LABELS[e.energy]}`, e.tags.length && `Tags: ${e.tags.join(', ')}`]
              .filter(Boolean)
              .join(' · ')}
          </p>
        </article>
      ))}
    </div>
  )
}
