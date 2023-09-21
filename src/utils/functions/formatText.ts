export function formatText(text: string) {
  return text.replace(/`([^`]+)`/g, '<span class="inline-code">$1</span>')
}
