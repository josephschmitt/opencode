import { createEffect, createSignal } from "solid-js"
import { IconButton } from "@opencode-ai/ui"

export function ThemeSwitcher() {
  const [isDark, setIsDark] = createSignal(false)

  createEffect(() => {
    const stored = localStorage.getItem("theme")
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches

    const dark = stored ? stored === "dark" : prefersDark
    setIsDark(dark)
    updateTheme(dark)
  })

  const updateTheme = (dark: boolean) => {
    const html = document.documentElement
    if (dark) {
      html.classList.add("dark")
      html.style.colorScheme = "dark"
    } else {
      html.classList.remove("dark")
      html.style.colorScheme = "light"
    }
    localStorage.setItem("theme", dark ? "dark" : "light")
  }

  const toggleTheme = () => {
    const newDark = !isDark()
    setIsDark(newDark)
    updateTheme(newDark)
  }

  return (
    <IconButton
      icon={isDark() ? "sun" : "moon"}
      variant="ghost"
      onClick={toggleTheme}
      title={`Switch to ${isDark() ? "light" : "dark"} mode`}
    />
  )
}
