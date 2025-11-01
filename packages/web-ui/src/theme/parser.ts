import type { Theme, ThemeJSON, AdaptiveColor } from "./types"

function resolveColor(color: string, defs: Record<string, string>, visited = new Set<string>()): string {
  if (visited.has(color)) return color
  if (!defs[color]) return color

  visited.add(color)
  const val = defs[color]
  return val.startsWith("#") ? val : resolveColor(val, defs, visited)
}

function resolveAdaptiveColor(ac: AdaptiveColor, defs: Record<string, string>): AdaptiveColor {
  return {
    dark: resolveColor(ac.dark, defs),
    light: resolveColor(ac.light, defs),
  }
}

export function parseTheme(data: ThemeJSON): Theme {
  const defs = data.defs
  const t = data.theme

  return {
    background: resolveAdaptiveColor(t.background as AdaptiveColor, defs),
    backgroundPanel: resolveAdaptiveColor(t.backgroundPanel as AdaptiveColor, defs),
    backgroundElement: resolveAdaptiveColor(t.backgroundElement as AdaptiveColor, defs),
    borderSubtle: resolveAdaptiveColor(t.borderSubtle as AdaptiveColor, defs),
    border: resolveAdaptiveColor(t.border as AdaptiveColor, defs),
    borderActive: resolveAdaptiveColor(t.borderActive as AdaptiveColor, defs),
    primary: resolveAdaptiveColor(t.primary as AdaptiveColor, defs),
    secondary: resolveAdaptiveColor(t.secondary as AdaptiveColor, defs),
    accent: resolveAdaptiveColor(t.accent as AdaptiveColor, defs),
    textMuted: resolveAdaptiveColor(t.textMuted as AdaptiveColor, defs),
    text: resolveAdaptiveColor(t.text as AdaptiveColor, defs),
    error: resolveAdaptiveColor(t.error as AdaptiveColor, defs),
    warning: resolveAdaptiveColor(t.warning as AdaptiveColor, defs),
    success: resolveAdaptiveColor(t.success as AdaptiveColor, defs),
    info: resolveAdaptiveColor(t.info as AdaptiveColor, defs),
    diffAdded: resolveAdaptiveColor(t.diffAdded as AdaptiveColor, defs),
    diffRemoved: resolveAdaptiveColor(t.diffRemoved as AdaptiveColor, defs),
    diffContext: resolveAdaptiveColor(t.diffContext as AdaptiveColor, defs),
    diffHunkHeader: resolveAdaptiveColor(t.diffHunkHeader as AdaptiveColor, defs),
    diffHighlightAdded: resolveAdaptiveColor(t.diffHighlightAdded as AdaptiveColor, defs),
    diffHighlightRemoved: resolveAdaptiveColor(t.diffHighlightRemoved as AdaptiveColor, defs),
    diffAddedBg: resolveAdaptiveColor(t.diffAddedBg as AdaptiveColor, defs),
    diffRemovedBg: resolveAdaptiveColor(t.diffRemovedBg as AdaptiveColor, defs),
    diffContextBg: resolveAdaptiveColor(t.diffContextBg as AdaptiveColor, defs),
    diffLineNumber: resolveAdaptiveColor(t.diffLineNumber as AdaptiveColor, defs),
    diffAddedLineNumberBg: resolveAdaptiveColor(t.diffAddedLineNumberBg as AdaptiveColor, defs),
    diffRemovedLineNumberBg: resolveAdaptiveColor(t.diffRemovedLineNumberBg as AdaptiveColor, defs),
    markdownText: resolveAdaptiveColor(t.markdownText as AdaptiveColor, defs),
    markdownHeading: resolveAdaptiveColor(t.markdownHeading as AdaptiveColor, defs),
    markdownLink: resolveAdaptiveColor(t.markdownLink as AdaptiveColor, defs),
    markdownLinkText: resolveAdaptiveColor(t.markdownLinkText as AdaptiveColor, defs),
    markdownCode: resolveAdaptiveColor(t.markdownCode as AdaptiveColor, defs),
    markdownBlockQuote: resolveAdaptiveColor(t.markdownBlockQuote as AdaptiveColor, defs),
    markdownEmph: resolveAdaptiveColor(t.markdownEmph as AdaptiveColor, defs),
    markdownStrong: resolveAdaptiveColor(t.markdownStrong as AdaptiveColor, defs),
    markdownHorizontalRule: resolveAdaptiveColor(t.markdownHorizontalRule as AdaptiveColor, defs),
    markdownListItem: resolveAdaptiveColor(t.markdownListItem as AdaptiveColor, defs),
    markdownListEnumeration: resolveAdaptiveColor(t.markdownListEnumeration as AdaptiveColor, defs),
    markdownImage: resolveAdaptiveColor(t.markdownImage as AdaptiveColor, defs),
    markdownImageText: resolveAdaptiveColor(t.markdownImageText as AdaptiveColor, defs),
    markdownCodeBlock: resolveAdaptiveColor(t.markdownCodeBlock as AdaptiveColor, defs),
    syntaxComment: resolveAdaptiveColor(t.syntaxComment as AdaptiveColor, defs),
    syntaxKeyword: resolveAdaptiveColor(t.syntaxKeyword as AdaptiveColor, defs),
    syntaxFunction: resolveAdaptiveColor(t.syntaxFunction as AdaptiveColor, defs),
    syntaxVariable: resolveAdaptiveColor(t.syntaxVariable as AdaptiveColor, defs),
    syntaxString: resolveAdaptiveColor(t.syntaxString as AdaptiveColor, defs),
    syntaxNumber: resolveAdaptiveColor(t.syntaxNumber as AdaptiveColor, defs),
    syntaxType: resolveAdaptiveColor(t.syntaxType as AdaptiveColor, defs),
    syntaxOperator: resolveAdaptiveColor(t.syntaxOperator as AdaptiveColor, defs),
    syntaxPunctuation: resolveAdaptiveColor(t.syntaxPunctuation as AdaptiveColor, defs),
  }
}
