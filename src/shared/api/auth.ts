const BASE_URL = "https://dummyjson.com"

export interface AuthUser {
  id: number
  username: string
  email: string
  firstName: string
  lastName: string
  gender: string
  image: string
  accessToken: string
  refreshToken: string
}

export interface AuthError {
  message: string
}

export async function login(
  username: string,
  password: string,
): Promise<AuthUser> {
  const res = await fetch(`${BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password, expiresInMins: 60 }),
  })

  if (!res.ok) {
    const err: AuthError = await res.json()
    throw new Error(err.message || "Ошибка авторизации")
  }

  return res.json()
}

export async function getMe(accessToken: string): Promise<AuthUser> {
  const res = await fetch(`${BASE_URL}/auth/me`, {
    method: "GET",
    headers: { Authorization: `Bearer ${accessToken}` },
  })

  if (!res.ok) {
    throw new Error("Сессия истекла")
  }

  return res.json()
}

export async function refreshSession(
  refreshToken: string,
): Promise<{ accessToken: string; refreshToken: string }> {
  const res = await fetch(`${BASE_URL}/auth/refresh`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refreshToken, expiresInMins: 60 }),
  })

  if (!res.ok) {
    throw new Error("Не удалось обновить сессию")
  }

  return res.json()
}
