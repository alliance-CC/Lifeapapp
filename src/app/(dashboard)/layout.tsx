"use client"

import { Sidebar } from "@/components/layout/Sidebar"
import { ThemeProvider, useTheme } from "@/contexts/ThemeContext"
import { ProfileProvider } from "@/contexts/ProfileContext"

function ThemedLayout({ children }: { children: React.ReactNode }) {
  const { theme } = useTheme()

  return (
    <div
      className="flex min-h-screen relative"
      style={{
        background: theme.bgImage
          ? `linear-gradient(to bottom right, #171717, #262626, #0a0a0a)`
          : "linear-gradient(to bottom right, #171717, #262626, #0a0a0a)",
      }}
    >
      {/* Background image overlay */}
      {theme.bgImage && (
        <div
          className="fixed inset-0 z-0 pointer-events-none"
          style={{
            backgroundImage: `url(${theme.bgImage})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            opacity: theme.bgOpacity,
          }}
        />
      )}

      {/* CSS variable for accent color */}
      <style>{`
        :root {
          --accent: ${theme.accentColor};
        }
        .accent-color { color: ${theme.accentColor}; }
        .accent-bg { background-color: ${theme.accentColor}; }
        .accent-border { border-color: ${theme.accentColor}; }
      `}</style>

      <div className="relative z-10 flex w-full min-h-screen">
        <Sidebar accentColor={theme.accentColor} />
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  )
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <ProfileProvider>
        <ThemedLayout>{children}</ThemedLayout>
      </ProfileProvider>
    </ThemeProvider>
  )
}
