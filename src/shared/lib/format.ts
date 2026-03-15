export function formatPriceParts(price: number): {
  whole: string
  cents: string
} {
  const wholeNum = Math.floor(price)
  const cents = Math.round((price - wholeNum) * 100)
  return {
    whole: wholeNum.toLocaleString("ru-RU"),
    cents: cents.toString().padStart(2, "0"),
  }
}

export function isLowRating(rating: number): boolean {
  return rating < 3
}

export function formatRating(rating: number): string {
  return `${rating.toFixed(1)}/5`
}
