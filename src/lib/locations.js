import { todayKey } from './dates'

/**
 * A location is a place in the book:
 *   { view: 'front' } | { view: 'day', date } | { view: 'compare' }
 *   { view: 'progress', page: 0 | 1 } | { view: 'index' }
 * Sections are ordered front-to-back so we know which way to turn.
 */
const ORDER = { front: 0, day: 1, compare: 2, progress: 3, index: 4 }

export function locationKey(loc) {
  if (loc.view === 'day') return `day:${loc.date}`
  if (loc.view === 'progress') return `progress:${loc.page ?? 0}`
  return loc.view
}

export function compareLocations(a, b) {
  if (ORDER[a.view] !== ORDER[b.view]) return ORDER[a.view] - ORDER[b.view]
  if (a.view === 'day') return a.date.localeCompare(b.date)
  if (a.view === 'progress') return (a.page ?? 0) - (b.page ?? 0)
  return 0
}

/** Days you can flip through: every written page plus today. */
function dayStops(dates, current) {
  const set = new Set(dates)
  set.add(todayKey())
  if (current) set.add(current)
  return [...set].filter((d) => d <= todayKey()).sort()
}

export function nextLocation(loc, dates) {
  const today = todayKey()
  switch (loc.view) {
    case 'front':
      return { view: 'day', date: dayStops(dates)[0] }
    case 'day': {
      const stops = dayStops(dates, loc.date)
      const i = stops.indexOf(loc.date)
      return i < stops.length - 1 ? { view: 'day', date: stops[i + 1] } : { view: 'compare' }
    }
    case 'compare':
      return { view: 'progress', page: 0 }
    case 'progress':
      return loc.page === 0 ? { view: 'progress', page: 1 } : { view: 'index' }
    default:
      return loc.view === 'index' ? null : { view: 'day', date: today }
  }
}

export function prevLocation(loc, dates) {
  switch (loc.view) {
    case 'front':
      return null
    case 'day': {
      const stops = dayStops(dates, loc.date)
      const i = stops.indexOf(loc.date)
      return i > 0 ? { view: 'day', date: stops[i - 1] } : { view: 'front' }
    }
    case 'compare':
      return { view: 'day', date: todayKey() }
    case 'progress':
      return loc.page === 1 ? { view: 'progress', page: 0 } : { view: 'compare' }
    case 'index':
      return { view: 'progress', page: 1 }
    default:
      return null
  }
}

/** Page numbers for the corners, counted like a real book. */
export function pageNumbers(loc, dates) {
  const stops = dayStops(dates)
  const base = (() => {
    switch (loc.view) {
      case 'front':
        return 0
      case 'day':
        return 1 + Math.max(0, stops.indexOf(loc.date))
      case 'compare':
        return 1 + stops.length
      case 'progress':
        return 2 + stops.length + (loc.page ?? 0)
      default:
        return 4 + stops.length
    }
  })()
  return [base * 2, base * 2 + 1]
}
