import { seeded } from '../../lib/random'

/** A ring left by a coffee cup: irregular, darker at the rim. */
export function CoffeeStain({ size = 150, className = '', style }) {
  return (
    <svg viewBox="0 0 200 200" width={size} height={size} className={`pointer-events-none ${className}`} style={style} aria-hidden>
      <defs>
        <filter id="stain-rough">
          <feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="3" seed="7" />
          <feDisplacementMap in="SourceGraphic" scale="14" />
          <feGaussianBlur stdDeviation="0.8" />
        </filter>
        <radialGradient id="stain-fill">
          <stop offset="0%" stopColor="rgb(150,95,40)" stopOpacity="0.06" />
          <stop offset="80%" stopColor="rgb(150,95,40)" stopOpacity="0.1" />
          <stop offset="93%" stopColor="rgb(120,70,25)" stopOpacity="0.38" />
          <stop offset="100%" stopColor="rgb(120,70,25)" stopOpacity="0" />
        </radialGradient>
      </defs>
      <g filter="url(#stain-rough)">
        <circle cx="100" cy="100" r="78" fill="url(#stain-fill)" />
        <path d="M30 120 A75 75 0 0 0 150 160" stroke="rgba(120,70,25,0.18)" strokeWidth="4" fill="none" />
        <circle cx="168" cy="48" r="6" fill="rgba(140,85,30,0.18)" />
        <circle cx="180" cy="62" r="3" fill="rgba(140,85,30,0.15)" />
      </g>
    </svg>
  )
}

/** A pressed, slightly faded flower with a little strip of tape. */
export function PressedFlower({ className = '', style, hue = 'rose' }) {
  const petal = hue === 'lavender' ? '#9a86b8' : hue === 'buttercup' ? '#d8b04a' : '#c27a7e'
  const center = hue === 'buttercup' ? '#a8792a' : '#d8a54a'
  return (
    <svg viewBox="0 0 120 200" className={`pointer-events-none ${className}`} style={style} aria-hidden>
      <defs>
        <filter id="flower-age">
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="3" result="n" />
          <feColorMatrix in="n" type="saturate" values="0" result="g" />
          <feComposite in="SourceGraphic" in2="g" operator="arithmetic" k1="0.4" k2="0.75" k3="0" k4="0" />
        </filter>
      </defs>
      <g filter="url(#flower-age)" opacity="0.82">
        <path d="M60 80 C58 120 66 150 52 196" stroke="#6f7a45" strokeWidth="3" fill="none" />
        <path d="M58 130 C40 120 30 128 22 118 C36 112 50 118 58 128Z" fill="#7d8a50" />
        <path d="M60 155 C78 146 90 152 98 140 C84 136 70 142 60 152Z" fill="#76834a" />
        {[0, 72, 144, 216, 288].map((a) => (
          <ellipse key={a} cx="60" cy="56" rx="14" ry="26" fill={petal} opacity="0.85" transform={`rotate(${a} 60 76)`} />
        ))}
        <circle cx="60" cy="76" r="9" fill={center} />
        <circle cx="57" cy="73" r="2" fill="#8a5a22" />
        <circle cx="63" cy="78" r="1.6" fill="#8a5a22" />
      </g>
      <rect x="34" y="108" width="54" height="16" fill="rgba(240,228,190,0.75)" transform="rotate(-12 60 116)" />
    </svg>
  )
}

export function InkBlot({ seed = 'blot', size = 40, className = '', style }) {
  const rand = seeded(seed)
  const drops = Array.from({ length: 5 }, () => ({ x: 20 + rand() * 60, y: 20 + rand() * 60, r: 2 + rand() * 5 }))
  return (
    <svg viewBox="0 0 100 100" width={size} height={size} className={`pointer-events-none ${className}`} style={style} aria-hidden>
      <defs>
        <filter id={`blot-${seed}`}>
          <feTurbulence type="fractalNoise" baseFrequency="0.08" numOctaves="2" seed={Math.floor(rand() * 100)} />
          <feDisplacementMap in="SourceGraphic" scale="18" />
        </filter>
      </defs>
      <g filter={`url(#blot-${seed})`} fill="rgba(25,35,70,0.75)">
        <circle cx="50" cy="50" r="18" />
        {drops.map((d, i) => (
          <circle key={i} cx={d.x} cy={d.y} r={d.r} />
        ))}
      </g>
    </svg>
  )
}

