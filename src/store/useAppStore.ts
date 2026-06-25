import { create } from 'zustand'
import { User, Character } from '@/types'

interface AppStore {
  user: User | null
  character: Character | null
  isLoading: boolean
  setUser: (user: User | null) => void
  setCharacter: (character: Character | null) => void
  setLoading: (loading: boolean) => void
}

export const useAppStore = create<AppStore>((set) => ({
  user: null,
  character: null,
  isLoading: false,
  setUser: (user) => set({ user }),
  setCharacter: (character) => set({ character }),
  setLoading: (isLoading) => set({ isLoading }),
}))
