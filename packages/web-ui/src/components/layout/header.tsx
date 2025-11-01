import { IconButton, Icon } from "@opencode-ai/ui"
import { ThemeSwitcher } from "./theme-switcher"
import { useSync } from "@/context/sync"
import { getFilename } from "@/utils"

interface HeaderProps {
  onSidebarToggle?: () => void
  sidebarOpen?: boolean
}

export function Header(props: HeaderProps) {
  const sync = useSync()

  return (
    <header class="h-12 shrink-0 bg-background-strong border-b border-border-weak-base flex items-center justify-between px-4">
      <div class="flex items-center gap-4">
        <IconButton
          icon="menu"
          variant="ghost"
          onClick={() => props.onSidebarToggle?.()}
          title={props.sidebarOpen ? "Close sidebar" : "Open sidebar"}
        />
        <div class="flex items-center gap-2">
          <Icon name="sparkles" size="small" />
          <span class="text-14-medium text-text-strong">{getFilename(sync.data.path.directory)}</span>
        </div>
      </div>
      <div class="flex items-center gap-2">
        <ThemeSwitcher />
      </div>
    </header>
  )
}
