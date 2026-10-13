import { useState } from 'react'
import { playCoverOpen } from '../../lib/sound'
import { Fleuron } from '../decor/Decorations'

function GoldCorner({ className, flip = '' }) {
  return (
    <svg viewBox="0 0 60 60" className={`absolute h-12 w-12 ${className}`} style={{ transform: flip }} aria-hidden>
      <defs>
        <linearGradient id="brass" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#f3dc95" />
          <stop offset=".45" stopColor="#b8893a" />
          <stop offset="1" stopColor="#7a5a20" />
        </linearGradient>
      </defs>
      <path d="M0 0 H60 L0 60 Z" fill="url(#brass)" />
      <path d="M6 6 H40 M6 6 V40" stroke="#6b4c1a" strokeWidth="1.5" fill="none" />
      <path d="M14 14 C22 10 28 16 22 22 C18 26 12 22 16 18" stroke="#6b4c1a" strokeWidth="1.2" fill="none" />
      <circle cx="10" cy="10" r="2.2" fill="#6b4c1a" />
    </svg>
  )
}

/** Front face of the leather cover. */
export function CoverFace({ owner, year }) {
  return (
    <div className="leather relative h-full w-full overflow-hidden rounded-r-[10px] rounded-l-[4px]">
      <div className="stitching" />
      {/* Hinge crease near the spine. */}
      <div className="absolute inset-y-0 left-0 w-7" style={{ background: 'linear-gradient(to right, rgba(0,0,0,.45), rgba(255,220,180,.08) 55%, rgba(0,0,0,.25))' }} />
      <GoldCorner className="right-0 top-0" flip="scaleX(-1)" />
      <GoldCorner className="bottom-0 right-0" flip="scale(-1,-1)" />
      <div className="absolute inset-[13%_14%_14%_18%] flex flex-col items-center justify-center rounded-md border-[3px] border-double border-black/30 text-center" style={{ boxShadow: 'inset 1px 1px 0 rgba(255,210,160,.12), 1px 1px 0 rgba(255,210,160,.1)' }}>
        <Fleuron className="mb-4 w-2/3 text-[#c9a24a] opacity-90" />
        <div className="emboss text-[clamp(2rem,4.2vw,3.6rem)] font-extrabold leading-[1.05] tracking-[0.06em]">
          Journal
          <br />
          Daily
        </div>
        <Fleuron className="mt-4 w-2/3 rotate-180 text-[#c9a24a] opacity-90" />
        <div className="gold-foil mt-6 font-emboss text-lg font-semibold tracking-[0.3em] sm:text-2xl">{year}</div>
        {owner && <div className="gold-foil mt-2 font-serif text-base italic sm:text-lg">{owner}</div>}
      </div>
    </div>
  )
}

/** Inside of the front cover: leather turn-ins framing marbled endpaper. */
export function CoverInside({ owner }) {
  return (
    <div className="leather relative h-full w-full overflow-hidden rounded-l-[10px] rounded-r-[4px]">
      <div className="absolute inset-[12px_0_12px_14px]">
        <Endpaper owner={owner} side="left" />
      </div>
    </div>
  )
}

export function Endpaper({ owner, side = 'left' }) {
  return (
    <div className={`endpaper paper-${side} relative flex h-full w-full items-center justify-center`}>
      <div className="relative w-[62%] rotate-[-1.5deg] bg-[#f4e9d0] px-5 py-6 text-center shadow-[0_4px_10px_rgba(0,0,0,.4)]" style={{ backgroundImage: 'var(--noise)' }}>
        <div className="absolute inset-2 border border-sepia/50" />
        <div className="font-serif-sc text-xs tracking-[0.4em] text-sepia">Ex Libris</div>
        <Fleuron className="mx-auto my-2 w-24 text-sepia" />
        <div className="min-h-[2.2rem] font-hand text-3xl text-ink">{owner || ' '}</div>
        <div className="mx-auto mt-1 h-px w-4/5 bg-sepia/50" />
        <div className="mt-3 font-serif text-xs italic text-faded">“The days are what we make of them.”</div>
      </div>
    </div>
  )
}

