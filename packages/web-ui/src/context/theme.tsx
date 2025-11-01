import { createContext, useContext, createEffect, createSignal, onCleanup, type ParentProps } from "solid-js"
import {
  initThemeManager,
  getCurrentTheme,
  getCurrentMode,
  setTheme,
  getThemeObject,
  getThemeList,
  onSystemThemeChange,
  type ThemeName,
} from "@/theme"
import { applyCSSProperties } from "@/theme/css-properties"

interface ThemeContextValue {
  current: () => ThemeName
  mode: () => "light" | "dark"
  setCurrent: (name: ThemeName) => Promise<void>
  list: () => ThemeName[]
}

const ctx = createContext<ThemeContextValue>()

export const ThemeProvider = (props: ParentProps) => {
  const [current, setCurrent] = createSignal<ThemeName>("system")
  const [mode, setMode] = createSignal<"light" | "dark">("light")
  const [ready, setReady] = createSignal(false)

  createEffect(async () => {
    await initThemeManager()
    setCurrent(getCurrentTheme())
    setMode(getCurrentMode())
    applyTheme()
    setReady(true)
  })

  createEffect(() => {
    const unsubscribe = onSystemThemeChange((newMode) => {
      setMode(newMode)
      applyTheme()
    })
    onCleanup(unsubscribe)
  })

  const applyTheme = () => {
    const obj = getThemeObject()
    const isDark = mode() === "dark"
    applyCSSProperties(obj, isDark)
    document.documentElement.classList.toggle("dark", isDark)
    document.documentElement.style.colorScheme = isDark ? "dark" : "light"
  }

  const handleSetCurrent = async (name: ThemeName) => {
    await setTheme(name)
    setCurrent(name)
    setMode(getCurrentMode())
    applyTheme()
  }

  const value: ThemeContextValue = {
    current,
    mode,
    setCurrent: handleSetCurrent,
    list: () => getThemeList(),
  }

  return <>{ready() ? <ctx.Provider value={value}>{props.children}</ctx.Provider> : null}</>
}

export function useTheme(): ThemeContextValue {
  const value = useContext(ctx)
  if (!value) throw new Error("useTheme must be used within a ThemeProvider")
  return value
}
