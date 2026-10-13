export const DEFAULT_TAGS = ['coding', 'fitness', 'study', 'mindset', 'health', 'reading', 'creativity', 'work', 'social']

export function createEmptyEntry(date) {
  return {
    id: null,
    date,
    learned: '',
    improved: '',
    note: '',
    mood: null,
    energy: null,
    tags: [],
    createdAt: null,
    updatedAt: null,
  }
}

export function normalizeEntry(raw) {
  if (!raw || typeof raw.date !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(raw.date)) return null
  const rating = (v) => (Number.isInteger(v) && v >= 1 && v <= 5 ? v : null)
  return {
    id: raw.id ?? `entry-${raw.date}`,
    date: raw.date,
    learned: String(raw.learned ?? ''),
    improved: String(raw.improved ?? ''),
    note: String(raw.note ?? ''),
    mood: rating(raw.mood),
    energy: rating(raw.energy),
    tags: Array.isArray(raw.tags) ? [...new Set(raw.tags.map((t) => String(t).trim().toLowerCase()).filter(Boolean))] : [],
    createdAt: raw.createdAt ?? new Date().toISOString(),
    updatedAt: raw.updatedAt ?? new Date().toISOString(),
  }
}

export function isEntryEmpty(entry) {
  return !entry.learned.trim() && !entry.improved.trim() && !entry.note.trim()
}
