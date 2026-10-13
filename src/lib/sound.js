/**
 * Paper rustle synthesised with the Web Audio API, so no audio files are needed.
 * A short burst of filtered noise with a soft swish envelope.
 */
let ctx = null
let muted = false

export function setMuted(value) {
  muted = value
}

function context() {
  if (!ctx) {
    const AC = window.AudioContext || window.webkitAudioContext
    if (!AC) return null
    ctx = new AC()
  }
  if (ctx.state === 'suspended') ctx.resume()
  return ctx
}

export function playPageTurn({ duration = 0.45, volume = 0.35 } = {}) {
  if (muted) return
  const ac = context()
  if (!ac) return
  const now = ac.currentTime
  const length = Math.floor(ac.sampleRate * duration)
  const buffer = ac.createBuffer(1, length, ac.sampleRate)
  const data = buffer.getChannelData(0)
  // Crinkly noise: random samples with occasional crackles.
  for (let i = 0; i < length; i++) {
    const crackle = Math.random() < 0.004 ? (Math.random() * 2 - 1) * 2.5 : 0
    data[i] = (Math.random() * 2 - 1) * 0.6 + crackle
  }
  const src = ac.createBufferSource()
  src.buffer = buffer

  const band = ac.createBiquadFilter()
  band.type = 'bandpass'
  band.Q.value = 0.8
  band.frequency.setValueAtTime(1200, now)
  band.frequency.exponentialRampToValueAtTime(4200, now + duration * 0.55)
  band.frequency.exponentialRampToValueAtTime(1800, now + duration)

  const high = ac.createBiquadFilter()
  high.type = 'highpass'
  high.frequency.value = 500

  const gain = ac.createGain()
  gain.gain.setValueAtTime(0.0001, now)
  gain.gain.exponentialRampToValueAtTime(volume, now + duration * 0.25)
  gain.gain.exponentialRampToValueAtTime(volume * 0.5, now + duration * 0.6)
  gain.gain.exponentialRampToValueAtTime(0.0001, now + duration)

  src.connect(band).connect(high).connect(gain).connect(ac.destination)
  src.start(now)
  src.stop(now + duration)
}

/** Heavier, lower thump for the leather cover. */
export function playCoverOpen() {
  playPageTurn({ duration: 0.8, volume: 0.25 })
}
