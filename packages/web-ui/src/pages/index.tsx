import { Button, Icon, Markdown, Typewriter, Collapsible, Message } from "@opencode-ai/ui"
import { For, onCleanup, onMount, createSignal, createEffect, createMemo, Show, Switch, Match } from "solid-js"
import { useLocal, type LocalFile } from "@/context/local"
import { useSync } from "@/context/sync"
import { useSDK } from "@/context/sdk"
import { PromptInput, type ContentPart } from "@/components/prompt-input"
import { MessageProgress } from "@/components/message-progress"
import { getDirectory, getFilename } from "@/utils"
import { Header } from "@/components/layout/header"
import { Sidebar, FileExplorer } from "@/components/layout/sidebar"
import type { AssistantMessage as AssistantMessageType } from "@opencode-ai/sdk"
import { createShortcutHandler } from "@/utils/shortcuts"

export default function Page() {
  const local = useLocal()
  const sync = useSync()
  const sdk = useSDK()
  let inputRef!: HTMLDivElement
  const [expanded, setExpanded] = createSignal(false)
  const [sidebarOpen, setSidebarOpen] = createSignal(true)
  const [fileExplorerOpen, setFileExplorerOpen] = createSignal(false)

  onMount(() => {
    const handler = createShortcutHandler([
      {
        key: "p",
        ctrlOrCmd: true,
        handler: () => setFileExplorerOpen(!fileExplorerOpen()),
      },
      {
        key: "n",
        ctrlOrCmd: true,
        handler: () => handleNewSession(),
      },
    ])
    document.addEventListener("keydown", handleKeyDown)
    document.addEventListener("keydown", handler)
  })

  onCleanup(() => {
    document.removeEventListener("keydown", handleKeyDown)
  })

  const handleKeyDown = (event: KeyboardEvent) => {
    const focused = document.activeElement === inputRef
    if (focused) {
      if (event.key === "Escape") {
        inputRef?.blur()
      }
      return
    }

    if (event.key.length === 1 && event.key !== "Unidentified" && !(event.ctrlKey || event.metaKey)) {
      inputRef?.focus()
    }
  }

  const handlePromptSubmit = async (parts: ContentPart[]) => {
    const existingSession = local.session.active()
    let session = existingSession
    if (!session) {
      const created = await sdk.client.session.create()
      session = created.data ?? undefined
    }
    if (!session) return

    local.session.setActive(session.id)
    const toAbsolutePath = (path: string) => (path.startsWith("/") ? path : sync.absolute(path))

    const text = parts.map((part) => part.content).join("")
    const attachments = parts.filter((part) => part.type === "file")

    const attachmentParts = attachments.map((attachment) => {
      const absolute = toAbsolutePath(attachment.path)
      const query = attachment.selection
        ? `?start=${attachment.selection.startLine}&end=${attachment.selection.endLine}`
        : ""
      return {
        type: "file" as const,
        mime: "text/plain",
        url: `file://${absolute}${query}`,
        filename: getFilename(attachment.path),
        source: {
          type: "file" as const,
          text: {
            value: attachment.content,
            start: attachment.start,
            end: attachment.end,
          },
          path: absolute,
        },
      }
    })

    await sdk.client.session.prompt({
      path: { id: session.id },
      body: {
        agent: local.agent.current()!.name,
        model: {
          modelID: local.model.current()!.id,
          providerID: local.model.current()!.provider.id,
        },
        parts: [
          {
            type: "text",
            text,
          },
          ...attachmentParts,
        ],
      },
    })
  }

  const handleNewSession = () => {
    local.session.setActive(undefined)
    inputRef?.focus()
  }

  const handleFileClick = (file: LocalFile) => {
    local.file.open(file.path, { pinned: true })
  }

  return (
    <div class="relative h-screen flex flex-col bg-background-base">
      <Header onSidebarToggle={() => setSidebarOpen(!sidebarOpen())} sidebarOpen={sidebarOpen()} />
      <main class="flex-1 min-h-0 flex overflow-hidden">
        <Show when={sidebarOpen()}>
          <Sidebar onFileClick={handleFileClick} onNewSession={handleNewSession} />
        </Show>
        <div class="flex-1 min-h-0 flex flex-col overflow-hidden">
          <Show
            when={local.session.active()}
            fallback={
              <div class="flex-1 flex flex-col items-center justify-center gap-6 px-6">
                <div class="text-center">
                  <h1 class="text-24-semibold text-text-strong mb-2">Start a new session</h1>
                  <p class="text-14-regular text-text-weak">
                    {getDirectory(sync.data.path.directory)}
                    <span class="text-text-strong">{getFilename(sync.data.path.directory)}</span>
                  </p>
                </div>
                <Button size="large" onClick={handleNewSession} icon="edit-small-2">
                  New Session
                </Button>
              </div>
            }
          >
            {(activeSession) => {
              const userMessages = createMemo(() => local.session.userMessages())
              return (
                <div class="flex-1 min-h-0 flex flex-col overflow-hidden">
                  <div class="flex-1 min-h-0 overflow-y-auto px-6 pt-8">
                    <div class="max-w-2xl mx-auto w-full flex flex-col gap-8 pb-32">
                      <For each={userMessages()}>
                        {(message, index) => {
                          const [titled, setTitled] = createSignal(!!message.summary?.title)
                          const [completed, setCompleted] = createSignal(!!message.summary?.body)
                          const title = createMemo(() => message.summary?.title)
                          const summary = createMemo(() => message.summary?.body)
                          const userParts = createMemo(() => sync.data.part[message.id] || [])
                          const userText = createMemo(() => {
                            const textParts = userParts().filter((p) => p?.type === "text")
                            return textParts.map((p) => p.text).join("\n")
                          })
                          const assistantMessages = createMemo(() => {
                            return sync.data.message[activeSession().id]?.filter(
                              (m) => m.role === "assistant" && m.parentID == message.id,
                            ) as AssistantMessageType[]
                          })
                          const hasToolPart = createMemo(() =>
                            assistantMessages()
                              ?.flatMap((m) => sync.data.part[m.id])
                              .some((p) => p?.type === "tool"),
                          )
                          const working = createMemo(() => !summary())
                          const isLastMessage = createMemo(() => index() === userMessages().length - 1)

                          createEffect(() => {
                            title()
                            setTimeout(() => setTitled(!!title()), 10_000)
                          })
                          createEffect(() => {
                            summary()
                            setTimeout(() => setCompleted(!!summary()), 1200)
                          })

                          return (
                            <div class="flex flex-col gap-6">
                              <Show when={title() && title() !== "│"}>
                                <div class="py-2 flex flex-col gap-2">
                                  <div class="w-full text-14-medium text-text-strong">
                                    <Show
                                      when={titled()}
                                      fallback={
                                        <Typewriter
                                          as="h2"
                                          text={title() ?? ""}
                                          class="overflow-hidden text-ellipsis min-w-0 text-nowrap"
                                        />
                                      }
                                    >
                                      {(t) => <h2 class="overflow-hidden text-ellipsis min-w-0 text-nowrap">{t()}</h2>}
                                    </Show>
                                  </div>
                                </div>
                              </Show>

                              <Show when={completed() || userText()}>
                                <div class="w-full flex flex-col gap-4">
                                  <Show
                                    when={summary()}
                                    fallback={
                                      <Show when={userText()}>
                                        {(text) => (
                                          <Markdown classList={{ "[&>*]:fade-up-text": true }} text={text()} />
                                        )}
                                      </Show>
                                    }
                                  >
                                    {(sum) => <Markdown classList={{ "[&>*]:fade-up-text": true }} text={sum()} />}
                                  </Show>

                                  <Show when={hasToolPart()}>
                                    <Collapsible variant="ghost" open={expanded()} onOpenChange={setExpanded}>
                                      <Collapsible.Trigger class="text-text-weak hover:text-text-strong">
                                        <div class="flex items-center gap-1">
                                          <div class="text-12-medium">
                                            <Switch>
                                              <Match when={expanded()}>Hide details</Match>
                                              <Match when={!expanded()}>Show details</Match>
                                            </Switch>
                                          </div>
                                          <Collapsible.Arrow />
                                        </div>
                                      </Collapsible.Trigger>
                                      <Collapsible.Content>
                                        <div class="w-full flex flex-col gap-3 pt-3">
                                          <For each={assistantMessages()}>
                                            {(assistantMessage) => {
                                              const parts = createMemo(() => sync.data.part[assistantMessage.id])
                                              return <Message message={assistantMessage} parts={parts()} />
                                            }}
                                          </For>
                                        </div>
                                      </Collapsible.Content>
                                    </Collapsible>
                                  </Show>
                                </div>
                              </Show>

                              <Show when={!completed() && !userText() && isLastMessage() && working()}>
                                <MessageProgress assistantMessages={assistantMessages} done={!working()} />
                              </Show>
                            </div>
                          )
                        }}
                      </For>
                    </div>
                  </div>
                </div>
              )
            }}
          </Show>

          <div class="shrink-0 px-6 py-8 max-w-4xl mx-auto w-full">
            <PromptInput
              ref={(el) => {
                inputRef = el
              }}
              onSubmit={handlePromptSubmit}
            />
          </div>
        </div>
        <Show when={fileExplorerOpen()}>
          <FileExplorer onFileClick={handleFileClick} />
        </Show>
      </main>
    </div>
  )
}
