import { createContext, useContext } from 'react'

/** Lets any page turn the book: go({ view, date? , page? }). */
export const BookNavContext = createContext(null)

export function useBookNav() {
  return useContext(BookNavContext)
}
