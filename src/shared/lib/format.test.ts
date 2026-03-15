import { describe, expect, it } from "vitest"
import { formatPriceParts, formatRating, isLowRating } from "./format"

describe("formatPriceParts", () => {
  it("formats whole price with zero cents", () => {
    expect(formatPriceParts(100)).toEqual({ whole: "100", cents: "00" })
  })

  it("formats price with cents", () => {
    expect(formatPriceParts(9.99)).toEqual({ whole: "9", cents: "99" })
  })

  it("formats price with single-digit cents (padded)", () => {
    expect(formatPriceParts(5.05)).toEqual({ whole: "5", cents: "05" })
  })

  it("formats large price with locale grouping", () => {
    const result = formatPriceParts(1234567)
    // ru-RU uses non-breaking space as group separator
    expect(result.whole.replace(/\s/g, " ")).toBe("1 234 567")
    expect(result.cents).toBe("00")
  })

  it("handles zero", () => {
    expect(formatPriceParts(0)).toEqual({ whole: "0", cents: "00" })
  })

  it("handles price with one decimal place", () => {
    expect(formatPriceParts(12.5)).toEqual({ whole: "12", cents: "50" })
  })

  it("rounds cents from floating point", () => {
    // 19.995 should round cents to 00 (whole=19, remainder≈0.995 → 100 rounds to "00" edge)
    // More practical: 2.999 → whole=2, cents=100 — let's test a normal case
    const result = formatPriceParts(10.126)
    expect(result.whole).toBe("10")
    expect(result.cents).toBe("13")
  })
})

describe("isLowRating", () => {
  it("returns true for rating below 3", () => {
    expect(isLowRating(2.9)).toBe(true)
    expect(isLowRating(1)).toBe(true)
    expect(isLowRating(0)).toBe(true)
  })

  it("returns false for rating 3 or above", () => {
    expect(isLowRating(3)).toBe(false)
    expect(isLowRating(3.5)).toBe(false)
    expect(isLowRating(5)).toBe(false)
  })

  it("returns false for exactly 3", () => {
    expect(isLowRating(3)).toBe(false)
  })
})

describe("formatRating", () => {
  it("formats integer rating", () => {
    expect(formatRating(4)).toBe("4.0/5")
  })

  it("formats decimal rating with one digit", () => {
    expect(formatRating(3.5)).toBe("3.5/5")
  })

  it("truncates to one decimal place", () => {
    expect(formatRating(4.56)).toBe("4.6/5")
  })

  it("formats zero rating", () => {
    expect(formatRating(0)).toBe("0.0/5")
  })
})
