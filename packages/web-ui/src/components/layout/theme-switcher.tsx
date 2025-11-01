import { createSignal, For, Show } from "solid-js"
import { IconButton } from "@opencode-ai/ui"
import { useTheme } from "@/context/theme"
import { getThemeDisplayName } from "@/theme"

export function ThemeSwitcher() {
  const theme = useTheme()
  const [open, setOpen] = createSignal(false)
  const list = theme.list()

  const handleSelect = async (name: string) => {
    await theme.setCurrent(name as any)
    setOpen(false)
  }

  return (
    <div class="relative">
      <IconButton
        icon={theme.mode() === "dark" ? "sun" : "moon"}
        variant="ghost"
        onClick={() => setOpen(!open())}
        title="Change theme"
      />

      <Show when={open()}>
        <div class="absolute right-0 mt-2 w-48 bg-[var(--color-background-panel)] border border-[var(--color-border)] rounded-md shadow-lg z-50">
          <div class="max-h-64 overflow-y-auto">
            <For each={list}>
              {(name) => (
                <button
                  onClick={() => handleSelect(name)}
                  class={`w-full text-left px-4 py-2 flex items-center gap-2 hover:bg-[var(--color-background-element)] transition-colors ${
                    theme.current() === name ? "bg-[var(--color-background-element)]" : ""
                  }`}
                >
                  <div class="w-3 h-3 rounded-full" style={{ "background-color": "var(--color-primary)" }} />
                  <span class="text-sm text-[var(--color-text)]">{getThemeDisplayName(name)}</span>
                  <Show when={theme.current() === name}>
                    <span class="ml-auto text-xs">✓</span>
                  </Show>
                </button>
              )}
            </For>
          </div>
        </div>
      </Show>
    </div>
  )
}
