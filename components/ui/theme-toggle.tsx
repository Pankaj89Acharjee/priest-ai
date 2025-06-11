"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"

export function ThemeToggle() {
  const [mounted, setMounted] = React.useState(false)
  const { theme, setTheme } = useTheme()

  // After mounting, we can safely show the theme toggle
  React.useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  const handleThemeChange = () => {
    const newTheme = theme === "light" ? "dark" : "light"
    setTheme(newTheme)
  }

  return (
    <button
      onClick={handleThemeChange}
      className="inline-flex h-9 w-9 items-center justify-center rounded-md p-2 hover:animate-pulse transition-colors"
    >
      <Sun
        className={`h-5 w-5 transition-all ${
          theme === 'dark' ? 'scale-100 rotate-0' : 'scale-0 -rotate-90'
        }`}
      />
      <Moon
        className={`absolute h-5 w-5 transition-all ${
          theme === 'light' ? 'scale-100 rotate-0' : 'scale-0 rotate-90'
        }`}
      />
      <span className="sr-only">Toggle theme</span>
    </button>
  )
} 