/** A wobbly hand-drawn underline. */
export function InkUnderline({ className = '', color = 'currentColor', seed = 'line' }) {
  const r = seeded(seed)
  const y = () => 6 + (r() - 0.5) * 4
  return (
    <svg viewBox="0 0 300 12" preserveAspectRatio="none" className={`block h-3 w-full ${className}`} aria-hidden>
      <path
        d={`M2 ${y()} C 60 ${y()}, 110 ${y()}, 160 ${y()} S 260 ${y()}, 298 ${y()}`}
        stroke={color}
        strokeWidth="2.2"
        strokeLinecap="round"
        fill="none"
        opacity="0.75"
      />
    </svg>
  )
}

export function Fleuron({ className = '' }) {
  return (
    <svg viewBox="0 0 160 24" className={className} aria-hidden>
      <g fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round">
        <path d="M4 12 H58" />
        <path d="M102 12 H156" />
        <path d="M80 4 C70 4 66 12 72 16 C76 19 82 16 80 12 C78 8 72 10 74 13" />
        <path d="M80 4 C90 4 94 12 88 16 C84 19 78 16 80 12" />
        <path d="M62 12 C66 8 70 8 72 12 M98 12 C94 8 90 8 88 12" />
      </g>
      <circle cx="80" cy="20" r="1.8" fill="currentColor" />
    </svg>
  )
}

export function WaxSeal({ size = 64, className = '', label = 'JD', style }) {
  return (
    <svg viewBox="0 0 100 100" width={size} height={size} className={className} style={style} aria-hidden>
      <defs>
        <radialGradient id="wax" cx="40%" cy="35%">
          <stop offset="0%" stopColor="#c8323f" />
          <stop offset="60%" stopColor="#9b1c2c" />
          <stop offset="100%" stopColor="#5e0d18" />
        </radialGradient>
        <filter id="wax-edge">
          <feTurbulence type="fractalNoise" baseFrequency="0.06" numOctaves="2" seed="11" />
          <feDisplacementMap in="SourceGraphic" scale="9" />
        </filter>
      </defs>
      <circle cx="50" cy="50" r="44" fill="url(#wax)" filter="url(#wax-edge)" />
      <circle cx="50" cy="50" r="31" fill="none" stroke="rgba(60,0,8,0.55)" strokeWidth="3" />
      <circle cx="50" cy="50" r="31" fill="none" stroke="rgba(255,150,150,0.25)" strokeWidth="1" transform="translate(-1 -1)" />
      <text
        x="50"
        y="59"
        textAnchor="middle"
        fontFamily="Cinzel, Georgia, serif"
        fontSize="26"
        fontWeight="800"
        fill="rgba(70,0,10,0.7)"
        style={{ textShadow: '1px 1px 0 rgba(255,140,140,0.3)' }}
      >
        {label}
      </text>
    </svg>
  )
}

/** Picks a few decorations for a page from its seed so each page is a little different. */
export function PageDecor({ seed, side }) {
  const r = seeded(`decor-${seed}`)
  const roll = r()
  const pos = r()
  if (roll < 0.18) {
    return (
      <CoffeeStain
        size={130 + pos * 60}
        className="absolute z-0 opacity-80"
        style={{ [side === 'left' ? 'left' : 'right']: -30 + pos * 30, bottom: -20 + pos * 40, transform: `rotate(${pos * 360}deg)` }}
      />
    )
  }
  if (roll < 0.3) {
    return <InkBlot seed={seed} size={34} className="absolute z-0" style={{ right: 24 + pos * 40, top: 120 + pos * 200 }} />
  }
  return null
}
