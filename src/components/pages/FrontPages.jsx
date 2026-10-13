import { useJournal } from '../../hooks/useJournal'
import { useBookNav } from '../../hooks/useBookNav'
import { shortDate, todayKey } from '../../lib/dates'
import { Fleuron, PressedFlower } from '../decor/Decorations'

/** The first page: title, owner's name and a few words on how to use the book. */
export function TitlePage() {
  const { settings, updateSettings, list } = useJournal()
  const nav = useBookNav()
  const first = list[0]?.date
  return (
    <div className="relative flex min-h-full flex-col items-center text-center">
      <PressedFlower hue="buttercup" className="absolute -right-4 -top-2 h-40 w-24 -rotate-12" />
      <div className="mt-[34px] font-serif-sc text-xs tracking-[0.5em] text-sepia">The Personal Diary of</div>
      <input
        value={settings.owner}
        onChange={(e) => updateSettings({ owner: e.target.value })}
        placeholder="write your name"
        aria-label="Your name"
        maxLength={40}
        className="hand-input mt-2 w-4/5 border-b border-sepia/40 text-center text-[2.4rem] leading-[56px] focus:bg-transparent"
      />
      <Fleuron className="mt-8 w-40 text-sepia" />
      <h1 className="mt-4 font-serif text-[2.6rem] leading-tight text-ink">Journal Daily</h1>
      <p className="font-serif italic text-sepia">a record of small improvements</p>
      <Fleuron className="mt-4 w-40 rotate-180 text-sepia" />
      <p className="mt-8 font-serif text-sm italic text-faded">{first ? `Begun on ${shortDate(first)}` : `Begun on ${shortDate(todayKey())}`}</p>

      <div className="mt-auto w-full pt-8 text-left font-hand text-xl leading-[30px] text-sepia">
        <p>✦ Each evening, write what you learned, how you improved, and a few words to your diary.</p>
        <p>✦ Turn pages with the arrows, your keyboard ← →, or a swipe.</p>
        <p>✦ The ribbon always finds today. The tabs lead to the back pages.</p>
      </div>
      <button type="button" className="btn-ink mt-6 self-end" onClick={() => nav.go({ view: 'day', date: todayKey() })}>
        Turn to today →
      </button>
    </div>
  )
}
