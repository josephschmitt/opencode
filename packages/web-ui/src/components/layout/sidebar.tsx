import { useLocal, type LocalFile } from "@/context/local"
import { useSync } from "@/context/sync"
import { Button, List, Tooltip } from "@opencode-ai/ui"
import { createMemo } from "solid-js"
import { DateTime } from "luxon"
import { getFilename } from "@/utils"
import FileTree from "@/components/file/file-tree"
import { DiffChanges } from "@opencode-ai/ui"

interface SidebarProps {
  onFileClick?: (file: LocalFile) => void
  onNewSession?: () => void
}

export function Sidebar(props: SidebarProps) {
  const local = useLocal()
  const sync = useSync()

  return (
    <div class="w-70 shrink-0 bg-background-weak border-r border-border-weak-base flex flex-col items-start overflow-hidden">
      <div class="h-10 flex items-center self-stretch px-5 border-b border-border-weak-base">
        <span class="text-14-regular overflow-hidden text-ellipsis">{getFilename(sync.data.path.directory)}</span>
      </div>
      <div class="flex flex-col items-start gap-4 self-stretch flex-1 py-4 px-3 overflow-y-auto">
        <Button class="w-full" size="large" onClick={props.onNewSession} icon="edit-small-2">
          New Session
        </Button>
        <List
          data={sync.data.session}
          key={(x) => x.id}
          current={local.session.active()}
          onSelect={(s) => local.session.setActive(s?.id)}
          onHover={(s) => (!!s ? sync.session.sync(s?.id) : undefined)}
        >
          {(session) => {
            const diffs = createMemo(() => session.summary?.diffs ?? [])
            const filesChanged = createMemo(() => diffs().length)
            const updated = DateTime.fromMillis(session.time.updated)
            return (
              <Tooltip placement="right" value={session.title}>
                <div>
                  <div class="flex items-center self-stretch gap-6 justify-between">
                    <span class="text-14-regular text-text-strong overflow-hidden text-ellipsis truncate">
                      {session.title}
                    </span>
                    <span class="text-12-regular text-text-weak text-right whitespace-nowrap">
                      {Math.abs(updated.diffNow().as("seconds")) < 60
                        ? "Now"
                        : updated
                            .toRelative({ style: "short", unit: ["days", "hours", "minutes"] })
                            ?.replace(" ago", "")
                            ?.replace(/ days?/, "d")
                            ?.replace(" min.", "m")
                            ?.replace(" hr.", "h")}
                    </span>
                  </div>
                  <div class="flex justify-between items-center self-stretch">
                    <span class="text-12-regular text-text-weak">{`${filesChanged() || "No"} file${filesChanged() !== 1 ? "s" : ""} changed`}</span>
                    <DiffChanges diff={diffs()} />
                  </div>
                </div>
              </Tooltip>
            )
          }}
        </List>
      </div>
    </div>
  )
}

interface FileExplorerProps {
  onFileClick?: (file: LocalFile) => void
}

export function FileExplorer(props: FileExplorerProps) {
  return (
    <div class="w-56 shrink-0 bg-background-weak border-r border-border-weak-base flex flex-col p-2 overflow-y-auto">
      <h3 class="text-12-medium text-text-weak px-2 py-2 mb-2">Files</h3>
      <FileTree path="" onFileClick={props.onFileClick} />
    </div>
  )
}
