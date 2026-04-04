"use client"

import { createContext, useContext, useState } from "react"

// Shape of one entry
type Entry = {
  id: string
  site: string
  username: string
  password: string
  notes?: string
}

// Shape of everything the context holds
type VaultContextType = {
  entries: Entry[]
  setEntries: (entries: Entry[]) => void
  masterPassword: string
  setMasterPassword: (password: string) => void
}

// 1. Create the noticeboard (null = empty until Provider wraps it)
const VaultContext = createContext<VaultContextType | null>(null)

// 2. Provider — wraps the whole app, holds the actual state
export function VaultProvider({ children }: { children: React.ReactNode }) {
  const [entries, setEntries] = useState<Entry[]>([])
  const [masterPassword, setMasterPassword] = useState<string>("")

  return (
    <VaultContext.Provider value={{ entries, setEntries, masterPassword, setMasterPassword }}>
      {children}
    </VaultContext.Provider>
  )
}

// 3. Custom hook — easy way to read from the noticeboard
export function useVault() {
  const context = useContext(VaultContext)
  if (!context) throw new Error("useVault must be used inside VaultProvider")
  return context
}