/**
 * Format a number with specified decimal places
 */
export function formatNumber(value: number, decimals: number = 2): string {
  return value.toFixed(decimals)
}

/**
 * Format a date to a readable string
 */
export function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

/**
 * Format a date to short format (e.g., Jan 2024)
 */
export function formatDateShort(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
  })
}

/**
 * Format credits with proper singular/plural
 */
export function formatCredits(credits: number): string {
  return `${credits} ${credits === 1 ? 'Credit' : 'Credits'}`
}

/**
 * Truncate text with ellipsis
 */
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength - 3) + '...'
}
