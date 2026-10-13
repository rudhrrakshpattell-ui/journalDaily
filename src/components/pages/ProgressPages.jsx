import { useMemo } from 'react'
import { useJournal } from '../../hooks/useJournal'
import { useBookNav } from '../../hooks/useBookNav'
import { addDays, fromKey, shortDate, todayKey, toKey } from '../../lib/dates'
import { computeStats } from '../../lib/stats'
import { seeded } from '../../lib/random'
import { InkUnderline, PressedFlower, CoffeeStain } from '../decor/Decorations'
import { washiColor } from '../ui/Doodles'

function useStats() {
  const { list } = useJournal()
  return useMemo(() => computeStats(list), [list])
}

function PageTitle({ children, sub }) {
  return (
    <header className="mb-[14px]">
      <h2 className="font-serif text-[1.9rem] leading-[52px] text-ink">{children}</h2>
      <InkUnderline seed={String(children)} className="-mt-1 text-sepia" />
      {sub && <p className="font-serif text-sm italic leading-[30px] text-sepia">{sub}</p>}
    </header>
  )
}

/** Five-bar gate tally marks, the way you'd count days on a cell wall. */
function Tally({ count }) {
  const shown = Math.min(count, 40)
  const groups = Math.ceil(shown / 5)
  const r = seeded('tally')
  return (
    <svg viewBox={`0 0 ${Math.max(groups, 1) * 46} 50`} className="h-[50px] max-w-full" style={{ width: Math.max(groups, 1) * 46 }} aria-hidden>
      <g stroke="#1f2d4f" strokeWidth="2.6" strokeLinecap="round" fill="none">
        {Array.from({ length: groups }).map((_, g) => {
          const inGroup = Math.min(5, shown - g * 5)
          const x0 = g * 46 + 4
          return (
            <g key={g}>
              {Array.from({ length: Math.min(inGroup, 4) }).map((__, i) => (
                <path key={i} d={`M${x0 + i * 8 + (r() - 0.5) * 2} ${6 + r() * 3} L${x0 + i * 8 + (r() - 0.5) * 3} ${44 - r() * 3}`} />
              ))}
              {inGroup === 5 && <path d={`M${x0 - 4} ${36 + r() * 4} L${x0 + 30} ${12 + r() * 4}`} stroke="#9b1c2c" />}
            </g>
          )
        })}
      </g>
    </svg>
  )
}

const STICKER_ICONS = {
  sprout: 'M20 34 V20 M20 22 C12 22 9 15 10 10 C16 10 20 15 20 22 M20 20 C20 13 25 9 31 9 C31 15 27 19 20 20',
  star: 'M20 6 L24 16 L35 16 L26 23 L30 34 L20 27 L10 34 L14 23 L5 16 L16 16 Z',
  feather: 'M30 6 C18 10 10 20 10 34 M10 34 C20 30 30 22 30 6 M14 26 L22 24 M16 20 L25 17',
  laurel: 'M12 32 C8 24 9 14 14 8 M28 32 C32 24 31 14 26 8 M12 26 l-4 -2 M11 19 l-4 -1 M13 12 l-3 -2 M28 26 l4 -2 M29 19 l4 -1 M27 12 l3 -2',
  crown: 'M8 30 L10 12 L16 20 L20 8 L24 20 L30 12 L32 30 Z',
}