/**
 * The closed journal on the desk. Clicking it snaps the elastic band, then the
 * cover swings open around the spine; `onOpened` fires when it lies flat.
 */
export function ClosedBook({ isDesktop, owner, year, underneath, onOpened }) {
  const [stage, setStage] = useState('closed') // closed | band | opening

  const open = () => {
    if (stage !== 'closed') return
    setStage('band')
    setTimeout(() => {
      playCoverOpen()
      setStage('opening')
    }, 320)
  }

  const onCoverEnd = (e) => {
    if (e.target === e.currentTarget && stage === 'opening') onOpened()
  }

  const pageW = isDesktop ? 'var(--page-w)' : 'calc(var(--page-w) - 40px)'
  const shift = isDesktop ? (stage === 'opening' ? 'translateX(0)' : 'translateX(-25%)') : 'none'

  return (
    <div className="flex flex-col items-center">
      <div
        className={`book-slide relative ${stage === 'closed' ? 'closed-book-hover cursor-pointer' : ''}`}
        style={{ width: isDesktop ? `calc(${pageW} * 2)` : pageW, height: 'var(--page-h)', transform: shift, marginLeft: isDesktop ? 0 : 10 }}
        onClick={open}
        onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && open()}
        role="button"
        tabIndex={0}
        aria-label="Open your journal"
      >
        <div className="book-stage absolute inset-y-0 right-0" style={{ width: pageW }}>
          {/* Back board and the block of pages. */}
          <div className="leather absolute -bottom-[12px] -right-[14px] -top-[12px] left-0 rounded-r-[10px]" style={{ boxShadow: '0 30px 60px rgba(0,0,0,.6)' }} />
          <div className="absolute inset-0" style={{ boxShadow: '2px 2px 0 #eadfc4, 4px 4px 0 #dccfae, 6px 5px 0 #e6dabd' }}>
            {underneath}
          </div>
          {/* Rounded spine seen from the front. */}
          <div
            className="absolute -bottom-[12px] -top-[12px] -left-[22px] z-10 w-[24px] rounded-l-[12px]"
            style={{ background: 'linear-gradient(to right, #2a170d, #5a3320 45%, #3b2015)', boxShadow: 'inset -2px 0 4px rgba(0,0,0,.5)' }}
          >
            {[14, 30, 70, 86].map((t) => (
              <div key={t} className="absolute inset-x-1 h-[3px] rounded bg-[#c9a24a]/60" style={{ top: `${t}%` }} />
            ))}
          </div>
          {/* The cover itself: front is leather, back is the inside cover. */}
          <div
            className={`leaf -bottom-[12px] -right-[14px] -top-[12px] left-0 h-auto ${stage === 'opening' ? 'cover-open' : ''}`}
            style={{ transformOrigin: 'left center', zIndex: 30 }}
            onAnimationEnd={onCoverEnd}
          >
            <div className="leaf-face" style={{ boxShadow: '0 4px 10px rgba(0,0,0,.4)' }}>
              <CoverFace owner={owner} year={year} />
              {/* Elastic band closure. */}
              <div
                className={`absolute -bottom-1 -top-1 right-[9%] w-[14px] ${stage !== 'closed' ? 'band-snap' : ''}`}
                style={{ background: 'linear-gradient(to right, #1a0d08, #3a1f14 40%, #22110a)', boxShadow: '2px 0 4px rgba(0,0,0,.5)' }}
              />
            </div>
            <div className="leaf-face leaf-back">
              {isDesktop ? <CoverInside owner={owner} /> : <div className="leather h-full w-full rounded-[10px]" />}
            </div>
          </div>
        </div>
      </div>
      {stage === 'closed' && (
        <p className="float-hint mt-10 font-hand text-2xl text-[#f0d9a8]/80 sm:text-3xl">Click the journal to open it</p>
      )}
    </div>
  )
}
