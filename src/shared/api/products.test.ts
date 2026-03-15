import { describe, expect, it } from "vitest"
import { buildProductsUrl } from "./products"

describe("buildProductsUrl", () => {
  it("builds default URL with limit and skip", () => {
    const url = buildProductsUrl()
    expect(url).toContain("dummyjson.com/products?")
    expect(url).toContain("limit=20")
    expect(url).toContain("skip=0")
    expect(url).not.toContain("/search")
  })

  it("uses custom limit and skip", () => {
    const url = buildProductsUrl({ limit: 10, skip: 30 })
    expect(url).toContain("limit=10")
    expect(url).toContain("skip=30")
  })

  it("adds sortBy and order params", () => {
    const url = buildProductsUrl({ sortBy: "price", order: "desc" })
    expect(url).toContain("sortBy=price")
    expect(url).toContain("order=desc")
  })

  it("switches to search endpoint when search is provided", () => {
    const url = buildProductsUrl({ search: "laptop" })
    expect(url).toContain("/products/search?")
    expect(url).toContain("q=laptop")
  })

  it("does not include sortBy/order when not provided", () => {
    const url = buildProductsUrl({})
    expect(url).not.toContain("sortBy")
    expect(url).not.toContain("order")
  })

  it("combines search with sort and pagination", () => {
    const url = buildProductsUrl({
      search: "phone",
      sortBy: "rating",
      order: "asc",
      limit: 5,
      skip: 10,
    })
    expect(url).toContain("/products/search?")
    expect(url).toContain("q=phone")
    expect(url).toContain("sortBy=rating")
    expect(url).toContain("order=asc")
    expect(url).toContain("limit=5")
    expect(url).toContain("skip=10")
  })
})
