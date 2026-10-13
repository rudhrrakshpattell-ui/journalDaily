import { hashString } from '../../lib/random'

const MOUTHS = {
  1: 'M13 25 Q20 18 27 25',
  2: 'M13 24 Q20 21 27 24',
  3: 'M13 23 L27 23',
  4: 'M13 22 Q20 27 27 22',
  5: 'M12 21 Q20 31 28 21',
}
export const MOOD_LABELS = { 1: 'Low', 2: 'Meh', 3: 'Okay', 4: 'Good', 5: 'Wonderful' }
export const ENERGY_LABELS = { 1: 'Drained', 2: 'Tired', 3: 'Steady', 4: 'Lively', 5: 'Buzzing' }

export function MoodFace({ value, active = true, size = 34 }) {
  return (
    <svg viewBox="0 0 40 40" width={size} height={size} aria-hidden>
      <path
        d="M20 4 C30 3 37 11 36 20 C36 30 29 37 20 36 C10 36 4 29 4 20 C4 11 11 4 21 5"
        fill={active ? 'rgba(201,162,74,.18)' : 'none'}
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <circle cx="14.5" cy="15.5" r="1.8" fill="currentColor" />
      <circle cx="25.5" cy="15.5" r="1.8" fill="currentColor" />
      <path d={MOUTHS[value]} stroke="currentColor" strokeWidth="1.8" fill="none" strokeLinecap="round" />
    </svg>
  )
}

export function Bolt({ filled, size = 24 }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden>
      <path
        d="M13.5 2 L5 13.5 L11 13.5 L9.5 22 L19 9.5 L12.8 9.5 Z"
        fill={filled ? 'rgba(31,45,79,.85)' : 'none'}
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  )
}

/** A hand-drawn circle used to mark the chosen option. */
export function InkCircle({ className = '' }) {
  return (
    <svg viewBox="0 0 60 50" className={`pointer-events-none absolute ${className}`} aria-hidden>
      <path
        d="M30 4 C48 3 57 14 55 25 C53 39 38 46 26 45 C12 44 3 35 5 23 C7 11 20 5 36 6"
        fill="none"
        stroke="#9b1c2c"
        strokeWidth="2"
        strokeLinecap="round"
        opacity=".8"
      />
    </svg>
  )
}

const WASHI = ['#c9d6b8', '#e7c3b5', '#c5d3e0', '#efd9a0', '#d8c6e0', '#bfd9d2', '#f0c9c9', '#d9cdb4']

export function washiColor(tag) {
  return WASHI[hashString(tag) % WASHI.length]
}

/** A tag drawn as a strip of washi tape. */
export function WashiTag({ tag, active = true, onClick, onRemove, small = false }) {
  const tilt = (hashString(tag) % 7) - 3
  const Comp = onClick ? 'button' : 'span'
  return (
    <Comp
      type={onClick ? 'button' : undefined}
      onClick={onClick}
      className={`relative inline-flex items-center gap-1 font-hand leading-none text-ink transition ${
        small ? 'px-2 py-0.5 text-lg' : 'px-3 py-1 text-xl'
      } ${active ? '' : 'opacity-45 hover:opacity-80'} ${onClick ? 'cursor-pointer' : ''}`}
      style={{
        transform: `rotate(${tilt * 0.6}deg)`,
        background: washiColor(tag),
        clipPath: 'polygon(2% 0, 98% 4%, 100% 50%, 97% 100%, 3% 96%, 0 50%)',
        backgroundImage: 'repeating-linear-gradient(45deg, rgba(255,255,255,.18) 0 4px, transparent 4px 8px)',
      }}
      aria-pressed={onClick ? active : undefined}
    >
      {tag}
      {onRemove && (
        <span role="button" tabIndex={0} aria-label={`Remove ${tag}`} onClick={onRemove} className="ml-1 text-base text-sepia hover:text-wax">
          ×
        </span>
      )}
    </Comp>
  )
}
