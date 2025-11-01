import type { Theme } from "./types"

type ThemeKey = keyof Theme

const cssVarMap: Record<ThemeKey, string> = {
  background: "--color-background",
  backgroundPanel: "--color-background-panel",
  backgroundElement: "--color-background-element",
  borderSubtle: "--color-border-subtle",
  border: "--color-border",
  borderActive: "--color-border-active",
  primary: "--color-primary",
  secondary: "--color-secondary",
  accent: "--color-accent",
  textMuted: "--color-text-muted",
  text: "--color-text",
  error: "--color-error",
  warning: "--color-warning",
  success: "--color-success",
  info: "--color-info",
  diffAdded: "--color-diff-added",
  diffRemoved: "--color-diff-removed",
  diffContext: "--color-diff-context",
  diffHunkHeader: "--color-diff-hunk-header",
  diffHighlightAdded: "--color-diff-highlight-added",
  diffHighlightRemoved: "--color-diff-highlight-removed",
  diffAddedBg: "--color-diff-added-bg",
  diffRemovedBg: "--color-diff-removed-bg",
  diffContextBg: "--color-diff-context-bg",
  diffLineNumber: "--color-diff-line-number",
  diffAddedLineNumberBg: "--color-diff-added-line-number-bg",
  diffRemovedLineNumberBg: "--color-diff-removed-line-number-bg",
  markdownText: "--color-markdown-text",
  markdownHeading: "--color-markdown-heading",
  markdownLink: "--color-markdown-link",
  markdownLinkText: "--color-markdown-link-text",
  markdownCode: "--color-markdown-code",
  markdownBlockQuote: "--color-markdown-block-quote",
  markdownEmph: "--color-markdown-emph",
  markdownStrong: "--color-markdown-strong",
  markdownHorizontalRule: "--color-markdown-horizontal-rule",
  markdownListItem: "--color-markdown-list-item",
  markdownListEnumeration: "--color-markdown-list-enumeration",
  markdownImage: "--color-markdown-image",
  markdownImageText: "--color-markdown-image-text",
  markdownCodeBlock: "--color-markdown-code-block",
  syntaxComment: "--color-syntax-comment",
  syntaxKeyword: "--color-syntax-keyword",
  syntaxFunction: "--color-syntax-function",
  syntaxVariable: "--color-syntax-variable",
  syntaxString: "--color-syntax-string",
  syntaxNumber: "--color-syntax-number",
  syntaxType: "--color-syntax-type",
  syntaxOperator: "--color-syntax-operator",
  syntaxPunctuation: "--color-syntax-punctuation",
}

export function applyCSSProperties(theme: Theme, isDark: boolean) {
  const root = document.documentElement
  const mode = isDark ? "dark" : "light"

  for (const [key, varName] of Object.entries(cssVarMap)) {
    const k = key as ThemeKey
    const color = theme[k][mode]
    root.style.setProperty(varName, color)
  }
}

export function getCSSVariableName(key: ThemeKey): string {
  return cssVarMap[key]
}
