"use client"

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react"

export type UserRole = "manager" | "leader" | "general"

export type Profile = {
  id: string
  name: string
  email: string
  role: UserRole
  department: string
  job_type: string
  avatar_url: string | null
  level?: number
  experience?: number
}

type ProfileContextType = {
  profile: Profile | null
  loading: boolean
  isManager: boolean
  isLeader: boolean
  refreshProfile: () => Promise<void>
}

const ProfileContext = createContext<ProfileContextType>({
  profile: null,
  loading: true,
  isManager: false,
  isLeader: false,
  refreshProfile: async () => {},
})

export function ProfileProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchProfile = useCallback(async () => {
    try {
      const res = await fetch("/api/auth/me", { cache: "no-store" })
      const data = await res.json()
      setProfile(data.user ?? null)
    } catch {
      setProfile(null)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchProfile()
  }, [fetchProfile])

  return (
    <ProfileContext.Provider value={{
      profile,
      loading,
      isManager: profile?.role === "manager",
      isLeader: profile?.role === "manager" || profile?.role === "leader",
      refreshProfile: fetchProfile,
    }}>
      {children}
    </ProfileContext.Provider>
  )
}

export const useProfile = () => useContext(ProfileContext)
