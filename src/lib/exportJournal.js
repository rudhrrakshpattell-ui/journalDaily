import { normalizeEntry } from '../storage/entryModel'
import { todayKey } from './dates'

export function downloadJson(entries, owner) {
  const payload = {
    app: 'journal-daily',
    version: 1,
    exportedAt: new Date().toISOString(),
    owner: owner || null,
    entries: [...entries].sort((a, b) => a.date.localeCompare(b.date)),
  }
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `journal-daily-${todayKey()}.json`
  document.body.appendChild(a)
  a.click()
  a.remove()
  URL.revokeObjectURL(url)
}

/** Accepts our export format or a bare array of entries. */
export async function parseImportFile(file) {
  const data = JSON.parse(await file.text())
  const list = Array.isArray(data) ? data : data.entries
  if (!Array.isArray(list)) throw new Error('This file does not look like a Journal Daily export.')
  const entries = list.map(normalizeEntry).filter(Boolean)
  if (!entries.length) throw new Error('No diary entries were found in this file.')
  return entries
}
