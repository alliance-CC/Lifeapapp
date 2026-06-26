"use client"

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react"
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client"

export type UserRole = "manager" | "leader" | "general"

export type Profile = {
  id: string
  name: string
  email: string
  role: UserRole
  department: string
  job_type: string
  avatar_url: string | null
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

  const fetchProfile = useCallback(async (userId: string) => {
    if (!isSupabaseConfigured()) {
      setLoading(false)
      return
    }
    try {
      const supabase = createClient()
      const { data } = await supabase
        .from("profiles")
        .select("id, name, email, role, department, job_type, avatar_url")
        .eq("id", userId)
        .single()
      if (data) setProfile(data as Profile)
    } catch {
      // profiles table may not exist yet
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (!isSupabaseConfigured()) {
      setLoading(false)
      return
    }
    const supabase = createClient()

    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) fetchProfile(user.id)
      else setLoading(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
      if (session?.user) fetchProfile(session.user.id)
      else { setProfile(null); setLoading(false) }
    })

    return () => subscription.unsubscribe()
  }, [fetchProfile])

  const refreshProfile = useCallback(async () => {
    if (!isSupabaseConfigured()) return
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (user) await fetchProfile(user.id)
  }, [fetchProfile])

  return (
    <ProfileContext.Provider value={{
      profile,
      loading,
      isManager: profile?.role === "manager",
      isLeader: profile?.role === "manager" || profile?.role === "leader",
      refreshProfile,
    }}>
      {children}
    </ProfileContext.Provider>
  )
}

export const useProfile = () => useContext(ProfileContext)
