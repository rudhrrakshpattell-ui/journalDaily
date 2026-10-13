import { createLocalStorageAdapter } from './localStorageAdapter'

/**
 * JournalStore contract (every method returns a Promise):
 *
 *   listEntries()            -> Entry[]
 *   getEntry(date)           -> Entry | null      date is 'YYYY-MM-DD'
 *   saveEntry(entry)         -> Entry             one entry per calendar day
 *   deleteEntry(date)        -> void
 *   importEntries(entries)   -> Entry[]           merge by date, returns all
 *   getSettings()            -> Settings
 *   saveSettings(settings)   -> Settings
 *   getDrafts()              -> { [date]: Entry }  unsaved pages in progress
 *   saveDrafts(drafts)       -> void
 *
 * Entry: { id, date, learned, improved, note, mood, energy, tags[], createdAt, updatedAt }
 *
 * To add accounts later, write e.g. createApiAdapter(token) with the same
 * methods (fetch calls to your backend) and return it from getStore().
 */
let store = createLocalStorageAdapter()

export function getStore() {
  return store
}

export function setStore(nextStore) {
  store = nextStore
}