function Sticker({ m }) {
  return (
    <div className={`flex w-[84px] flex-col items-center text-center ${m.earned ? '' : 'opacity-35 grayscale'}`} title={m.earned ? `Earned: ${m.label}` : `Reach a ${m.days}-day streak`}>
      <div
        className="grid h-[58px] w-[58px] place-items-center rounded-full"
        style={{
          background: m.earned ? 'radial-gradient(circle at 35% 30%, #f6df98, #c9a24a 60%, #8a6a2a)' : 'transparent',
          border: m.earned ? '2px solid #8a6a2a' : '2px dashed #8b7355',
          boxShadow: m.earned ? '0 2px 4px rgba(0,0,0,.3)' : 'none',
          transform: `rotate(${(m.days % 7) - 3}deg)`,
        }}
      >
        <svg viewBox="0 0 40 40" className="h-8 w-8" aria-hidden>
          <path d={STICKER_ICONS[m.icon]} fill="none" stroke={m.earned ? '#5a3a10' : '#8b7355'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
      <span className="mt-1 font-hand text-base leading-tight text-sepia">{m.label}</span>
    </div>
  )
}

function Ledger({ rows }) {
  return (
    <dl className="font-hand text-[1.5rem] leading-[30px]">
      {rows.map(([label, value]) => (
        <div key={label} className="flex items-baseline gap-2">
          <dt className="text-sepia">{label}</dt>
          <span className="flex-1 translate-y-[-6px] border-b-2 border-dotted border-sepia/40" />
          <dd className="font-semibold text-ink">{value}</dd>
        </div>
      ))}
    </dl>
  )
}

export function ProgressStats() {
  const s = useStats()
  return (
    <>
      <PageTitle sub="Kept faithfully at the back of the book.">The Record of Growth</PageTitle>
      <div className="font-serif-sc text-[0.95rem] tracking-[0.12em] text-sepia leading-[30px]">Writing streak</div>
      <div className="flex flex-wrap items-center gap-4">
        <span className="font-hand text-[3.6rem] font-bold leading-[60px] text-ink">{s.streak}</span>
        <span className="font-hand text-2xl text-sepia">{s.streak === 1 ? 'day' : 'days'} in a row</span>
      </div>
      {s.streak > 0 ? <Tally count={s.streak} /> : <p className="font-hand text-xl leading-[30px] text-faded">Write today to start a new streak.</p>}
      <div className="mt-[22px]">
        <Ledger
          rows={[
            ['Pages written', s.totalEntries],
            ['Things learned', s.totalLearned],
            ['Words in ink', s.totalWords.toLocaleString()],
            ['Longest streak', `${s.longest} day${s.longest === 1 ? '' : 's'}`],
            ['First page', s.firstDate ? shortDate(s.firstDate) : '—'],
          ]}
        />
      </div>
      <div className="mt-[30px] font-serif-sc text-[0.95rem] tracking-[0.12em] text-sepia leading-[30px]">Milestones</div>
      <div className="mt-2 flex flex-wrap gap-2">
        {s.milestones.map((m) => (
          <Sticker key={m.days} m={m} />
        ))}
      </div>
    </>
  )
}

/** Mood and energy drawn with a wobbly pen, plus a dashed trend line. */
export function ProgressChart() {
  const s = useStats()
  const data = s.ratings.slice(-30)
  const W = 360
  const H = 240
  const pad = { l: 34, r: 12, t: 14, b: 34 }
  const x = (i) => pad.l + (data.length <= 1 ? (W - pad.l - pad.r) / 2 : (i * (W - pad.l - pad.r)) / (data.length - 1))
  const y = (v) => pad.t + ((5 - v) * (H - pad.t - pad.b)) / 4

  const pathFor = (key) => {
    const pts = data.map((d, i) => (d[key] ? [x(i), y(d[key])] : null)).filter(Boolean)
    if (!pts.length) return ''
    // Catmull-Rom curve through every point, so it looks drawn by hand rather than plotted.
    const f = (n) => n.toFixed(1)
    let d = `M${f(pts[0][0])} ${f(pts[0][1])}`
    for (let i = 0; i < pts.length - 1; i++) {
      const p0 = pts[i - 1] ?? pts[i]
      const [p1, p2] = [pts[i], pts[i + 1]]
      const p3 = pts[i + 2] ?? p2
      const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6]
      const c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6]
      d += ` C${f(c1[0])} ${f(c1[1])} ${f(c2[0])} ${f(c2[1])} ${f(p2[0])} ${f(p2[1])}`
    }
    return d
  }

  // Least-squares trend of the average rating.
  const avg = data.map((d, i) => [i, ((d.mood ?? d.energy) + (d.energy ?? d.mood)) / 2])
  let trend = null
  if (avg.length >= 2) {
    const n = avg.length
    const sx = avg.reduce((a, [i]) => a + i, 0)
    const sy = avg.reduce((a, [, v]) => a + v, 0)
    const sxy = avg.reduce((a, [i, v]) => a + i * v, 0)
    const sxx = avg.reduce((a, [i]) => a + i * i, 0)
    const slope = (n * sxy - sx * sy) / (n * sxx - sx * sx || 1)
    const icpt = (sy - slope * sx) / n
    const clamp = (v) => Math.min(5, Math.max(1, v))
    trend = { slope, y0: clamp(icpt), y1: clamp(icpt + slope * (n - 1)) }
  }

  const trendWord = !trend ? null : trend.slope > 0.02 ? 'rising ↗' : trend.slope < -0.02 ? 'dipping ↘' : 'steady →'

  return (
    <>
      <PageTitle sub="How I've been feeling and growing, entry by entry.">Mood &amp; Energy</PageTitle>
      {data.length === 0 ? (
        <p className="font-hand text-2xl leading-[30px] text-faded">Rate your mood and energy on a few pages and a chart will be drawn here.</p>
      ) : (
        <>
          <svg viewBox={`0 0 ${W} ${H}`} className="w-full" role="img" aria-label={`Chart of mood and energy for the last ${data.length} rated entries`}>
            <defs>
              <filter id="pen-wobble">
                <feTurbulence type="fractalNoise" baseFrequency="0.03" numOctaves="2" seed="4" />
                <feDisplacementMap in="SourceGraphic" scale="3.5" />
              </filter>
            </defs>
            <g filter="url(#pen-wobble)" fontFamily="Caveat, cursive" fontSize="15" fill="#6b4a2b">
              <path d={`M${pad.l} ${pad.t - 6} L${pad.l} ${H - pad.b} L${W - pad.r + 4} ${H - pad.b}`} stroke="#6b4a2b" strokeWidth="1.6" fill="none" />
              {[1, 2, 3, 4, 5].map((v) => (
                <g key={v}>
                  <path d={`M${pad.l - 4} ${y(v)} L${pad.l + 3} ${y(v)}`} stroke="#6b4a2b" strokeWidth="1.4" />
                  <path d={`M${pad.l + 6} ${y(v)} L${W - pad.r} ${y(v)}`} stroke="#9fb6cf" strokeWidth=".8" strokeDasharray="2 5" />
                  <text x={pad.l - 10} y={y(v) + 5} textAnchor="end">
                    {v}
                  </text>
                </g>
              ))}
              {trend && (
                <path d={`M${x(0)} ${y(trend.y0)} L${x(data.length - 1)} ${y(trend.y1)}`} stroke="#9b1c2c" strokeWidth="1.6" strokeDasharray="7 6" opacity=".7" fill="none" />
              )}
              <path d={pathFor('energy')} stroke="#a0662c" strokeWidth="2.2" fill="none" strokeLinejoin="round" pathLength="1" className="draw-line" style={{ '--len': 1 }} />
              <path d={pathFor('mood')} stroke="#1f2d4f" strokeWidth="2.6" fill="none" strokeLinejoin="round" pathLength="1" className="draw-line" style={{ '--len': 1 }} />
              {data.map((d, i) => (
                <g key={d.date}>
                  {d.energy && <circle cx={x(i)} cy={y(d.energy)} r="2.6" fill="#a0662c" />}
                  {d.mood && <circle cx={x(i)} cy={y(d.mood)} r="3.2" fill="#1f2d4f" />}
                </g>
              ))}
              <text x={pad.l} y={H - 10}>
                {shortDate(data[0].date)}
              </text>
              {data.length > 1 && (
                <text x={W - pad.r} y={H - 10} textAnchor="end">
                  {shortDate(data[data.length - 1].date)}
                </text>
              )}
            </g>
          </svg>
          <div className="mt-2 flex flex-wrap gap-x-6 font-hand text-xl leading-[30px]">
            <span className="text-ink">━ mood</span>
            <span className="text-[#a0662c]">━ energy</span>
            {trend && <span className="text-wax">┅ trend: {trendWord}</span>}
          </div>
          {trend && (
            <p className="mt-[16px] rotate-[-1deg] font-hand text-[1.45rem] leading-[30px] text-ink">
              {trend.slope > 0.02
                ? 'Look at that line climb. Whatever you are doing, keep doing it.'
                : trend.slope < -0.02
                  ? 'A dip lately. Be gentle with yourself; the line always turns.'
                  : 'Holding steady. Consistency is its own kind of growth.'}
            </p>
          )}
        </>
      )}
      <CoffeeStain size={170} className="absolute bottom-0 right-0 rotate-45 opacity-70" />
    </>
  )
}

