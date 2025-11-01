import type { Theme, ThemeJSON } from "./types"
import { parseTheme } from "./parser"

const THEME_NAMES = [
  "aura",
  "ayu",
  "catppuccin",
  "cobalt2",
  "dracula",
  "everforest",
  "github",
  "gruvbox",
  "kanagawa",
  "material",
  "matrix",
  "mellow",
  "monokai",
  "nightowl",
  "nord",
  "one-dark",
  "opencode",
  "palenight",
  "rosepine",
  "solarized",
  "synthwave84",
  "tokyonight",
  "vesper",
  "zenburn",
] as const

export type ThemeName = (typeof THEME_NAMES)[number] | "system"

const themes = new Map<ThemeName, Theme>()

async function loadTheme(name: Exclude<ThemeName, "system">): Promise<Theme> {
  if (themes.has(name)) return themes.get(name)!

  const module = await import(`./themes/${name}.json`)
  const data = module.default as ThemeJSON
  const theme = parseTheme(data)
  themes.set(name, theme)
  return theme
}

async function loadAllThemes(): Promise<void> {
  await Promise.all(THEME_NAMES.map((name) => loadTheme(name)))
}

function getSystemTheme(): "light" | "dark" {
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
}

let currentTheme: ThemeName = "system"
let currentMode: "light" | "dark" = "light"

export async function initThemeManager(): Promise<void> {
  await loadAllThemes()

  const stored = localStorage.getItem("opencode-theme") as ThemeName
  currentTheme = stored || "system"

  if (currentTheme === "system") {
    currentMode = getSystemTheme()
  }
}

export function getCurrentTheme(): ThemeName {
  return currentTheme
}

export function getCurrentMode(): "light" | "dark" {
  return currentMode
}

export async function setTheme(name: ThemeName): Promise<Theme> {
  currentTheme = name
  localStorage.setItem("opencode-theme", name)

  if (name === "system") {
    currentMode = getSystemTheme()
  }

  return getThemeObject()
}

export function getThemeObject(): Theme {
  const name = currentTheme === "system" ? "opencode" : currentTheme
  return themes.get(name)!
}

export function getThemeList(): ThemeName[] {
  return ["system", ...THEME_NAMES]
}

export function getThemeDisplayName(name: ThemeName): string {
  if (name === "system") return "System"
  return name
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ")
}

export function onSystemThemeChange(callback: (mode: "light" | "dark") => void): () => void {
  const matcher = window.matchMedia("(prefers-color-scheme: dark)")
  const handler = (e: MediaQueryListEvent) => {
    const mode = e.matches ? "dark" : "light"
    currentMode = mode
    if (currentTheme === "system") {
      callback(mode)
    }
  }

  matcher.addEventListener("change", handler)
  return () => matcher.removeEventListener("change", handler)
}
