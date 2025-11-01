import type { Component, JSX } from "solid-js"
import { createMemo, splitProps } from "solid-js"

export type FileIconProps = JSX.HTMLAttributes<HTMLDivElement> & {
  node: { path: string; type: "file" | "directory" }
  expanded?: boolean
}

const ICON_MAPS = {
  fileNames: {
    "readme.md": "📋",
    "package.json": "📦",
    "tsconfig.json": "⚙️",
    dockerfile: "🐳",
    ".gitignore": "🔒",
    makefile: "🔨",
    ".env": "🔑",
    ".editorconfig": "⚙️",
    "robots.txt": "🤖",
    "favicon.ico": "🎨",
  } as Record<string, string>,
  fileExtensions: {
    ts: "📘",
    tsx: "⚛️",
    js: "📙",
    jsx: "⚛️",
    json: "📋",
    html: "🌐",
    css: "🎨",
    scss: "🎨",
    md: "📝",
    py: "🐍",
    go: "🐹",
    rs: "🦀",
    java: "☕",
    rb: "💎",
    php: "🐘",
    sql: "🗄️",
    sh: "💻",
    bash: "💻",
    xml: "📋",
    yml: "📋",
    yaml: "📋",
    toml: "📋",
    svg: "🎨",
    png: "🖼️",
    jpg: "🖼️",
    gif: "🎬",
    mp4: "🎥",
    mp3: "🎵",
    zip: "📦",
    tar: "📦",
  } as Record<string, string>,
  folderNames: {
    src: "📂",
    test: "🧪",
    tests: "🧪",
    dist: "📦",
    build: "🏗️",
    docs: "📚",
    public: "🌐",
    assets: "🎨",
    node_modules: "📦",
    ".git": "🔒",
    ".vscode": "💻",
    ".idea": "💻",
  } as Record<string, string>,
  defaults: {
    file: "📄",
    folder: "📁",
    folderOpen: "📂",
  },
}

const basenameOf = (p: string) =>
  p
    .replace(/[/\\]+$/, "")
    .split(/[\\/]/)
    .pop() ?? ""

const chooseEmoji = (path: string, type: "directory" | "file", expanded: boolean): string => {
  const base = basenameOf(path)
  const baseLower = base.toLowerCase()

  if (type === "directory") {
    const folderIcon = ICON_MAPS.folderNames[baseLower]
    if (folderIcon) return folderIcon
    return expanded ? ICON_MAPS.defaults.folderOpen : ICON_MAPS.defaults.folder
  }

  const byName = ICON_MAPS.fileNames[baseLower]
  if (byName) return byName

  const ext = baseLower.split(".").pop() ?? ""
  const byExt = ICON_MAPS.fileExtensions[ext]
  if (byExt) return byExt

  return ICON_MAPS.defaults.file
}

export const FileIcon: Component<FileIconProps> = (props) => {
  const [local, rest] = splitProps(props, ["node", "class", "expanded"])
  const emoji = createMemo(() => chooseEmoji(local.node.path, local.node.type, local.expanded || false))

  return (
    <div
      {...rest}
      classList={{
        "inline-flex items-center justify-center shrink-0 size-4 text-sm": true,
        [local.class ?? ""]: !!local.class,
      }}
    >
      {emoji()}
    </div>
  )
}
