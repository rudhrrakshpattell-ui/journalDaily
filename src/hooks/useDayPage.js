import { useState } from 'react'
import { useJournal } from './useJournal'
import { useBookNav } from './useBookNav'
import { createEmptyEntry, isEntryEmpty } from '../storage/entryModel'
import { todayKey } from '../lib/dates'

/** Everything a diary page for one date needs: its entry, draft and actions. */
export function useDayPage(date) {
  const { entries, drafts, setDraft, saveEntry, deleteEntry } = useJournal()
  const nav = useBookNav()
  const [error, setError] = useState('')
  const entry = entries[date] ?? null
  const draft = drafts[date] ?? null
  const isToday = date === todayKey()
  const editing = Boolean(draft) || (!entry && isToday)
  const value = draft ?? entry ?? createEmptyEntry(date)

  return {
    entry,
    value,
    editing,
    isToday,
    error,
    justSaved: nav?.lastSaved === date,
    update: (patch) => {
      setError('')
      setDraft(date, { ...value, ...patch })
    },
    startEdit: () => setDraft(date, { ...(entry ?? createEmptyEntry(date)) }),
    cancel: () => setDraft(date, null),
    save: async () => {
      if (isEntryEmpty(value)) {
        setError('Write at least a line before sealing this page.')
        return
      }
      await saveEntry(value)
      nav?.setLastSaved(date)
    },
    remove: () => deleteEntry(date),
  }
}
