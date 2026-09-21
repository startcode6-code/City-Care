"use client"

import * as React from "react"
import { useTheme } from "next-themes"

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  // Avoid hydration mismatch
  React.useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return <div className="theme-toggle-skeleton" aria-hidden="true" />
  }

  const isDark = resolvedTheme === "dark"

  return (
    <button
      id="theme-toggle-btn"
      className="theme-toggle"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      title={isDark ? "Switch to light mode" : "Switch to dark mode"}
    >
      {/* Track */}
      <span className="theme-toggle__track">
        {/* Sun icon (light) */}
        <span className="theme-toggle__icon theme-toggle__icon--sun" aria-hidden="true">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
            <circle cx="12" cy="12" r="4" />
            <path d="M12 2v2M12 20v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M2 12h2M20 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" strokeLinecap="round" strokeWidth="2" stroke="currentColor" fill="none" />
          </svg>
        </span>
        {/* Moon icon (dark) */}
        <span className="theme-toggle__icon theme-toggle__icon--moon" aria-hidden="true">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
          </svg>
        </span>
      </span>
      {/* Thumb */}
      <span className="theme-toggle__thumb" aria-hidden="true" />
    </button>
  )
}
