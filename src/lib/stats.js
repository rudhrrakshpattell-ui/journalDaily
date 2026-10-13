import { addDays, daysBetween, todayKey } from './dates'

/** Each non-empty line of "What I learned" counts as one thing learned. */
export function countLearned(text) {
  return text
    .split('\n')
    .map((l) => l.replace(/^\s*([-*•·]|\d+[.)])\s*/, '').trim())
    .filter(Boolean).length
}

export function wordCount(entry) {
  return `${entry.learned} ${entry.improved} ${entry.note}`.trim().split(/\s+/).filter(Boolean).length
}

/** Streak still counts if today's page is not written yet but yesterday's is. */
export function currentStreak(dateSet, today = todayKey()) {
  let day = dateSet.has(today) ? today : addDays(today, -1)
  let streak = 0
  while (dateSet.has(day)) {
    streak++
    day = addDays(day, -1)
  }
  return streak
}

export function longestStreak(sortedDates) {
  let best = 0
  let run = 0
  for (let i = 0; i < sortedDates.length; i++) {
    run = i > 0 && daysBetween(sortedDates[i - 1], sortedDates[i]) === 1 ? run + 1 : 1
    best = Math.max(best, run)
  }
  return best
}

export const MILESTONES = [
  { days: 3, label: 'Three in a row', icon: 'sprout' },
  { days: 7, label: 'A full week', icon: 'star' },
  { days: 14, label: 'Fortnight of focus', icon: 'feather' },
  { days: 30, label: 'A month of growth', icon: 'laurel' },
  { days: 100, label: 'Centurion', icon: 'crown' },
]

export function computeStats(entries) {
  const sorted = [...entries].sort((a, b) => a.date.localeCompare(b.date))
  const dates = sorted.map((e) => e.date)
  const dateSet = new Set(dates)
  const tagCounts = {}
  for (const e of sorted) for (const t of e.tags) tagCounts[t] = (tagCounts[t] ?? 0) + 1
  const best = longestStreak(dates)

  return {
    totalEntries: sorted.length,
    totalLearned: sorted.reduce((n, e) => n + countLearned(e.learned), 0),
    totalWords: sorted.reduce((n, e) => n + wordCount(e), 0),
    streak: currentStreak(dateSet),
    longest: best,
    firstDate: dates[0] ?? null,
    tagCounts: Object.entries(tagCounts).sort((a, b) => b[1] - a[1]),
    ratings: sorted
      .filter((e) => e.mood || e.energy)
      .map((e) => ({ date: e.date, mood: e.mood, energy: e.energy })),
    milestones: MILESTONES.map((m) => ({ ...m, earned: best >= m.days })),
    wordsByDate: Object.fromEntries(sorted.map((e) => [e.date, wordCount(e)])),
  }
}