/** Days written, as ink dots on a calendar grid (weeks across, weekdays down). */
export function ProgressHeatmap() {
  const s = useStats()
  const nav = useBookNav()
  const weeks = 18
  const today = todayKey()
  const start = (() => {
    const d = fromKey(addDays(today, -(weeks * 7 - 1)))
    d.setDate(d.getDate() - ((d.getDay() + 6) % 7)) // back to Monday
    return toKey(d)
  })()
  const cell = 18
  const cols = []
  for (let w = 0; w * 7 < 7 * (weeks + 1); w++) {
    const days = []
    for (let d = 0; d < 7; d++) {
      const key = addDays(start, w * 7 + d)
      if (key > today) break
      days.push(key)
    }
    if (days.length) cols.push(days)
  }
  const r = seeded('heat')
  const max = Math.max(1, ...Object.values(s.wordsByDate))
  const W = cols.length * cell + 30
  const H = 7 * cell + 24
  const months = cols
    .map((c, i) => ({ i, key: c[0] }))
    .filter(({ key }, idx, arr) => idx === 0 || fromKey(key).getMonth() !== fromKey(arr[idx - 1].key).getMonth())

  return (
    <>
      <PageTitle sub={`Every dot is a day you showed up. The last ${weeks} weeks.`}>Days in Ink</PageTitle>
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" role="img" aria-label="Calendar of days written">
        <defs>
          <filter id="ink-bleed">
            <feTurbulence type="fractalNoise" baseFrequency="0.25" numOctaves="2" seed="9" />
            <feDisplacementMap in="SourceGraphic" scale="2.4" />
          </filter>
        </defs>
        <g fontFamily="Caveat, cursive" fontSize="13" fill="#6b4a2b">
          {['M', '', 'W', '', 'F', '', 'S'].map((l, i) => (
            <text key={i} x="6" y={20 + i * cell + 4}>
              {l}
            </text>
          ))}
          {months.map(({ i, key }) => (
            <text key={key} x={30 + i * cell} y="10">
              {fromKey(key).toLocaleDateString('en-GB', { month: 'short' })}
            </text>
          ))}
        </g>
        <g filter="url(#ink-bleed)">
          {cols.map((days, ci) =>
            days.map((key, di) => {
              const words = s.wordsByDate[key]
              const cx = 30 + ci * cell + cell / 2 + (r() - 0.5) * 2
              const cy = 16 + di * cell + cell / 2 + (r() - 0.5) * 2
              return words ? (
                <circle
                  key={key}
                  cx={cx}
                  cy={cy}
                  r={3.5 + (words / max) * 4.5}
                  fill="#1f2d4f"
                  opacity={0.55 + (words / max) * 0.4}
                  className="cursor-pointer"
                  onClick={() => nav.go({ view: 'day', date: key })}
                >
                  <title>{`${shortDate(key)} · ${words} words`}</title>
                </circle>
              ) : (
                <circle key={key} cx={cx} cy={cy} r="1.3" fill="#8b7355" opacity=".45">
                  <title>{shortDate(key)}</title>
                </circle>
              )
            }),
          )}
        </g>
        {/* Today circled in red pen. */}
        {(() => {
          const ci = cols.length - 1
          const di = cols[ci].length - 1
          return (
            <ellipse cx={30 + ci * cell + cell / 2} cy={16 + di * cell + cell / 2} rx="10" ry="9" fill="none" stroke="#9b1c2c" strokeWidth="1.4" transform={`rotate(-12 ${30 + ci * cell + cell / 2} ${16 + di * cell + cell / 2})`} />
          )
        })()}
      </svg>
      <div className="mt-2 flex items-center gap-3 font-hand text-lg text-sepia">
        <span>fewer words</span>
        {[3.5, 5.5, 8].map((rr) => (
          <svg key={rr} width="18" height="18" aria-hidden>
            <circle cx="9" cy="9" r={rr} fill="#1f2d4f" opacity=".75" />
          </svg>
        ))}
        <span>more words</span>
      </div>
      <p className="mt-[24px] font-hand text-[1.45rem] leading-[30px] text-ink">
        {s.totalEntries === 0
          ? 'The calendar is blank, waiting for your first dot.'
          : `${s.totalEntries} ${s.totalEntries === 1 ? 'day' : 'days'} written. Each one counts.`}
      </p>
    </>
  )
}

