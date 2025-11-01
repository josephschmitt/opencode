export type ShortcutHandler = (event: KeyboardEvent) => void

export interface ShortcutConfig {
  key: string
  ctrlOrCmd?: boolean
  shift?: boolean
  alt?: boolean
  handler: ShortcutHandler
}

const MOD = typeof navigator === "object" && /(Mac|iPod|iPhone|iPad)/.test(navigator.platform) ? "Meta" : "Control"

export function createShortcutHandler(shortcuts: ShortcutConfig[]) {
  return (event: KeyboardEvent) => {
    for (const shortcut of shortcuts) {
      const keyMatches = event.key.toLowerCase() === shortcut.key.toLowerCase()
      const ctrlOrCmdMatches = event.getModifierState(MOD) === (shortcut.ctrlOrCmd ?? false)
      const shiftMatches = event.shiftKey === (shortcut.shift ?? false)
      const altMatches = event.altKey === (shortcut.alt ?? false)

      if (keyMatches && ctrlOrCmdMatches && shiftMatches && altMatches) {
        event.preventDefault()
        shortcut.handler(event)
        return
      }
    }
  }
}

export function isModifierKey(key: string): boolean {
  return ["Control", "Meta", "Shift", "Alt"].includes(key)
}

export function isPrintableKey(key: string): boolean {
  return key.length === 1 && key !== "Unidentified"
}

export { MOD }
