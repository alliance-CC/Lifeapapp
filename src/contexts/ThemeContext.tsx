"use client"

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react"

export type AppTheme = {
  accentColor: string
  bgImage: string | null
  bgOpacity: number
  glassIntensity: number
}

const defaultTheme: AppTheme = {
  accentColor: "#f97316",
  bgImage: null,
  bgOpacity: 0.2,
  glassIntensity: 5,
}

const ThemeContext = createContext<{
  theme: AppTheme
  updateTheme: (partial: Partial<AppTheme>) => void
}>({
  theme: defaultTheme,
  updateTheme: () => {},
})

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<AppTheme>(defaultTheme)

  useEffect(() => {
    const saved = localStorage.getItem("lifeup-theme")
    if (saved) {
      try {
        setTheme({ ...defaultTheme, ...JSON.parse(saved) })
      } catch {}
    }
  }, [])

  const updateTheme = useCallback((partial: Partial<AppTheme>) => {
    setTheme((prev) => {
      const next = { ...prev, ...partial }
      localStorage.setItem("lifeup-theme", JSON.stringify(next))
      return next
    })
  }, [])

  return (
    <ThemeContext.Provider value={{ theme, updateTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export const useTheme = () => useContext(ThemeContext)