/** Which areas you improved in most, as cross-hatched ink bars. */
export function ProgressTags() {
  const s = useStats()
  const nav = useBookNav()
  const max = Math.max(1, ...s.tagCounts.map(([, n]) => n))
  return (
    <>
      <PageTitle sub="The areas of life you tended to most.">Where I Grew</PageTitle>
      {s.tagCounts.length === 0 ? (
        <p className="font-hand text-2xl leading-[30px] text-faded">Tag your entries (coding, fitness, study…) and they will be tallied here.</p>
      ) : (
        <ul className="space-y-[6px]">
          {s.tagCounts.slice(0, 10).map(([tag, n], i) => (
            <li key={tag}>
              <button type="button" className="group flex w-full items-center gap-3 text-left" onClick={() => nav.go({ view: 'index' }, { tag })} title={`See entries tagged ${tag}`}>
                <span className="w-24 shrink-0 truncate font-hand text-[1.45rem] leading-[30px] text-ink group-hover:text-wax">{tag}</span>
                <span className="relative h-[18px] flex-1">
                  <span
                    className="absolute inset-y-0 left-0 rounded-[3px] border-[1.5px] border-ink/70"
                    style={{
                      width: `${Math.max(8, (n / max) * 100)}%`,
                      background: `repeating-linear-gradient(${i % 2 ? 45 : -45}deg, rgba(31,45,79,.55) 0 1.5px, transparent 1.5px 6px), ${washiColor(tag)}`,
                      transform: `rotate(${((i % 3) - 1) * 0.3}deg)`,
                    }}
                  />
                </span>
                <span className="w-8 text-right font-hand text-xl text-sepia">{n}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
      {s.tagCounts[0] && (
        <p className="mt-[24px] rotate-[-1deg] font-hand text-[1.45rem] leading-[30px] text-wax">
          Most tended: <span className="underline decoration-wavy">{s.tagCounts[0][0]}</span>
        </p>
      )}
      <PressedFlower hue="rose" className="absolute bottom-2 right-2 h-52 w-32 rotate-[18deg]" />
    </>
  )
}
