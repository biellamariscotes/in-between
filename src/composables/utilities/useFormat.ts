export function useFormat() {
  // ─────────────────────────────
  // Title Case
  // ─────────────────────────────

  const toTitleCase = (str: string) =>
    str.replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substring(1).toLowerCase())

  // ─────────────────────────────
  // Camel Case
  // ─────────────────────────────
  const toCamelCase = (str: string) =>
    str
      .replace(/[-_ ]+(.)/g, (_, group1) => group1.toUpperCase())
      .replace(/^(.)/, (_, group1) => group1.toLowerCase())

  // ─────────────────────────────
  // Sentence Case
  // ─────────────────────────────
  const toSentenceCase = (str: string) => {
    if (!str) return ''
    return str.charAt(0).toUpperCase() + str.slice(1)
  }

  return {
    toTitleCase,
    toCamelCase,
    toSentenceCase,
  }
}
