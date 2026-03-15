const BASE_URL = "https://dummyjson.com"

export interface Product {
  id: number
  title: string
  category: string
  brand: string
  sku: string
  rating: number
  price: number
  thumbnail: string
}

export interface ProductsResponse {
  products: Product[]
  total: number
  skip: number
  limit: number
}

export interface FetchProductsParams {
  limit?: number
  skip?: number
  sortBy?: string
  order?: "asc" | "desc"
  search?: string
}

export function buildProductsUrl({
  limit = 20,
  skip = 0,
  sortBy,
  order,
  search,
}: FetchProductsParams = {}): string {
  const params = new URLSearchParams({
    limit: String(limit),
    skip: String(skip),
    select: "id,title,category,brand,sku,rating,price,thumbnail",
  })

  if (sortBy) params.set("sortBy", sortBy)
  if (order) params.set("order", order)

  const base = search ? `${BASE_URL}/products/search` : `${BASE_URL}/products`

  if (search) params.set("q", search)

  return `${base}?${params}`
}

export async function fetchProducts(
  params: FetchProductsParams = {},
): Promise<ProductsResponse> {
  const res = await fetch(buildProductsUrl(params))
  if (!res.ok) throw new Error("Ошибка загрузки товаров")
  return res.json()
}
