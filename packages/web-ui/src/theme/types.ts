export interface AdaptiveColor {
  dark: string
  light: string
}

export interface Theme {
  // Background colors
  background: AdaptiveColor
  backgroundPanel: AdaptiveColor
  backgroundElement: AdaptiveColor

  // Border colors
  borderSubtle: AdaptiveColor
  border: AdaptiveColor
  borderActive: AdaptiveColor

  // Brand colors
  primary: AdaptiveColor
  secondary: AdaptiveColor
  accent: AdaptiveColor

  // Text colors
  textMuted: AdaptiveColor
  text: AdaptiveColor

  // Status colors
  error: AdaptiveColor
  warning: AdaptiveColor
  success: AdaptiveColor
  info: AdaptiveColor

  // Diff view colors
  diffAdded: AdaptiveColor
  diffRemoved: AdaptiveColor
  diffContext: AdaptiveColor
  diffHunkHeader: AdaptiveColor
  diffHighlightAdded: AdaptiveColor
  diffHighlightRemoved: AdaptiveColor
  diffAddedBg: AdaptiveColor
  diffRemovedBg: AdaptiveColor
  diffContextBg: AdaptiveColor
  diffLineNumber: AdaptiveColor
  diffAddedLineNumberBg: AdaptiveColor
  diffRemovedLineNumberBg: AdaptiveColor

  // Markdown colors
  markdownText: AdaptiveColor
  markdownHeading: AdaptiveColor
  markdownLink: AdaptiveColor
  markdownLinkText: AdaptiveColor
  markdownCode: AdaptiveColor
  markdownBlockQuote: AdaptiveColor
  markdownEmph: AdaptiveColor
  markdownStrong: AdaptiveColor
  markdownHorizontalRule: AdaptiveColor
  markdownListItem: AdaptiveColor
  markdownListEnumeration: AdaptiveColor
  markdownImage: AdaptiveColor
  markdownImageText: AdaptiveColor
  markdownCodeBlock: AdaptiveColor

  // Syntax highlighting colors
  syntaxComment: AdaptiveColor
  syntaxKeyword: AdaptiveColor
  syntaxFunction: AdaptiveColor
  syntaxVariable: AdaptiveColor
  syntaxString: AdaptiveColor
  syntaxNumber: AdaptiveColor
  syntaxType: AdaptiveColor
  syntaxOperator: AdaptiveColor
  syntaxPunctuation: AdaptiveColor
}

export interface ThemeJSON {
  $schema?: string
  defs: Record<string, string>
  theme: Record<string, AdaptiveColor>
}
