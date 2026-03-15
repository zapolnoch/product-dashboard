import { expect, test } from "@playwright/test"

test("login → table search, sort, pagination", async ({ page }) => {
  // ─── Авторизация ───
  await page.goto("/login")
  await page.getByPlaceholder("Введите логин").fill("emilys")
  await page.getByPlaceholder("Введите пароль").fill("emilyspass")
  await page.getByRole("button", { name: "Войти" }).click()

  // Ждем редирект на страницу товаров
  await expect(page.getByRole("heading", { name: "Товары" })).toBeVisible({
    timeout: 10_000,
  })
  await expect(page).toHaveURL("/")

  // Ждем загрузки таблицы
  const table = page.locator("table")
  await expect(table).toBeVisible()
  const rows = page.locator(".ant-table-tbody > tr")
  await expect(rows.first()).toBeVisible()

  // Проверяем что таблица содержит данные
  const initialCount = await rows.count()
  expect(initialCount).toBeGreaterThan(0)

  // Проверяем наличие столбцов
  for (const col of [
    "Наименование",
    "Вендор",
    "Артикул",
    "Оценка",
    "Цена, ₽",
  ]) {
    await expect(page.locator("th").filter({ hasText: col })).toBeVisible()
  }

  // ─── Поиск ───
  const searchInput = page.getByPlaceholder("Найти")
  await searchInput.fill("Laptop")

  // Ждем debounce (400мс) + ответ API
  await page.waitForResponse(
    (r) => r.url().includes("/products/search") && r.status() === 200,
  )
  await expect(rows.first()).toBeVisible()

  // Результаты должны содержать "Laptop"
  const firstTitle = await rows.first().locator("td").first().innerText()
  expect(firstTitle.toLowerCase()).toContain("laptop")

  // Очищаем поиск
  await searchInput.clear()
  await page.waitForResponse(
    (r) => r.url().includes("/products?") && r.status() === 200,
  )
  await expect(rows.first()).toBeVisible()

  // ─── Сортировка по цене ───
  const priceHeader = page.locator("th").filter({ hasText: "Цена, ₽" })
  await priceHeader.click()

  await page.waitForResponse(
    (r) => r.url().includes("sortBy=price") && r.status() === 200,
  )
  await expect(rows.first()).toBeVisible()

  // Собираем цены — парсим текст ячеек колонки "Цена"
  const priceTexts = await page
    .locator(".ant-table-tbody > tr > td:nth-child(5)")
    .allInnerTexts()

  const prices = priceTexts.map((t) =>
    Number.parseFloat(t.replace(/\s/g, "").replace(",", ".")),
  )

  // Проверяем что цены отсортированы (asc)
  for (let i = 1; i < prices.length; i++) {
    expect(prices[i]).toBeGreaterThanOrEqual(prices[i - 1])
  }

  // ─── Пагинация ───
  // Запоминаем первый товар на странице 1
  const firstProductPage1 = await rows.first().locator("td").first().innerText()

  // Кликаем на страницу 2
  const page2Btn = page.locator("button", { hasText: "2" }).last()
  await page2Btn.click()

  await page.waitForResponse(
    (r) => r.url().includes("skip=20") && r.status() === 200,
  )
  await expect(rows.first()).toBeVisible()

  // Товар на странице 2 должен отличаться от страницы 1
  const firstProductPage2 = await rows.first().locator("td").first().innerText()
  expect(firstProductPage2).not.toBe(firstProductPage1)

  // Проверяем текст "Показано 21-40 из ..."
  await expect(page.locator("text=21-40")).toBeVisible()
})
