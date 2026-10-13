/**
 * Browser storage adapter. Implements the JournalStore contract described in
 * ./index.js using window.localStorage. All methods are async so a network
 * backend can be swapped in without touching the UI.
 */
const ENTRIES_KEY = 'journal-daily:v1:entries'
const SETTINGS_KEY = 'journal-daily:v1:settings'
const DRAFTS_KEY = 'journal-daily:v1:drafts'

function read(key, fallback) {
  try {
    const raw = window.localStorage.getItem(key)
    return raw ? JSON.parse(raw) : fallback
  } catch {
    return fallback
  }
}

function write(key, value) {
  window.localStorage.setItem(key, JSON.stringify(value))
}

export function createLocalStorageAdapter() {
  return {
    async listEntries() {
      return Object.values(read(ENTRIES_KEY, {}))
    },

    async getEntry(date) {
      return read(ENTRIES_KEY, {})[date] ?? null
    },

    async saveEntry(entry) {
      const all = read(ENTRIES_KEY, {})
      all[entry.date] = entry
      write(ENTRIES_KEY, all)
      return entry
    },

    async deleteEntry(date) {
      const all = read(ENTRIES_KEY, {})
      delete all[date]
      write(ENTRIES_KEY, all)
    },

    async importEntries(entries) {
      const all = read(ENTRIES_KEY, {})
      for (const entry of entries) all[entry.date] = entry
      write(ENTRIES_KEY, all)
      return Object.values(all)
    },

    async getSettings() {
      return read(SETTINGS_KEY, {})
    },

    async saveSettings(settings) {
      write(SETTINGS_KEY, settings)
      return settings
    },

    async getDrafts() {
      return read(DRAFTS_KEY, {})
    },

    async saveDrafts(drafts) {
      write(DRAFTS_KEY, drafts)
    },
  }
}
