import { bundledLanguages, type BundledLanguage, type ShikiTransformer } from "shiki"
import { splitProps, type ComponentProps, createEffect, onMount, onCleanup, createMemo, createResource } from "solid-js"
import { useLocal, type TextSelection } from "@/context/local"
import { getFileExtension, getCharacterOffsetInLine, getSelectionInContainer } from "@/utils"
import { useShiki } from "@opencode-ai/ui"

type DefinedSelection = Exclude<TextSelection, undefined>

interface Props extends ComponentProps<"div"> {
  code: string
  path: string
}

export function Code(props: Props) {
  const ctx = useLocal()
  const highlighter = useShiki()
  const [local, others] = splitProps(props, ["class", "classList", "code", "path"])
  const lang = createMemo(() => {
    const ext = getFileExtension(local.path)
    if (ext in bundledLanguages) return ext
    return "text"
  })

  let container: HTMLDivElement | undefined
  let isProgrammaticSelection = false

  const ranges = createMemo<DefinedSelection[]>(() => {
    const items = ctx.context.all() as Array<{ type: "file"; path: string; selection?: DefinedSelection }>
    const result: DefinedSelection[] = []
    for (const item of items) {
      if (item.path !== local.path) continue
      const selection = item.selection
      if (!selection) continue
      result.push(selection)
    }
    return result
  })

  const createLineNumberTransformer = (selections: DefinedSelection[]): ShikiTransformer => {
    const highlighted = new Set<number>()
    for (const selection of selections) {
      const startLine = selection.startLine
      const endLine = selection.endLine
      const start = Math.max(1, Math.min(startLine, endLine))
      const end = Math.max(start, Math.max(startLine, endLine))
      const count = end - start + 1
      if (count <= 0) continue
      const values = Array.from({ length: count }, (_, index) => start + index)
      for (const value of values) highlighted.add(value)
    }

    return {
      name: "highlight-lines",
      line(node, line) {
        if (highlighted.has(line)) {
          node.properties = node.properties ?? {}
          node.properties.class = (node.properties.class as string) + " bg-surface-raised-base-hover"
        }
      },
    }
  }

  const [html] = createResource(
    () => ({ code: local.code, lang: lang() }),
    async (data) => {
      if (!highlighter.codeToHtml) return "<pre></pre>"
      const result = await highlighter.codeToHtml(data.code, {
        lang: data.lang as BundledLanguage,
        theme: "light-plus",
        transformers: [createLineNumberTransformer(ranges())],
      })
      return result
    },
  )

  createEffect(() => {
    if (!container) return
    container.innerHTML = html() ?? ""
  })

  onMount(() => {
    if (!container) return
    const handleMouseDown = (e: MouseEvent) => {
      isProgrammaticSelection = false
      const target = e.target as HTMLElement
      if (target.tagName === "SPAN" && target.parentElement?.tagName === "CODE") {
        const lineElement = target.closest(".line") as HTMLElement | null
        if (!lineElement) return
        const charIndex = getCharacterOffsetInLine(lineElement, target, 0)
        const lineNumber = getLineNumber(target)
        if (lineNumber === undefined) return
        ctx.context.add({
          type: "file",
          path: local.path,
          selection: {
            startLine: lineNumber,
            startChar: charIndex,
            endLine: lineNumber,
            endChar: charIndex,
          },
        })
      }
    }

    const handleMouseUp = () => {
      if (isProgrammaticSelection) return
      const selection = getSelectionInContainer(container!)
      if (!selection) return
      ctx.context.add({
        type: "file",
        path: local.path,
        selection: {
          startLine: selection.sl,
          startChar: selection.sch,
          endLine: selection.el,
          endChar: selection.ech,
        },
      })
    }

    container.addEventListener("mousedown", handleMouseDown)
    container.addEventListener("mouseup", handleMouseUp)

    onCleanup(() => {
      container?.removeEventListener("mousedown", handleMouseDown)
      container?.removeEventListener("mouseup", handleMouseUp)
    })
  })

  return (
    <div
      ref={container}
      {...others}
      classList={{
        "[&_pre]:bg-background-base [&_pre]:border-none [&_pre]:!p-0 [&_pre]:rounded-0": true,
        "[&_code]:text-12-regular [&_code]:font-mono": true,
        "[&_code_span]:leading-[1.6]": true,
        ...(local.classList ?? {}),
        [local.class ?? ""]: !!local.class,
      }}
    />
  )
}

function getLineNumber(node: HTMLElement): number | undefined {
  let current: HTMLElement | null = node
  while (current) {
    const index = Array.from(current.parentElement?.children ?? []).indexOf(current)
    if (index !== -1) return index + 1
    current = current.parentElement as HTMLElement | null
  }
  return undefined
}
