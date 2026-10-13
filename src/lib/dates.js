const pad = (n) => String(n).padStart(2, '0')

export function toKey(d) {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
}

export function fromKey(key) {
  const [y, m, d] = key.split('-').map(Number)
  return new Date(y, m - 1, d)
}

export function todayKey() {
  return toKey(new Date())
}

export function addDays(key, n) {
  const d = fromKey(key)
  d.setDate(d.getDate() + n)
  return toKey(d)
}

export function daysBetween(a, b) {
  return Math.round((fromKey(b) - fromKey(a)) / 86400000)
}

const ORDINAL = (n) => {
  const s = ['th', 'st', 'nd', 'rd']
  const v = n % 100
  return n + (s[(v - 20) % 10] || s[v] || s[0])
}

/** "Tuesday, the 13th of October" */
export function longDate(key) {
  const d = fromKey(key)
  const weekday = d.toLocaleDateString('en-GB', { weekday: 'long' })
  const month = d.toLocaleDateString('en-GB', { month: 'long' })
  return `${weekday}, the ${ORDINAL(d.getDate())} of ${month}`
}

export function shortDate(key) {
  return fromKey(key).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
}

export function year(key) {
  return fromKey(key).getFullYear()
}

export function monthLabel(key) {
  return fromKey(key).toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })
}
