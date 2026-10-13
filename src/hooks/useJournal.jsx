import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { getStore } from '../storage'
import { normalizeEntry } from '../storage/entryModel'
import { setMuted } from '../lib/sound'

const JournalContext = createContext(null)

const DEFAULT_SETTINGS = { owner: '', muted: false }

export function JournalProvider({ children }) {
  const [entries, setEntries] = useState({})
  const [settings, setSettings] = useState(DEFAULT_SETTINGS)
  const [drafts, setDrafts] = useState({})
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const store = getStore()
    Promise.all([store.listEntries(), store.getSettings(), store.getDrafts()]).then(([list, saved, savedDrafts]) => {
      setEntries(Object.fromEntries(list.map((e) => [e.date, e])))
      setDrafts(savedDrafts ?? {})
      const merged = { ...DEFAULT_SETTINGS, ...saved }
      setSettings(merged)
      setMuted(merged.muted)
      setReady(true)
    })
  }, [])

  /** An open draft for a date means that page is being written or edited. */
  const setDraft = useCallback((date, draft) => {
    setDrafts((prev) => {
      const next = { ...prev }
      if (draft) next[date] = draft
      else delete next[date]
      getStore().saveDrafts(next)
      return next
    })
  }, [])

  const saveEntry = useCallback(async (draft) => {
    const now = new Date().toISOString()
    const entry = normalizeEntry({
      ...draft,
      id: draft.id ?? `entry-${draft.date}`,
      createdAt: draft.createdAt ?? now,
      updatedAt: now,
    })
    await getStore().saveEntry(entry)
    setEntries((prev) => ({ ...prev, [entry.date]: entry }))
    setDraft(entry.date, null)
    return entry
  }, [setDraft])

  const deleteEntry = useCallback(async (date) => {
    await getStore().deleteEntry(date)
    setEntries((prev) => {
      const next = { ...prev }
      delete next[date]
      return next
    })
    setDraft(date, null)
  }, [setDraft])

  const importEntries = useCallback(async (list) => {
    const all = await getStore().importEntries(list)
    setEntries(Object.fromEntries(all.map((e) => [e.date, e])))
    return list.length
  }, [])

  const updateSettings = useCallback(async (patch) => {
    setSettings((prev) => {
      const next = { ...prev, ...patch }
      getStore().saveSettings(next)
      setMuted(next.muted)
      return next
    })
  }, [])

  const value = useMemo(() => {
    const list = Object.values(entries).sort((a, b) => a.date.localeCompare(b.date))
    return { ready, entries, list, drafts, settings, setDraft, saveEntry, deleteEntry, importEntries, updateSettings }
  }, [ready, entries, drafts, settings, setDraft, saveEntry, deleteEntry, importEntries, updateSettings])

  return <JournalContext.Provider value={value}>{children}</JournalContext.Provider>
}

export function useJournal() {
  const ctx = useContext(JournalContext)
  if (!ctx) throw new Error('useJournal must be used inside <JournalProvider>')
  return ctx
}
